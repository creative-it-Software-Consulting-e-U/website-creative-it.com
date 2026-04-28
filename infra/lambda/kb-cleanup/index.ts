/**
 * One-shot cleanup Lambda für Bedrock Knowledge Bases und OpenSearch
 * Serverless Orphan Collections, die außerhalb von CDK angelegt wurden.
 *
 * Wird als CDK AwsCustomResource / CloudFormation Custom Resource aufgerufen.
 * Idempotent: nicht-existierende Ressourcen werden ignoriert. OnDelete ist
 * no-op (wir wollen die Ressourcen nicht zurückbringen).
 */

import {
  BedrockAgentClient,
  DeleteKnowledgeBaseCommand,
  DeleteDataSourceCommand,
  ListDataSourcesCommand,
  ResourceNotFoundException,
} from "@aws-sdk/client-bedrock-agent";
import {
  OpenSearchServerlessClient,
  ListCollectionsCommand,
  DeleteCollectionCommand,
} from "@aws-sdk/client-opensearchserverless";

const bedrockAgent = new BedrockAgentClient({});
const oss = new OpenSearchServerlessClient({});

interface CleanupProps {
  knowledgeBaseIds: string[];
  collectionNamePrefixes: string[];
}

interface CfnResponse {
  Status: "SUCCESS" | "FAILED";
  PhysicalResourceId: string;
  Reason?: string;
  Data?: Record<string, unknown>;
}

async function deleteKnowledgeBase(id: string): Promise<string> {
  try {
    const dataSources = await bedrockAgent.send(
      new ListDataSourcesCommand({ knowledgeBaseId: id })
    );
    for (const ds of dataSources.dataSourceSummaries ?? []) {
      if (!ds.dataSourceId) continue;
      try {
        await bedrockAgent.send(
          new DeleteDataSourceCommand({
            knowledgeBaseId: id,
            dataSourceId: ds.dataSourceId,
          })
        );
        console.log(`  deleted data source ${ds.dataSourceId} of KB ${id}`);
      } catch (err) {
        if (!(err instanceof ResourceNotFoundException)) {
          console.warn(`  failed to delete DS ${ds.dataSourceId}: ${(err as Error).message}`);
        }
      }
    }

    await bedrockAgent.send(new DeleteKnowledgeBaseCommand({ knowledgeBaseId: id }));
    return `deleted KB ${id}`;
  } catch (err) {
    if (err instanceof ResourceNotFoundException) {
      return `KB ${id} not found (already deleted)`;
    }
    const msg = (err as Error).message ?? String(err);
    console.warn(`  KB ${id} delete error: ${msg}`);
    return `KB ${id}: ${msg}`;
  }
}

async function deleteCollectionsByPrefix(prefixes: string[]): Promise<string[]> {
  const results: string[] = [];
  let nextToken: string | undefined;
  const matched: { id: string; name: string }[] = [];

  do {
    const list = await oss.send(new ListCollectionsCommand({ nextToken }));
    for (const c of list.collectionSummaries ?? []) {
      if (!c.name || !c.id) continue;
      if (prefixes.some((p) => c.name!.startsWith(p))) {
        matched.push({ id: c.id, name: c.name });
      }
    }
    nextToken = list.nextToken;
  } while (nextToken);

  for (const { id, name } of matched) {
    try {
      await oss.send(new DeleteCollectionCommand({ id }));
      results.push(`deleted collection ${name} (${id})`);
    } catch (err) {
      const msg = (err as Error).message ?? String(err);
      console.warn(`  Collection ${name} (${id}) delete error: ${msg}`);
      results.push(`collection ${name}: ${msg}`);
    }
  }

  if (matched.length === 0) {
    results.push("no matching collections found");
  }
  return results;
}

interface CfnEvent {
  RequestType: "Create" | "Update" | "Delete";
  ResourceProperties: { knowledgeBaseIds?: string[]; collectionNamePrefixes?: string[] };
  PhysicalResourceId?: string;
}

export const handler = async (event: CfnEvent): Promise<CfnResponse> => {
  console.log("Event:", JSON.stringify(event));

  if (event.RequestType === "Delete") {
    return {
      Status: "SUCCESS",
      PhysicalResourceId: event.PhysicalResourceId ?? "kb-cleanup-noop",
      Reason: "Delete is no-op for cleanup resource",
    };
  }

  const props: CleanupProps = {
    knowledgeBaseIds: event.ResourceProperties.knowledgeBaseIds ?? [],
    collectionNamePrefixes: event.ResourceProperties.collectionNamePrefixes ?? [],
  };

  const log: string[] = [];

  for (const kbId of props.knowledgeBaseIds) {
    log.push(await deleteKnowledgeBase(kbId));
  }

  if (props.collectionNamePrefixes.length > 0) {
    log.push(...(await deleteCollectionsByPrefix(props.collectionNamePrefixes)));
  }

  console.log("Cleanup log:\n  " + log.join("\n  "));

  return {
    Status: "SUCCESS",
    PhysicalResourceId: "kb-cleanup-resource",
    Data: { log: log.join("; ") },
  };
};
