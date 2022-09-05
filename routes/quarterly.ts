const fastestGrowingCompanies = async (req, res, client) => {
  const result = await client
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

  console.log(result);

  if (result.rows) res.send(result.rows);
  else return res.status(400).send("Error message here");
};

const makeYourOwn = async (req, res, client) => {
  const { filters, orderBy } = req.body;
  console.log(filters);
  console.log(orderBy);
  console.log("\n");

  let querySelectArray = [];
  let querySelectsArray = [];
  let whereArray = [];

  for (let index in filters) {
    const { attribute, fromYear, fromQuarterly, toYear, toQuarterly } =
      filters[index];

    querySelectArray.push(
      `
        a_${attribute}.ticker, 
        (${attribute}_to_quarter - 
          ${attribute}_from_quarter)
        /${attribute}_from_quarter 
        AS ${attribute}_growth`
    );
    if (index !== "0")
      whereArray.push(
        `a_${filters[0].attribute}.ticker = a_${attribute}.ticker`
      );
    whereArray.push(`a_${filters[0].attribute}.ticker = b_${attribute}.ticker`);

    querySelectsArray.push(`
      (SELECT ticker, ${attribute} 
        AS ${attribute}_from_quarter 
        FROM financial_quarterly 
        WHERE ${attribute} > 0 
        AND calendar_year = '${fromYear}'
        AND period = '${fromQuarterly}')
        a_${attribute},
      (SELECT ticker, ${attribute} 
        AS ${attribute}_to_quarter
        FROM financial_quarterly 
        WHERE ${attribute} > 0
        AND calendar_year = '${toYear}'
        AND period = '${toQuarterly}')
        b_${attribute}`);
  }

  const query = `SELECT company_name,
    ${querySelectArray.join(`,\n`)}
  
    FROM
    ${querySelectsArray.join(`,\n`)},
  
    stocks
  
    WHERE ${whereArray.join(`\n  AND `)}
    AND stocks.ticker = a_${filters[0].attribute}.ticker
    ORDER BY ${orderBy + "_growth"} DESC
    LIMIT 10
    `;
  console.log("\n", query);

  const result = await client.query(query).catch((e) => e);

  if (result.rows) {
    console.log(result.rows.length);
    res.send(result.rows);
  } else {
    console.log(result);
    return res.status(400).send("Error message here");
  }
};

module.exports = {
  fastestGrowingCompanies,
  makeYourOwn,
};
