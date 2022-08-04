export default (app) => {
  app.get("/", (req, res) => {
    return res.send("Welcome to the yng api :)");
  });
};
