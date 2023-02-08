const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyparser = require("body-parser");
require("dotenv").config();
const mainRouter = require("./src/routes/index");
const app = express();
const port = process.env.PORT;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
app.use(bodyparser.json());
app.use("/", mainRouter);
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Error",
    statusCode: 404,
    message: "This is root, check again the endpoint API",
  });
});
app.use("/", (req, res, next) => {
  res.status(200).json({ status: "Success", statusCode: 200 });
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
