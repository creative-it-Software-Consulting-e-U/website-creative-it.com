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
  }
}
