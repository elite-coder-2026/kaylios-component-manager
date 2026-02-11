const fs = require("node:fs/promises");
const path = require("node:path");
const { Pool } = require("pg");

let pool;
let initPromise;

function getPool() {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    const error = new Error("DATABASE_URL is required.");
    error.statusCode = 500;
    throw error;
  }

  const ssl = String(process.env.DATABASE_SSL || "false").toLowerCase() === "true"
    ? { rejectUnauthorized: false }
    : false;

  pool = new Pool({ connectionString, ssl });
  return pool;
}

async function ensureDatabase() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = await fs.readFile(schemaPath, "utf8");
    await getPool().query(schemaSql);
  })();

  return initPromise;
}

async function query(sql, params = []) {
  await ensureDatabase();
  return getPool().query(sql, params);
}

async function withTransaction(handler) {
  await ensureDatabase();
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await handler(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  ensureDatabase,
  query,
  withTransaction
};

