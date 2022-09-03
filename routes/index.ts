const getFastestGrowingCompaniesThisLastQuarter = (client, options) =>
  client
    .query(
      `SELECT  (q3_revenue - q1_revenue)/q1_revenue AS ratio, 
    a.ticker, q1_revenue, q3_revenue FROM 
    (SELECT revenue AS q1_revenue, ticker FROM financial_quarterly 
      WHERE revenue > 0 AND
      calendar_year = '2022' AND
      period = 'Q1') a,
    (SELECT revenue AS q3_revenue, ticker FROM financial_quarterly 
      WHERE revenue > 0 AND
      calendar_year = '2022' AND
      period = 'Q3') b 
    WHERE a.ticker = b.ticker
    ORDER BY ratio DESC
    LIMIT 10`
    )
    .catch((e) => e);
const makeYourOwn = (client, options, orderBy) => {
  let querySelectArray = [];
  let querySelectsArray = [];
  let whereArray = [];
  for (let index in options) {
    const { attribute, fromYear, fromQuarterly, toYear, toQuarterly } =
      options[index];

    querySelectArray.push(`a_${attribute}.ticker, (${attribute}_to_quarter - ${attribute}_from_quarter)/${attribute}_from_quarter AS ${attribute}_ratio, ${attribute}_from_quarter, ${attribute}_to_quarter
      `);

    whereArray.push(`a_${attribute}.ticker = b_${attribute}.ticker`);

    querySelectsArray.push(`(SELECT ticker, ${attribute} AS ${attribute}_from_quarter FROM financial_quarterly 
      WHERE ${attribute} > 0 AND
      calendar_year = '${fromYear}' AND
      period = '${fromQuarterly}') a_${attribute},
    (SELECT ticker, ${attribute} AS ${attribute}_to_quarter FROM financial_quarterly 
      WHERE ${attribute} > 0 AND
      calendar_year = '${toYear}' AND
      period = '${toQuarterly}') b_${attribute} `);
  }
  // company_name, country, fwd_pe_ratio, industry, is_eft, market_cap, pe_ratio, ps_ratio, sector, ticker
  const query = `SELECT ${querySelectArray.join(",")} FROM 
  ${querySelectsArray}
  WHERE ${whereArray.join(" AND ")}
  ORDER BY ${orderBy} DESC
  LIMIT 10`;
  console.log(query);
  return client.query(query).catch((e) => e);
};

export default (app, client) => {
  app.get("/", async (request, response) => {
    return response.send("Welcome to the yng api");
  });
  app.get("/fastest-growing-companies", async (request, response) => {
    const result = await getFastestGrowingCompaniesThisLastQuarter(client, [
      {},
    ]);
    console.log(result);

    if (result.rows) response.send(result.rows);
    else return response.status(400).send("Error message here");
  });
  app.post("/make-your-own", async (request, response) => {
    const { filters, orderBy } = request.body;
    console.log(filters);
    const result = await makeYourOwn(client, filters, orderBy + "_ratio");

    if (result.rows) {
      console.log(result.rows.length);
      response.send(result.rows);
    } else {
      console.log(result);
      return response.status(400).send("Error message here");
    }
  });
};
