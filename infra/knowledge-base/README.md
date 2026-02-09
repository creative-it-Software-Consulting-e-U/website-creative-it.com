# Knowledge Base Documents

This directory contains documents for the Bedrock Knowledge Base that powers the creative-it AI chat widget.

## How it works

1. Documents in this directory are uploaded to the S3 bucket `creative-it-knowledge-{env}`
2. Bedrock Knowledge Base indexes these documents using the Titan embedding model
3. The knowledge bot Lambda uses RetrieveAndGenerate to answer questions using this context

## Adding documents

To add new content to the knowledge base:

1. Add a markdown file to this directory
2. Deploy the CDK stack: the S3 data source will be synced
3. Trigger a Knowledge Base sync in the AWS Console (Bedrock > Knowledge bases > Sync)

## File format

- Use Markdown (.md) for best results
- Structure content with clear headings
- Include relevant keywords naturally
- Keep individual files focused on a topic
