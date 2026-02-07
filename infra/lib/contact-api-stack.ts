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
import { Construct } from "constructs";
import * as path from "path";

export class ContactApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domainName = "creative-it.com";
    const apiDomainName = `api.${domainName}`;
    const allowedOrigins = [
      `https://${domainName}`,
      `https://www.${domainName}`,
    ];

    // ── Route53 Hosted Zone (existing) ─────────────────────────────────
    const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
      domainName,
    });

    // ── SES Domain Identity with DKIM ──────────────────────────────────
    new ses.EmailIdentity(this, "SesIdentity", {
      identity: ses.Identity.publicHostedZone(hostedZone),
    });

    // ── ACM Certificate for api.creative-it.com ────────────────────────
    const certificate = new acm.Certificate(this, "ApiCertificate", {
      domainName: apiDomainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // ── Lambda Function ────────────────────────────────────────────────
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
          RECIPIENT_EMAIL: `info@${domainName}`,
          ALLOWED_ORIGINS: allowedOrigins.join(","),
        },
      }
    );

    contactHandler.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["ses:SendEmail", "ses:SendRawEmail"],
        resources: [
          `arn:aws:ses:${this.region}:${this.account}:identity/${domainName}`,
          `arn:aws:ses:${this.region}:${this.account}:identity/info@${domainName}`,
        ],
      })
    );

    // ── GitHub Stats Lambda ──────────────────────────────────────────
    const githubStatsHandler = new lambdaNode.NodejsFunction(
      this,
      "GitHubStatsHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        architecture: lambda.Architecture.ARM_64,
        memorySize: 256,
        timeout: cdk.Duration.seconds(15),
        entry: path.join(__dirname, "..", "lambda", "github-stats", "index.ts"),
        handler: "handler",
        bundling: {
          format: lambdaNode.OutputFormat.ESM,
          mainFields: ["module", "main"],
          externalModules: ["@aws-sdk/*"],
        },
        environment: {
          GITHUB_TOKEN: process.env.GITHUB_TOKEN ?? "",
          GITHUB_ORG: "creative-it-Software-Consulting-e-U",
          ALLOWED_ORIGINS: allowedOrigins.join(","),
        },
      }
    );

    // ── API Gateway HTTP API v2 ────────────────────────────────────────
    const httpApi = new apigwv2.HttpApi(this, "ContactApi", {
      apiName: "creative-it-contact-api",
      corsPreflight: {
        allowOrigins: allowedOrigins,
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
