import storeQuarterlys from "./storeQuarterlys";

const cleanData = (client) => {
  client.query(
    `SELECT * FROM financial_quarterly WHERE revenue < 10000 LIMIT 10`,
    (err, res) => {
      if (err) console.log(err);
      else console.log(res);
    }
  );
};

export default (client) => {
  //cleanData(client);
};
