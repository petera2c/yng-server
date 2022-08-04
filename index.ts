const express = require("express");
const api = require("./controllers");

const app = express();

const { PORT = 4001 } = process.env;

app.listen(PORT, () => {
  console.log(`Server listing at http://localhost:${PORT}`);

  api.default(app);
});
