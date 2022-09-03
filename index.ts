// Required for .env file to work
require("dotenv").config();

const express = require("express");
const { Client } = require("pg");

const cors = require("cors");
const bodyParser = require("body-parser");

const api = require("./routes");
const services = require("./services");

// Get port from AWS or start port locally
const { PORT = 4001 } = process.env;

// Connect to DB
const client = new Client({
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
});
client.connect();

// Create app
const app = express();

// cors to make api available to front-end
app.use(cors());

// to support JSON-encoded bodies
app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Start app
app.listen(PORT, () => {
  services.default(client);
  api.default(app, client);
});
