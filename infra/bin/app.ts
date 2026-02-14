#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ContactApiStack, type EnvConfig } from "../lib/contact-api-stack";

const ENV_CONFIGS: Record<string, EnvConfig> = {
  prod: {
    envName: "prod",
    account: "348854311973",
    region: "eu-central-1",
    domainName: "creative-it.com",
    senderEmail: "noreply@creative-it.com",
    recipientEmail: "info@creative-it.com",
    allowedOrigins: [
      "https://creative-it.com",
      "https://www.creative-it.com",
    ],
  },
  gw: {
    envName: "gw",
    account: "734830471883",
    region: "eu-central-1",
    domainName: "gw.dev.creative-it.com",
    senderEmail: "noreply@gw.dev.creative-it.com",
    recipientEmail: "info@gw.dev.creative-it.com",
    allowedOrigins: [
      "https://gw.dev.creative-it.com",
      "https://www.gw.dev.creative-it.com",
      "https://hp.gw.dev.creative-it.com",
      "http://localhost:4321",
    ],
  },
};

const app = new cdk.App();
const envName = app.node.tryGetContext("env") ?? "prod";
const config = ENV_CONFIGS[envName];

if (!config) {
  throw new Error(
    `Unknown environment "${envName}". Valid values: ${Object.keys(ENV_CONFIGS).join(", ")}`
  );
}

new ContactApiStack(app, "ContactApiStack", {
  env: {
    account: config.account,
    region: config.region,
  },
  config,
});
