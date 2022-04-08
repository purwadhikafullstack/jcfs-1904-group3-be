const express = require("express");
const app = express();
const port = 2022;
const cors = require("cors");
const pool = require("../src/config/database");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("API IS RUNNING");
});

app.use((error, req, res, next) => {
  res.status(500).send({
    status: "ERROR",
    message: error.message,
    data: error,
  });
});

app.listen(port, (err) => {
  if (err) return console.log({ err });
  console.log(`Api is running at server ${port}`);
});
