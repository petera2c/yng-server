const quarterly = require("./quarterly");
const company = require("./company");
export default async (app, client) => {
  app.get("/", async (request, response) =>
    response.send("Welcome to the yng api")
  );

  app.get("/fastest-growing-companies", (req, res) =>
    quarterly.fastestGrowingCompanies(req, res, client)
  );
  app.post("/make-your-own", (req, res) =>
    quarterly.makeYourOwn(req, res, client)
  );
  app.get("/companies/:ticker", (req, res) => company.information(req, res));
};
