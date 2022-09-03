import axios from "axios";
const format = require("pg-format");
import { getCompanies } from "./util";

export default (client) => {
  getCompanies(client, (ticker) => {
    axios
      .get(
        `https://financialmodelingprep.com/api/v3/financial-growth/${ticker}?period=quarter&limit=80&apikey=${process.env.FINANCIAL_MODEL_PREP_API_KEY}`
      )
      .then((result) => {
        const { data } = result;

        let values = [];

        for (let index in data) {
          const quarterly = data[index];

          values.push([
            quarterly.assetGrowth,
            quarterly.bookValueperShareGrowth,
            quarterly.date,
            quarterly.debtGrowth,
            quarterly.dividendsperShareGrowth,
            quarterly.ebitgrowth,
            quarterly.epsdilutedGrowth,
            quarterly.epsgrowth,
            quarterly.fiveYDividendperShareGrowthPerShare,
            quarterly.fiveYNetIncomeGrowthPerShare,
            quarterly.fiveYOperatingCFGrowthPerShare,
            quarterly.fiveYRevenueGrowthPerShare,
            quarterly.fiveYShareholdersEquityGrowthPerShare,
            quarterly.freeCashFlowGrowth,
            quarterly.grossProfitGrowth,
            quarterly.inventoryGrowth,
            quarterly.netIncomeGrowth,
            quarterly.operatingCashFlowGrowth,
            quarterly.operatingIncomeGrowth,
            quarterly.period,
            quarterly.symbol + "_" + quarterly.date,
            quarterly.rdexpenseGrowth,
            quarterly.receivablesGrowth,
            quarterly.revenueGrowth,
            quarterly.sgaexpensesGrowth,
            quarterly.tenYDividendperShareGrowthPerShare,
            quarterly.tenYNetIncomeGrowthPerShare,
            quarterly.tenYOperatingCFGrowthPerShare,
            quarterly.tenYRevenueGrowthPerShare,
            quarterly.tenYShareholdersEquityGrowthPerShare,
            quarterly.threeYDividendperShareGrowthPerShare,
            quarterly.threeYNetIncomeGrowthPerShare,
            quarterly.threeYOperatingCFGrowthPerShare,
            quarterly.threeYRevenueGrowthPerShare,
            quarterly.threeYShareholdersEquityGrowthPerShare,
            quarterly.symbol,
            quarterly.weightedAverageSharesDilutedGrowth,
            quarterly.weightedAverageSharesGrowth,
          ]);
        }

        if (values.length > 0)
          client.query(
            format(
              "INSERT INTO financial_growth_quarterly (asset_growth, book_valueper_share_growth, date, debt_growth, dividendsper_share_growth, ebitgrowth, epsdiluted_growth, epsgrowth, five_y_dividendper_share_growth_per_share, five_y_net_income_growth_per_share, five_y_operating_cf_growth_per_share, five_y_revenue_growth_per_share, five_y_shareholders_equity_growth_per_share, free_cash_flow_growth, gross_profit_growth, inventory_growth, net_income_growth, operating_cash_flow_growth, operating_income_growth, period, quarterly_id, rdexpense_growth, receivables_growth, revenue_growth, sgaexpenses_growth, ten_y_dividendper_share_growth_per_share, ten_y_net_income_growth_per_share, ten_y_operating_cf_growth_per_share, ten_y_revenue_growth_per_share, ten_y_shareholders_equity_growth_per_share, three_y_dividendper_share_growth_per_share, three_y_net_income_growth_per_share, three_y_operating_cf_growth_per_share, three_y_revenue_growth_per_share, three_y_shareholders_equity_growth_per_share, ticker, weighted_average_shares_diluted_growth, weighted_average_shares_growth) VALUES %L ON CONFLICT DO NOTHING",
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
