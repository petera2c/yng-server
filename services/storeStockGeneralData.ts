const axios = require("axios");
const format = require("pg-format");

export default (client) => {
  axios
    .get(
      `https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=0&apikey=${process.env.FINANCIAL_MODEL_PREP_API_KEY}`
    )
    .then((result) => {
      const { data } = result;

      let values = [];

      for (let index in data) {
        const company = data[index];
        if (company.isActivelyTrading)
          values.push([
            company.companyName,
            company.country,
            company.exchange,
            company.exchangeShortName,
            company.industry,
            company.isEtf,
            company.marketCap,
            company.sector,
            company.symbol,
          ]);
      }

      client.query(
        format(
          "INSERT INTO stocks (company_name, country, exchange, exchange_short_name, industry, is_eft, market_cap, sector, ticker) VALUES %L",
          values
        ),
        [],
        (err, result) => {
          console.log(err);
          console.log(result);
        }
      );
    })
    .catch((e) => {
      console.log(e);
    });
};
