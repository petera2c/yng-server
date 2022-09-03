const axios = require("axios");
const format = require("pg-format");
const { getCompanies } = require("./util");

export default (client) => {
  getCompanies(client, (ticker) => {
    axios
      .get(
        `https://financialmodelingprep.com/api/v3/income-statement-growth/${ticker}?apikey=${process.env.FINANCIAL_MODEL_PREP_API_KEY}`
      )
      .then((result) => {
        const { data } = result;

        let values = [];

        for (let index in data) {
          const quarterly = data[index];
          values.push([
            quarterly.date,
            quarterly.growthCostAndExpenses,
            quarterly.growthCostOfRevenue,
            quarterly.growthDepreciationAndAmortization,
            quarterly.growthEBITDA,
            quarterly.growthEBITDARatio,
            quarterly.growthEPS,
            quarterly.growthEPSDiluted,
            quarterly.growthGeneralAndAdministrativeExpenses,
            quarterly.growthGrossProfit,
            quarterly.growthGrossProfitRatio,
            quarterly.growthIncomeBeforeTax,
            quarterly.growthIncomeBeforeTaxRatio,
            quarterly.growthIncomeTaxExpense,
            quarterly.growthInterestExpense,
            quarterly.growthNetIncome,
            quarterly.growthNetIncomeRatio,
            quarterly.growthOperatingExpenses,
            quarterly.growthOperatingIncome,
            quarterly.growthOperatingIncomeRatio,
            quarterly.growthOtherExpenses,
            quarterly.growthResearchAndDevelopmentExpenses,
            quarterly.growthRevenue,
            quarterly.growthSellingAndMarketingExpenses,
            quarterly.growthTotalOtherIncomeExpensesNet,
            quarterly.growthWeightedAverageShsOut,
            quarterly.growthWeightedAverageShsOutDil,
            quarterly.period,
            quarterly.symbol + "_" + quarterly.date,
            quarterly.symbol,
          ]);
        }

        if (values.length > 0)
          client.query(
            format(
              "INSERT INTO quarterlys (date, growth_cost_and_expenses, growth_cost_of_revenue, growth_depreciation_and_amortization, growth_ebitda, growth_ebitda_ratio, growth_eps, growth_eps_diluted, growth_general_and_administrative_expenses, growth_gross_profit, growth_gross_profit_ratio, growth_income_before_tax, growth_income_before_tax_ratio, growth_income_tax_expense, growth_interest_expense, growth_net_income, growth_net_income_ratio, growth_operating_expenses, growth_operating_income, growth_operating_income_ratio, growth_other_expenses, growth_research_and_development_expenses, growth_revenue, growth_selling_and_marketing_expenses, growth_total_other_income_expenses_net, growth_weighted_average_shs_out, growth_weighted_average_shs_out_dil, period, quarterly_id, ticker) VALUES %L ON CONFLICT DO NOTHING",
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
