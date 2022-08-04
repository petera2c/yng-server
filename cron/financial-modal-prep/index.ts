const axios = require("axios");
const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default () => {
  return;
  axios
    .get(
      `https://financialmodelingprep.com/api/v3/financial-growth/HITI?period=quarter&limit=1&apikey=${process.env.FINANCIAL_MODEL_PREP_API_KEY}`
    )
    .then((data) => {
      console.log(data);
    })
    .catch((e) => {
      console.log(e);
    });
};
