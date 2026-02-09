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
import * as opensearchserverless from "aws-cdk-lib/aws-opensearchserverless";
import * as cr from "aws-cdk-lib/custom-resources";
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
        },
      }
    );

    // Function URL with response streaming
    // CORS on Function URL handles preflight (OPTIONS) automatically.
    // Lambda must NOT set Access-Control-Allow-Origin to avoid duplicates.
    const aiPlaygroundUrl = aiPlaygroundHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: ["*"],
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
        },
      }
    );

    const techAdvisorUrl = techAdvisorHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: ["*"],
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
        },
      }
    );

    const websiteRemixUrl = websiteRemixHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: ["*"],
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
        },
      }
    );

    const liveTranslationUrl = liveTranslationHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: ["*"],
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
        },
      }
    );

    const agentVisualizerUrl = agentVisualizerHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: ["*"],
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

    // ── Knowledge Bot Infrastructure (S3 + Bedrock Knowledge Base) ──────

    // S3 bucket for knowledge base documents
    const knowledgeBucket = new s3.Bucket(this, "KnowledgeBucket", {
      bucketName: `creative-it-knowledge-${config.envName}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Deploy knowledge base documents to S3
    const kbDocsDeploy = new s3deploy.BucketDeployment(this, "KnowledgeBaseDocsDeploy", {
      sources: [
        s3deploy.Source.asset(
          path.join(__dirname, "..", "knowledge-base")
        ),
      ],
      destinationBucket: knowledgeBucket,
    });

    // Knowledge Base + Data Source IDs (created manually in Bedrock console)
    const kbConfig: Record<string, { knowledgeBaseId: string; dataSourceId: string }> = {
      gw:   { knowledgeBaseId: "GQFVI7ZE8C", dataSourceId: "JK5CKEJDFV" },
      prod: { knowledgeBaseId: "ME4IUCQZDU", dataSourceId: "HEMTOV1CFQ" },
    };
    const kb = kbConfig[config.envName];

    // Auto-sync Knowledge Base after S3 docs are deployed
    if (kb?.knowledgeBaseId && kb?.dataSourceId) {
      const kbSync = new cr.AwsCustomResource(this, "KnowledgeBaseSyncTrigger", {
        onUpdate: {
          service: "BedrockAgent",
          action: "startIngestionJob",
          parameters: {
            knowledgeBaseId: kb.knowledgeBaseId,
            dataSourceId: kb.dataSourceId,
          },
          physicalResourceId: cr.PhysicalResourceId.of(
            `kb-sync-${Date.now()}`
          ),
        },
        policy: cr.AwsCustomResourcePolicy.fromStatements([
          new iam.PolicyStatement({
            actions: ["bedrock:StartIngestionJob"],
            resources: [
              `arn:aws:bedrock:${config.region}:${config.account}:knowledge-base/${kb.knowledgeBaseId}`,
            ],
          }),
        ]),
      });
      kbSync.node.addDependency(kbDocsDeploy);
    }

    // ── Hashnode Sync Lambda (fetches blog articles → S3 → KB re-index) ──
    const hashnodeSyncHandler = new lambdaNode.NodejsFunction(
      this,
      "HashnodeSyncHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 256,
        timeout: cdk.Duration.seconds(120),
        entry: path.join(
          __dirname,
          "..",
          "lambda",
          "hashnode-sync",
          "index.ts"
        ),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: ["@aws-sdk/*"],
        },
        environment: {
          BUCKET_NAME: knowledgeBucket.bucketName,
          KNOWLEDGE_BASE_ID: kb?.knowledgeBaseId ?? "",
          DATA_SOURCE_ID: kb?.dataSourceId ?? "",
          HASHNODE_HOST: "buildgrowmatter.hashnode.dev",
        },
      }
    );

    hashnodeSyncHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["s3:PutObject", "s3:DeleteObject"],
        resources: [`${knowledgeBucket.bucketArn}/hashnode/*`],
      })
    );

    if (kb?.knowledgeBaseId) {
      hashnodeSyncHandler.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ["bedrock:StartIngestionJob"],
          resources: [
            `arn:aws:bedrock:${config.region}:${config.account}:knowledge-base/${kb.knowledgeBaseId}`,
          ],
        })
      );
    }

    const hashnodeSyncSchedulerRole = new iam.Role(
      this,
      "HashnodeSyncSchedulerRole",
      {
        assumedBy: new iam.ServicePrincipal("scheduler.amazonaws.com"),
      }
    );

    hashnodeSyncHandler.grantInvoke(hashnodeSyncSchedulerRole);

    new scheduler.CfnSchedule(this, "HashnodeSyncSchedule", {
      name: `hashnode-sync-daily-${config.envName}`,
      scheduleExpression: "cron(0 6 * * ? *)",
      scheduleExpressionTimezone: "UTC",
      flexibleTimeWindow: { mode: "OFF" },
      target: {
        arn: hashnodeSyncHandler.functionArn,
        roleArn: hashnodeSyncSchedulerRole.roleArn,
      },
      state: "ENABLED",
    });

    // IAM role for Bedrock Knowledge Base to access S3 and embedding model
    const kbRole = new iam.Role(this, "KnowledgeBaseRole", {
      assumedBy: new iam.ServicePrincipal("bedrock.amazonaws.com"),
      inlinePolicies: {
        BedrockS3Access: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: ["s3:GetObject", "s3:ListBucket"],
              resources: [
                knowledgeBucket.bucketArn,
                `${knowledgeBucket.bucketArn}/*`,
              ],
            }),
            new iam.PolicyStatement({
              actions: ["bedrock:InvokeModel"],
              resources: [
                "arn:aws:bedrock:eu-central-1::foundation-model/amazon.titan-embed-text-v2:0",
              ],
            }),
          ],
        }),
      },
    });

    // OpenSearch Serverless encryption policy (must exist before collection)
    const ossEncryptionPolicy = new opensearchserverless.CfnSecurityPolicy(
      this,
      "KBEncryptionPolicy",
      {
        name: `creative-it-kb-enc-${config.envName}`,
        type: "encryption",
        policy: JSON.stringify({
          Rules: [
            {
              ResourceType: "collection",
              Resource: [`collection/creative-it-kb-${config.envName}`],
            },
          ],
          AWSOwnedKey: true,
        }),
      }
    );

    // OpenSearch Serverless network policy (must exist before collection)
    const ossNetworkPolicy = new opensearchserverless.CfnSecurityPolicy(
      this,
      "KBNetworkPolicy",
      {
        name: `creative-it-kb-net-${config.envName}`,
        type: "network",
        policy: JSON.stringify([
          {
            Rules: [
              {
                ResourceType: "collection",
                Resource: [`collection/creative-it-kb-${config.envName}`],
              },
              {
                ResourceType: "dashboard",
                Resource: [`collection/creative-it-kb-${config.envName}`],
              },
            ],
            AllowFromPublic: true,
          },
        ]),
      }
    );

    // OpenSearch Serverless collection for vector store
    const ossCollection = new opensearchserverless.CfnCollection(
      this,
      "KBVectorCollection",
      {
        name: `creative-it-kb-${config.envName}`,
        type: "VECTORSEARCH",
      }
    );

    // Collection depends on security policies being created first
    ossCollection.addDependency(ossEncryptionPolicy);
    ossCollection.addDependency(ossNetworkPolicy);

    // OpenSearch Serverless data access policy
    new opensearchserverless.CfnAccessPolicy(
      this,
      "KBDataAccessPolicy",
      {
        name: `creative-it-kb-data-${config.envName}`,
        type: "data",
        policy: JSON.stringify([
          {
            Rules: [
              {
                ResourceType: "collection",
                Resource: [`collection/creative-it-kb-${config.envName}`],
                Permission: [
                  "aoss:CreateCollectionItems",
                  "aoss:UpdateCollectionItems",
                  "aoss:DescribeCollectionItems",
                ],
              },
              {
                ResourceType: "index",
                Resource: [`index/creative-it-kb-${config.envName}/*`],
                Permission: [
                  "aoss:CreateIndex",
                  "aoss:UpdateIndex",
                  "aoss:DescribeIndex",
                  "aoss:ReadDocument",
                  "aoss:WriteDocument",
                ],
              },
            ],
            Principal: [kbRole.roleArn],
          },
        ]),
      }
    );

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
            "@aws-sdk/client-bedrock-agent-runtime",
          ],
        },
        environment: {
          TABLE_NAME: githubStatsTable.tableName,
          KNOWLEDGE_BASE_ID: kb?.knowledgeBaseId ?? "",
          MODEL_ARN: `arn:aws:bedrock:eu-central-1:${config.account}:inference-profile/eu.anthropic.claude-sonnet-4-20250514-v1:0`,
        },
      }
    );

    const knowledgeBotUrl = knowledgeBotHandler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
      cors: {
        allowedOrigins: ["*"],
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ["Content-Type"],
        exposedHeaders: ["X-Remaining-Requests", "X-Session-Id"],
        maxAge: cdk.Duration.hours(1),
      },
    });

    knowledgeBotHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "bedrock:RetrieveAndGenerate",
          "bedrock:Retrieve",
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
          "bedrock:GetInferenceProfile",
        ],
        resources: ["*"],
      })
    );

    knowledgeBotHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          "aws-marketplace:ViewSubscriptions",
          "aws-marketplace:Subscribe",
        ],
        resources: ["*"],
      })
    );

    githubStatsTable.grantReadWriteData(knowledgeBotHandler);

    // ── API Gateway HTTP API v2 ────────────────────────────────────────
    const httpApi = new apigwv2.HttpApi(this, "ContactApi", {
      apiName: "creative-it-contact-api",
      corsPreflight: {
        allowOrigins: ["*"],
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

    // ── Outputs ────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, "ApiUrl", {
      value: `https://${apiDomainName}/contact`,
      description: "Contact API endpoint",
    });

    new cdk.CfnOutput(this, "GitHubStatsUrl", {
      value: `https://${apiDomainName}/github-stats`,
      description: "GitHub Stats API endpoint",
    });

    new cdk.CfnOutput(this, "HttpApiUrl", {
      value: httpApi.apiEndpoint,
      description: "API Gateway default endpoint",
    });

    new cdk.CfnOutput(this, "AiPlaygroundUrl", {
      value: aiPlaygroundUrl.url,
      description: "AI Playground Function URL (streaming)",
    });

    new cdk.CfnOutput(this, "CommitStoryUrl", {
      value: `https://${apiDomainName}/commit-story`,
      description: "Commit Story API endpoint",
    });

    new cdk.CfnOutput(this, "TechAdvisorUrl", {
      value: techAdvisorUrl.url,
      description: "Tech Advisor Function URL (streaming)",
    });

    new cdk.CfnOutput(this, "WebsiteRemixUrl", {
      value: websiteRemixUrl.url,
      description: "Website Remix Function URL (streaming)",
    });

    new cdk.CfnOutput(this, "AgentVisualizerUrl", {
      value: agentVisualizerUrl.url,
      description: "Agent Visualizer Function URL (streaming)",
    });

    new cdk.CfnOutput(this, "LiveTranslationUrl", {
      value: liveTranslationUrl.url,
      description: "Live Translation Function URL (streaming)",
    });

    new cdk.CfnOutput(this, "KnowledgeBotUrl", {
      value: knowledgeBotUrl.url,
      description: "Knowledge Bot Function URL (streaming)",
    });

    new cdk.CfnOutput(this, "KnowledgeBucketName", {
      value: knowledgeBucket.bucketName,
      description: "Knowledge Base S3 bucket",
    });
  }
}
