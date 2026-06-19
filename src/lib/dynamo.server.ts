import { AwsClient } from "aws4fetch";

/**
 * Server-only DynamoDB helper.
 * Uses aws4fetch (SigV4 signing over fetch) which works on the edge runtime.
 * Never import this file from client code — it reads AWS secrets.
 */

function getConfig() {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || "us-east-1";
  const table = process.env.DYNAMODB_TABLE;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS credentials are not configured.");
  }
  if (!table) {
    throw new Error("DYNAMODB_TABLE is not configured.");
  }

  const client = new AwsClient({
    accessKeyId,
    secretAccessKey,
    region,
    service: "dynamodb",
  });

  return { client, region, table };
}

async function call(target: string, body: Record<string, unknown>) {
  const { client, region } = getConfig();
  const res = await client.fetch(`https://dynamodb.${region}.amazonaws.com/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.0",
      "X-Amz-Target": `DynamoDB_20120810.${target}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const type = (json.__type as string) || `HTTP ${res.status}`;
    const message = (json.message as string) || text;
    const err = new Error(`DynamoDB ${target} failed: ${type} ${message}`);
    (err as Error & { code?: string }).code = type;
    throw err;
  }
  return json;
}

// ---- Marshalling (string-only items, which is all this app needs) ----
type StringRecord = Record<string, string>;

function marshal(item: StringRecord) {
  const out: Record<string, { S: string }> = {};
  for (const [k, v] of Object.entries(item)) {
    out[k] = { S: v };
  }
  return out;
}

function unmarshal(item?: Record<string, { S?: string }>): StringRecord | null {
  if (!item) return null;
  const out: StringRecord = {};
  for (const [k, v] of Object.entries(item)) {
    if (v && typeof v.S === "string") out[k] = v.S;
  }
  return out;
}

export function getTableName() {
  return getConfig().table;
}

export async function getItem(pk: string): Promise<StringRecord | null> {
  const table = getTableName();
  const res = await call("GetItem", {
    TableName: table,
    Key: { pk: { S: pk } },
  });
  return unmarshal(res.Item);
}

/**
 * Put an item. When `requireAbsent` is true it fails if the pk already exists.
 * Returns false when the conditional check fails, true on success.
 */
export async function putItem(
  item: StringRecord,
  requireAbsent = false,
): Promise<boolean> {
  const table = getTableName();
  try {
    await call("PutItem", {
      TableName: table,
      Item: marshal(item),
      ...(requireAbsent
        ? { ConditionExpression: "attribute_not_exists(pk)" }
        : {}),
    });
    return true;
  } catch (err) {
    const code = (err as Error & { code?: string }).code || "";
    if (code.includes("ConditionalCheckFailedException")) return false;
    throw err;
  }
}
