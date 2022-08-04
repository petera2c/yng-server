const getFinancialData = require("./financial-modal-prep/index.ts");

export default function start() {
  console.log("Starting Cron Jobs");
  getFinancialData();
}
