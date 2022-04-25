const express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return "Hello world!";
  },
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.get("/api/test", (req, res) => {
  return res.send({ success: true, message: "hello world" });
});

app.get("*", (req, res) => {
  return res.send("Welcome to the yng api :)");
});

app.listen(process.env.PORT || 4000);
