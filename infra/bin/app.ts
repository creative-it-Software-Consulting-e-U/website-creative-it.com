#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ContactApiStack } from "../lib/contact-api-stack";

const app = new cdk.App();

new ContactApiStack(app, "ContactApiStack", {
  env: {
    account: "348854311973",
    region: "eu-central-1",
  },
});
