import axios from "axios";
import { camelCase, snakeCase } from "lodash";
const format = require("pg-format");

import { alterTable, getCompanies } from "./util";

export default (client) => {
  getCompanies(client, (ticker) => {
    axios
      .get(
        `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?period=quarter&apikey=${process.env.FINANCIAL_MODEL_PREP_API_KEY}`
      )
      .then((result) => {
        const { data } = result;

        let values = [];

        for (let index in data) {
          const quarterly = data[index];

          values.push([
            quarterly.acceptedDate,
            quarterly.calendarYear,
            quarterly.cik,
            quarterly.costAndExpenses,
            quarterly.costOfRevenue,
            quarterly.date,
            quarterly.depreciationAndAmortization,
            quarterly.ebitda,
            quarterly.ebitdaratio,
            quarterly.eps,
            quarterly.epsdiluted,
            quarterly.fillingDate,
            quarterly.finalLink,
            quarterly.generalAndAdministrativeExpenses,
            quarterly.grossProfit,
            quarterly.grossProfitRatio,
            quarterly.incomeBeforeTax,
            quarterly.incomeBeforeTaxRatio,
            quarterly.incomeTaxExpense,
            quarterly.interestExpense,
            quarterly.interestIncome,
            quarterly.link,
            quarterly.netIncome,
            quarterly.netIncomeRatio,
            quarterly.operatingExpenses,
            quarterly.operatingIncome,
            quarterly.operatingIncomeRatio,
            quarterly.otherExpenses,
            quarterly.period,
            quarterly.symbol + "_" + quarterly.date,
            quarterly.reportedCurrency,
            quarterly.researchAndDevelopmentExpenses,
            quarterly.revenue,
            quarterly.sellingAndMarketingExpenses,
            quarterly.sellingGeneralAndAdministrativeExpenses,
            quarterly.symbol,
            quarterly.totalOtherIncomeExpensesNet,
            quarterly.weightedAverageShsOut,
            quarterly.weightedAverageShsOutDil,
          ]);
        }

        if (values.length > 0)
          client.query(
            format(
              "INSERT INTO financial_quarterly (accepted_date, calendar_year, cik, cost_and_expenses, cost_of_revenue, date, depreciation_and_amortization, ebitda, ebitdaratio, eps, epsdiluted, filling_date, final_link, general_and_administrative_expenses, gross_profit, gross_profit_ratio, income_before_tax, income_before_tax_ratio, income_tax_expense, interest_expense, interest_income, link, net_income, net_income_ratio, operating_expenses, operating_income, operating_income_ratio, other_expenses, period, quarterly_id, reported_currency, research_and_development_expenses, revenue, selling_and_marketing_expenses, selling_general_and_administrative_expenses, ticker, total_other_income_expenses_net, weighted_average_shs_out, weighted_average_shs_out_dil) VALUES %L ON CONFLICT DO NOTHING",
              values
            ),
            [],
            (err, result) => {
              if (err) console.log(err);
              else console.log(result);
            }
          );
      })
      .catch((e) => {
        console.log(e);
      });
  });
};
