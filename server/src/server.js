const app = require("./app");

const PORT = Number(process.env.PORT || 4173);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${PORT}`);
});
