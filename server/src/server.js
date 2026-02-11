const app = require("./app");
const { loadEnv } = require("./config/load-env");
const { ensureDatabase } = require("./db/client");

loadEnv();

const PORT = Number(process.env.PORT || 4173);

async function start() {
  await ensureDatabase();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
