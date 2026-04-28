import * as cdk from "aws-cdk-lib";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as ses from "aws-cdk-lib/aws-ses";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNode from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as apigwv2Integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as scheduler from "aws-cdk-lib/aws-scheduler";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";
import * as path from "path";

export interface EnvConfig {
  envName: string;
  account: string;
  region: string;
  domainName: string;
  senderEmail: string;
  recipientEmail: string;
  allowedOrigins: string[];
  /** WAF Web ACL ARN created by CloudFront pricing plan (us-east-1, scope CLOUDFRONT) */
  webAclArn?: string;
}

interface ContactApiStackProps extends cdk.StackProps {
  config: EnvConfig;
}

export class ContactApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ContactApiStackProps) {
    super(scope, id, props);

    const { config } = props;
    const apiDomainName = `api.${config.domainName}`;

    // ── Route53 Hosted Zone (existing) ─────────────────────────────────
    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName: config.domainName,
    });

    // ── SES Domain Identity with DKIM ──────────────────────────────────
    new ses.EmailIdentity(this, "SesIdentity", {
      identity: ses.Identity.publicHostedZone(hostedZone),
    });

    // ── ACM Certificate for api.<domain> ─────────────────────────────
    const certificate = new acm.Certificate(this, "ApiCertificate", {
      domainName: apiDomainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // ── DynamoDB Table for GitHub Stats ─────────────────────────────────
    const githubStatsTable = new dynamodb.Table(this, "GitHubStatsTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "hour_ts", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: "ttl",
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // ── Contact Lambda ─────────────────────────────────────────────────
    const contactHandler = new lambdaNode.NodejsFunction(
      this,
      "ContactHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 256,
        timeout: cdk.Duration.seconds(10),
        entry: path.join(__dirname, "..", "lambda", "contact", "index.ts"),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: ["@aws-sdk/*"],
        },
        environment: {
          RECIPIENT_EMAIL: config.recipientEmail,
          SENDER_EMAIL: config.senderEmail,
          ALLOWED_ORIGINS: config.allowedOrigins.join(","),
          TABLE_NAME: githubStatsTable.tableName,
        },
      }
    );

    contactHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: [
          `arn:aws:ses:${this.region}:${this.account}:identity/${config.domainName}`,
          `arn:aws:ses:${this.region}:${this.account}:identity/${config.recipientEmail}`,
        ],
      })
    );
    githubStatsTable.grantReadWriteData(contactHandler);

    // ── GitHub Stats API Lambda (reads from DynamoDB) ──────────────────
    const githubStatsHandler = new lambdaNode.NodejsFunction(
      this,
      "GitHubStatsHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 256,
        timeout: cdk.Duration.seconds(10),
        entry: path.join(__dirname, "..", "lambda", "github-stats", "index.ts"),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: ["@aws-sdk/*"],
        },
        environment: {
          TABLE_NAME: githubStatsTable.tableName,
          ALLOWED_ORIGINS: config.allowedOrigins.join(","),
        },
      }
    );

    githubStatsTable.grantReadData(githubStatsHandler);

    // ── GitHub Stats Scheduler Lambda (fetches from GitHub → DynamoDB) ──
    const githubStatsScheduler = new lambdaNode.NodejsFunction(
      this,
      "GitHubStatsScheduler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 256,
        timeout: cdk.Duration.seconds(120),
        entry: path.join(
          __dirname,
          "..",
          "lambda",
          "github-stats-scheduler",
          "index.ts"
        ),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: ["@aws-sdk/*"],
        },
        environment: {
          GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? "",
          GITHUB_ORG: "creative-it-Software-Consulting-e-U",
          TABLE_NAME: githubStatsTable.tableName,
        },
      }
    );

    githubStatsTable.grantReadWriteData(githubStatsScheduler);

    // ── GitHub Webhook Lambda (real-time push events → DynamoDB) ───────
    const githubWebhookHandler = new lambdaNode.NodejsFunction(
      this,
      "GitHubWebhookHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 256,
        timeout: cdk.Duration.seconds(30),
        entry: path.join(
          __dirname,
          "..",
          "lambda",
          "github-webhook",
          "index.ts"
        ),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: ["@aws-sdk/*"],
        },
        environment: {
          TABLE_NAME: githubStatsTable.tableName,
          WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET ?? "",
          GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? "",
          GITHUB_ORG: "creative-it-Software-Consulting-e-U",
        },
      }
    );

    githubStatsTable.grantReadWriteData(githubWebhookHandler);

    // ── EventBridge Scheduler (every hour at x:00) ─────────────────────
    const schedulerRole = new iam.Role(this, "GitHubStatsSchedulerRole", {
      assumedBy: new iam.ServicePrincipal("scheduler.amazonaws.com"),
    });

    githubStatsScheduler.grantInvoke(schedulerRole);

    new scheduler.CfnSchedule(this, "GitHubStatsSchedule", {
      name: `github-stats-hourly-${config.envName}`,
      scheduleExpression: "cron(0 * * * ? *)",
      scheduleExpressionTimezone: "UTC",
      flexibleTimeWindow: { mode: "OFF" },
      target: {
        arn: githubStatsScheduler.functionArn,
        roleArn: schedulerRole.roleArn,
      },
      state: "ENABLED",
    });

    // ── AI Playground Lambda (Bedrock streaming) ──────────────────────
    const aiPlaygroundHandler = new lambdaNode.NodejsFunction(
      this,
      "AiPlaygroundHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 512,
        timeout: cdk.Duration.seconds(60),
        entry: path.join(
          __dirname,
          "..",
          "lambda",
          "ai-playground",
          "index.ts"
        ),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: [
            "@aws-sdk/client-dynamodb",
            "@aws-sdk/lib-dynamodb",
          ],
        },
        environment: {
          TABLE_NAME: githubStatsTable.tableName,
          ALLOWED_ORIGINS: config.allowedOrigins.join(","),
        },
      }
    );

    // Function URL with response streaming.
    // AuthType NONE: security is handled by CloudFront (sole entry point),
    // in-Lambda rate limiting (DynamoDB), CORS origin validation, and WAF.
    const aiPlaygroundUrl = aiPlaygroundHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: config.allowedOrigins,
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ["Content-Type"],
        exposedHeaders: ["X-Remaining-Requests"],
        maxAge: cdk.Duration.hours(1),
      },
    });

    // Bedrock InvokeModelWithResponseStream permission
    aiPlaygroundHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModelWithResponseStream"],
        resources: [
          `arn:aws:bedrock:*:${this.account}:inference-profile/eu.anthropic.claude-sonnet-4-20250514-v1:0`,
          "arn:aws:bedrock:eu-*::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0",
        ],
      })
    );

    // AWS Marketplace permissions required for Bedrock model access
    aiPlaygroundHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "aws-marketplace:ViewSubscriptions",
          "aws-marketplace:Subscribe",
        ],
        resources: ["*"],
      })
    );

    // DynamoDB access for rate limiting
    githubStatsTable.grantReadWriteData(aiPlaygroundHandler);

    // ── Commit Story Lambda (non-streaming, API Gateway) ────────────────
    const commitStoryHandler = new lambdaNode.NodejsFunction(
      this,
      "CommitStoryHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 512,
        timeout: cdk.Duration.seconds(30),
        entry: path.join(
          __dirname,
          "..",
          "lambda",
          "commit-story",
          "index.ts"
        ),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: ["@aws-sdk/*"],
        },
        environment: {
          TABLE_NAME: githubStatsTable.tableName,
          ALLOWED_ORIGINS: config.allowedOrigins.join(","),
        },
      }
    );

    githubStatsTable.grantReadWriteData(commitStoryHandler);

    commitStoryHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModel"],
        resources: [
          `arn:aws:bedrock:*:${this.account}:inference-profile/eu.anthropic.claude-sonnet-4-20250514-v1:0`,
          "arn:aws:bedrock:eu-*::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0",
        ],
      })
    );

    commitStoryHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "aws-marketplace:ViewSubscriptions",
          "aws-marketplace:Subscribe",
        ],
        resources: ["*"],
      })
    );

    // ── Tech Advisor Lambda (Bedrock streaming) ─────────────────────────
    const techAdvisorHandler = new lambdaNode.NodejsFunction(
      this,
      "TechAdvisorHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 512,
        timeout: cdk.Duration.seconds(60),
        entry: path.join(
          __dirname,
          "..",
          "lambda",
          "tech-advisor",
          "index.ts"
        ),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: [
            "@aws-sdk/client-dynamodb",
            "@aws-sdk/lib-dynamodb",
          ],
        },
        environment: {
          TABLE_NAME: githubStatsTable.tableName,
          ALLOWED_ORIGINS: config.allowedOrigins.join(","),
        },
      }
    );

    const techAdvisorUrl = techAdvisorHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: config.allowedOrigins,
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ["Content-Type"],
        exposedHeaders: ["X-Remaining-Requests"],
        maxAge: cdk.Duration.hours(1),
      },
    });

    techAdvisorHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModelWithResponseStream"],
        resources: [
          `arn:aws:bedrock:*:${this.account}:inference-profile/eu.anthropic.claude-sonnet-4-20250514-v1:0`,
          "arn:aws:bedrock:eu-*::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0",
        ],
      })
    );

    techAdvisorHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "aws-marketplace:ViewSubscriptions",
          "aws-marketplace:Subscribe",
        ],
        resources: ["*"],
      })
    );

    githubStatsTable.grantReadWriteData(techAdvisorHandler);

    // ── Website Remix Lambda (Bedrock streaming) ────────────────────────
    const websiteRemixHandler = new lambdaNode.NodejsFunction(
      this,
      "WebsiteRemixHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 512,
        timeout: cdk.Duration.seconds(60),
        entry: path.join(
          __dirname,
          "..",
          "lambda",
          "website-remix",
          "index.ts"
        ),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: [
            "@aws-sdk/client-dynamodb",
            "@aws-sdk/lib-dynamodb",
          ],
        },
        environment: {
          TABLE_NAME: githubStatsTable.tableName,
          ALLOWED_ORIGINS: config.allowedOrigins.join(","),
        },
      }
    );

    const websiteRemixUrl = websiteRemixHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: config.allowedOrigins,
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ["Content-Type"],
        exposedHeaders: ["X-Remaining-Requests"],
        maxAge: cdk.Duration.hours(1),
      },
    });

    websiteRemixHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModelWithResponseStream"],
        resources: [
          `arn:aws:bedrock:*:${this.account}:inference-profile/eu.anthropic.claude-sonnet-4-20250514-v1:0`,
          "arn:aws:bedrock:eu-*::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0",
        ],
      })
    );

    websiteRemixHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "aws-marketplace:ViewSubscriptions",
          "aws-marketplace:Subscribe",
        ],
        resources: ["*"],
      })
    );

    githubStatsTable.grantReadWriteData(websiteRemixHandler);

    // ── Live Translation Lambda (Bedrock streaming) ──────────────────────
    const liveTranslationHandler = new lambdaNode.NodejsFunction(
      this,
      "LiveTranslationHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 512,
        timeout: cdk.Duration.seconds(60),
        entry: path.join(
          __dirname,
          "..",
          "lambda",
          "live-translation",
          "index.ts"
        ),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: [
            "@aws-sdk/client-dynamodb",
            "@aws-sdk/lib-dynamodb",
          ],
        },
        environment: {
          TABLE_NAME: githubStatsTable.tableName,
          ALLOWED_ORIGINS: config.allowedOrigins.join(","),
        },
      }
    );

    const liveTranslationUrl = liveTranslationHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: config.allowedOrigins,
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ["Content-Type"],
        exposedHeaders: ["X-Remaining-Requests"],
        maxAge: cdk.Duration.hours(1),
      },
    });

    liveTranslationHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModelWithResponseStream"],
        resources: [
          `arn:aws:bedrock:*:${this.account}:inference-profile/eu.anthropic.claude-sonnet-4-20250514-v1:0`,
          "arn:aws:bedrock:eu-*::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0",
        ],
      })
    );

    liveTranslationHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "aws-marketplace:ViewSubscriptions",
          "aws-marketplace:Subscribe",
        ],
        resources: ["*"],
      })
    );

    githubStatsTable.grantReadWriteData(liveTranslationHandler);

    // ── Agent Visualizer Lambda (Bedrock streaming) ─────────────────────
    const agentVisualizerHandler = new lambdaNode.NodejsFunction(
      this,
      "AgentVisualizerHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 512,
        timeout: cdk.Duration.seconds(60),
        entry: path.join(
          __dirname,
          "..",
          "lambda",
          "agent-visualizer",
          "index.ts"
        ),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: [
            "@aws-sdk/client-dynamodb",
            "@aws-sdk/lib-dynamodb",
          ],
        },
        environment: {
          TABLE_NAME: githubStatsTable.tableName,
          ALLOWED_ORIGINS: config.allowedOrigins.join(","),
        },
      }
    );

    const agentVisualizerUrl = agentVisualizerHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: config.allowedOrigins,
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ["Content-Type"],
        exposedHeaders: ["X-Remaining-Requests"],
        maxAge: cdk.Duration.hours(1),
      },
    });

    agentVisualizerHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["bedrock:InvokeModelWithResponseStream"],
        resources: [
          `arn:aws:bedrock:*:${this.account}:inference-profile/eu.anthropic.claude-sonnet-4-20250514-v1:0`,
          "arn:aws:bedrock:eu-*::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0",
        ],
      })
    );

    agentVisualizerHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "aws-marketplace:ViewSubscriptions",
          "aws-marketplace:Subscribe",
        ],
        resources: ["*"],
      })
    );

    githubStatsTable.grantReadWriteData(agentVisualizerHandler);

    // ── Knowledge Bot Infrastructure (S3 Embeddings + In-Lambda RAG) ────

    // S3 bucket for pre-computed embeddings (built locally / in CI from
    // infra/knowledge-base/*.md and src/content/blog/*.md, then uploaded here).
    // The Lambda loads the JSON on cold start and runs cosine similarity in
    // memory — far cheaper than OpenSearch Serverless ($0.01/month vs $700+).
    const embeddingsBucket = new s3.Bucket(this, "EmbeddingsBucket", {
      bucketName: `creative-it-embeddings-${config.envName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
    });

    new s3deploy.BucketDeployment(this, "EmbeddingsDeploy", {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, "..", "embeddings")),
      ],
      destinationBucket: embeddingsBucket,
      prune: true,
    });

    // Knowledge Bot Lambda
    const knowledgeBotHandler = new lambdaNode.NodejsFunction(
      this,
      "KnowledgeBotHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 512,
        timeout: cdk.Duration.seconds(60),
        entry: path.join(
          __dirname,
          "..",
          "lambda",
          "knowledge-bot",
          "index.ts"
        ),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: [
            "@aws-sdk/client-dynamodb",
            "@aws-sdk/lib-dynamodb",
            "@aws-sdk/client-bedrock-runtime",
            "@aws-sdk/client-s3",
          ],
        },
        environment: {
          TABLE_NAME: githubStatsTable.tableName,
          EMBEDDINGS_BUCKET: embeddingsBucket.bucketName,
          EMBEDDINGS_KEY: "embeddings.json",
          MODEL_ID: "eu.anthropic.claude-sonnet-4-20250514-v1:0",
          EMBED_MODEL_ID: "amazon.titan-embed-text-v2:0",
          ALLOWED_ORIGINS: config.allowedOrigins.join(","),
        },
      }
    );

    const knowledgeBotUrl = knowledgeBotHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: config.allowedOrigins,
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ["Content-Type"],
        exposedHeaders: ["X-Remaining-Requests", "X-Session-Id"],
        maxAge: cdk.Duration.hours(1),
      },
    });

    knowledgeBotHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
          "bedrock:GetInferenceProfile",
        ],
        resources: ["*"],
      })
    );

    embeddingsBucket.grantRead(knowledgeBotHandler);
    githubStatsTable.grantReadWriteData(knowledgeBotHandler);

    // ── API Gateway HTTP API v2 ────────────────────────────────────────
    const httpApi = new apigwv2.HttpApi(this, "ContactApi", {
      apiName: "creative-it-contact-api",
      corsPreflight: {
        allowOrigins: config.allowedOrigins,
        allowMethods: [
          apigwv2.CorsHttpMethod.POST,
          apigwv2.CorsHttpMethod.GET,
        ],
        allowHeaders: ["Content-Type"],
        maxAge: cdk.Duration.hours(1),
      },
    });

    httpApi.addRoutes({
      path: "/contact",
      methods: [apigwv2.HttpMethod.POST],
      integration: new apigwv2Integrations.HttpLambdaIntegration(
        "ContactIntegration",
        contactHandler
      ),
    });

    httpApi.addRoutes({
      path: "/github-stats",
      methods: [apigwv2.HttpMethod.GET],
      integration: new apigwv2Integrations.HttpLambdaIntegration(
        "GitHubStatsIntegration",
        githubStatsHandler
      ),
    });

    httpApi.addRoutes({
      path: "/github-webhook",
      methods: [apigwv2.HttpMethod.POST],
      integration: new apigwv2Integrations.HttpLambdaIntegration(
        "GitHubWebhookIntegration",
        githubWebhookHandler
      ),
    });

    httpApi.addRoutes({
      path: "/commit-story",
      methods: [apigwv2.HttpMethod.GET],
      integration: new apigwv2Integrations.HttpLambdaIntegration(
        "CommitStoryIntegration",
        commitStoryHandler
      ),
    });

    // Throttle settings on the default stage
    const defaultStage = httpApi.defaultStage?.node
      .defaultChild as apigwv2.CfnStage;
    defaultStage.defaultRouteSettings = {
      throttlingRateLimit: 10,
      throttlingBurstLimit: 5,
    };

    // ── Custom Domain ──────────────────────────────────────────────────
    const apiDomain = new apigwv2.DomainName(this, "ApiDomain", {
      domainName: apiDomainName,
      certificate,
    });

    new apigwv2.ApiMapping(this, "ApiMapping", {
      api: httpApi,
      domainName: apiDomain,
      stage: httpApi.defaultStage!,
    });

    // ── Route53 A Record ───────────────────────────────────────────────
    new route53.ARecord(this, "ApiARecord", {
      zone: hostedZone,
      recordName: "api",
      target: route53.RecordTarget.fromAlias(
        new route53Targets.ApiGatewayv2DomainProperties(
          apiDomain.regionalDomainName,
          apiDomain.regionalHostedZoneId
        )
      ),
    });

    // ── CloudFront + OAC for AI Streaming Tools ─────────────────────────

    // ACM Certificate for ai.<domain> in us-east-1 (required for CloudFront)
    const aiDomainName = `ai.${config.domainName}`;
    const cfCertificate = new acm.DnsValidatedCertificate(
      this,
      "AiCloudFrontCert",
      {
        domainName: aiDomainName,
        hostedZone,
        region: "us-east-1",
      }
    );

    // CloudFront Function (viewer-request): intercept OPTIONS preflight
    // and return 204 with CORS headers directly at the edge.
    // Lambda Function URLs with IAM auth (OAC) return 403
    // AccessDeniedException for OPTIONS because OAC-signed preflights
    // bypass Lambda's built-in CORS handler.
    const corsPreflightFunction = new cloudfront.Function(
      this,
      "CorsPreflightFunction",
      {
        functionName: `${config.envName}-cors-preflight`,
        runtime: cloudfront.FunctionRuntime.JS_2_0,
        code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  if (request.method === 'OPTIONS') {
    var allowedOrigins = ${JSON.stringify(config.allowedOrigins)};
    var origin = request.headers.origin ? request.headers.origin.value : '';
    var allowOrigin = allowedOrigins.indexOf(origin) >= 0 ? origin : '';
    return {
      statusCode: 204,
      statusDescription: 'No Content',
      headers: {
        'access-control-allow-origin': { value: allowOrigin },
        'access-control-allow-methods': { value: 'POST,OPTIONS' },
        'access-control-allow-headers': { value: 'content-type' },
        'access-control-expose-headers': { value: 'x-remaining-requests,x-session-id' },
        'access-control-max-age': { value: '3600' },
        'vary': { value: 'Origin' },
      },
    };
  }
  return request;
}
        `),
      }
    );

    // CloudFront Function (viewer-response): add CORS headers to every
    // response from Lambda (POST, errors, etc.).  We cannot use custom
    // origin request policies or custom response headers policies because
    // the CloudFront Pro pricing plan forbids both.  CF Functions are the
    // only way to handle CORS end-to-end on this plan.
    const corsResponseFunction = new cloudfront.Function(
      this,
      "CorsResponseFunction",
      {
        functionName: `${config.envName}-cors-response`,
        runtime: cloudfront.FunctionRuntime.JS_2_0,
        code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var response = event.response;
  var allowedOrigins = ${JSON.stringify(config.allowedOrigins)};
  var origin = request.headers.origin ? request.headers.origin.value : '';
  if (allowedOrigins.indexOf(origin) >= 0) {
    response.headers['access-control-allow-origin'] = { value: origin };
    response.headers['access-control-allow-methods'] = { value: 'POST,OPTIONS' };
    response.headers['access-control-allow-headers'] = { value: 'content-type,x-amz-content-sha256' };
    response.headers['access-control-expose-headers'] = { value: 'x-remaining-requests,x-session-id' };
    response.headers['vary'] = { value: 'Origin' };
  }
  return response;
}
        `),
      }
    );

    // Shared behavior config for all AI tool origins.
    // CORS is handled entirely by CloudFront Functions because the Pro
    // pricing plan forbids both custom origin request policies and custom
    // response headers policies.
    const aiBehaviorDefaults = {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
      functionAssociations: [
        {
          function: corsPreflightFunction,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        },
        {
          function: corsResponseFunction,
          eventType: cloudfront.FunctionEventType.VIEWER_RESPONSE,
        },
      ],
    };

    // Helper: wrap a Function URL in a CloudFront origin (no OAC needed
    // since Function URLs use AuthType NONE).
    const fnOrigin = (url: lambda.IFunctionUrl) =>
      new origins.FunctionUrlOrigin(url);

    // CloudFront Distribution with path-based routing to each Lambda
    const aiDistribution = new cloudfront.Distribution(
      this,
      "AiDistribution",
      {
        domainNames: [aiDomainName],
        certificate: cfCertificate,
        webAclId: config.webAclArn,
        defaultBehavior: {
          origin: fnOrigin(aiPlaygroundUrl),
          ...aiBehaviorDefaults,
        },
        additionalBehaviors: {
          "/tech-advisor": {
            origin: fnOrigin(techAdvisorUrl),
            ...aiBehaviorDefaults,
          },
          "/knowledge-bot": {
            origin: fnOrigin(knowledgeBotUrl),
            ...aiBehaviorDefaults,
          },
          "/agent-visualizer": {
            origin: fnOrigin(agentVisualizerUrl),
            ...aiBehaviorDefaults,
          },
          "/website-remix": {
            origin: fnOrigin(websiteRemixUrl),
            ...aiBehaviorDefaults,
          },
          "/live-translation": {
            origin: fnOrigin(liveTranslationUrl),
            ...aiBehaviorDefaults,
          },
        },
      }
    );

    // Route53 A record for ai.<domain> → CloudFront
    new route53.ARecord(this, "AiARecord", {
      zone: hostedZone,
      recordName: "ai",
      target: route53.RecordTarget.fromAlias(
        new route53Targets.CloudFrontTarget(aiDistribution)
      ),
    });

    // ── Outputs ────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, "ApiUrl", {
      value: `https://${apiDomainName}/contact`,
      description: "Contact API endpoint",
    });

    new cdk.CfnOutput(this, "GitHubStatsUrl", {
      value: `https://${apiDomainName}/github-stats`,
      description: "GitHub Stats API endpoint",
    });

    new cdk.CfnOutput(this, "GitHubWebhookUrl", {
      value: `https://${apiDomainName}/github-webhook`,
      description: "GitHub Webhook endpoint",
    });

    new cdk.CfnOutput(this, "HttpApiUrl", {
      value: httpApi.apiEndpoint,
      description: "API Gateway default endpoint",
    });

    new cdk.CfnOutput(this, "AiPlaygroundUrl", {
      value: `https://${aiDomainName}/playground`,
      description: "AI Playground via CloudFront",
    });

    new cdk.CfnOutput(this, "CommitStoryUrl", {
      value: `https://${apiDomainName}/commit-story`,
      description: "Commit Story API endpoint",
    });

    new cdk.CfnOutput(this, "TechAdvisorUrl", {
      value: `https://${aiDomainName}/tech-advisor`,
      description: "Tech Advisor via CloudFront",
    });

    new cdk.CfnOutput(this, "WebsiteRemixUrl", {
      value: `https://${aiDomainName}/website-remix`,
      description: "Website Remix via CloudFront",
    });

    new cdk.CfnOutput(this, "AgentVisualizerUrl", {
      value: `https://${aiDomainName}/agent-visualizer`,
      description: "Agent Visualizer via CloudFront",
    });

    new cdk.CfnOutput(this, "LiveTranslationUrl", {
      value: `https://${aiDomainName}/live-translation`,
      description: "Live Translation via CloudFront",
    });

    new cdk.CfnOutput(this, "KnowledgeBotUrl", {
      value: `https://${aiDomainName}/knowledge-bot`,
      description: "Knowledge Bot via CloudFront",
    });

    new cdk.CfnOutput(this, "AiDistributionDomain", {
      value: aiDistribution.distributionDomainName,
      description: "AI CloudFront distribution domain (for verification)",
    });

    new cdk.CfnOutput(this, "EmbeddingsBucketName", {
      value: embeddingsBucket.bucketName,
      description: "Knowledge Bot embeddings S3 bucket",
    });

    // ── blog.creative-it.com → creative-it.com/blog Redirect (prod only) ──
    if (config.envName === "prod") {
      const blogDomainName = `blog.${config.domainName}`;

      const blogCertificate = new acm.DnsValidatedCertificate(
        this,
        "BlogRedirectCert",
        {
          domainName: blogDomainName,
          hostedZone,
          region: "us-east-1",
        }
      );

      const blogRedirectFunction = new cloudfront.Function(
        this,
        "BlogRedirectFunction",
        {
          functionName: "blog-redirect-prod",
          runtime: cloudfront.FunctionRuntime.JS_2_0,
          code: cloudfront.FunctionCode.fromInline(`
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  // Strip trailing slash (except root)
  if (uri.length > 1 && uri.endsWith('/')) {
    uri = uri.slice(0, -1);
  }
  var location = 'https://${config.domainName}/blog' + (uri === '/' ? '' : uri);
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: location },
      'cache-control': { value: 'max-age=86400' },
    },
  };
}
          `),
        }
      );

      // Dummy S3 origin (CloudFront requires an origin even though
      // the function returns a redirect before the origin is reached)
      const blogRedirectDistribution = new cloudfront.Distribution(
        this,
        "BlogRedirectDistribution",
        {
          domainNames: [blogDomainName],
          certificate: blogCertificate,
          defaultBehavior: {
            origin: new origins.HttpOrigin(config.domainName),
            viewerProtocolPolicy:
              cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            functionAssociations: [
              {
                function: blogRedirectFunction,
                eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
              },
            ],
          },
        }
      );

      new route53.ARecord(this, "BlogRedirectARecord", {
        zone: hostedZone,
        recordName: "blog",
        target: route53.RecordTarget.fromAlias(
          new route53Targets.CloudFrontTarget(blogRedirectDistribution)
        ),
      });
    }

  }
}
