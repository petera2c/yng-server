const format = require("pg-format");
const { delayedLoop } = require("../helpers/util");

export const cleanDatabase = (dbName) => {
  client.query(`TRUNCATE ${dbName}`, (err, res) => {
    if (err) console.log(err);
    else console.log(res);
  });
};

export const getQuarterlys = () => {
  client.query(
    `Select * FROM financial_growth_statements_annual LIMIT 10`,
    (err, res) => {
      if (err) console.log(err);
      else console.log(res.rows);
    }
  );
};

export const getCompanies = (client, callback) => {
  console.log("Getting stocks list\n");
  client.query(`Select ticker FROM stocks`, (err, res) => {
    if (!err) {
      delayedLoop(res.rows, callback, 0);
    } else {
      console.log(err);
    }
  });
};

export const alterTable = (client) => {
  client.query(
    "ALTER TABLE financial_quarterly ALTER COLUMN calendar_year TYPE VARCHAR(4)",
    [],
    (err, result) => {
      if (err) console.log(err);
      else console.log(result);
    }
  );
};

export const modifyTest = () => {
  client.query(
    format(
      "INSERT INTO financial_growth_statements_annual (date, period, quarterly_id, ticker) VALUES %L ON CONFLICT DO NOTHING",
      [["test", "test", "AAPL_2012-09-29", "AAPL"]]
    ),
    [],
    (err, result) => {
      if (err) console.log(err);
      else console.log(result);
    }
  );
};
