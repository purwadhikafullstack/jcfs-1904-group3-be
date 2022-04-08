require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.API_PORT;
const cors = require("cors");

const productsRouter = require("./router/products");
const categoryRouter = require("./router/category");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("API IS RUNNING");
});

app.use("/products", productsRouter);
app.use("/categories", categoryRouter);

app.use((error, req, res, next) => {
  res.status(500).send({
    status: "ERROR",
    message: error.message,
    data: error,
  });
});

app.listen(port, (err) => {
  if (err) return console.log({ err });
  console.log(`3_Warehouse is running at ${port}`);
});
