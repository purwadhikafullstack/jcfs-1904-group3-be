require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.API_PORT;
const cors = require("cors");
const appRootDir = require("app-root-dir").get();

const addressRouter = require("./router/address");
const productsRouter = require("./router/products");
const categoryRouter = require("./router/category");
const transactionsRouter = require("./router/transactions");
const cartsRouter = require("./router/carts");
const userRouter = require("./router/users");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("API IS RUNNING");
});

app.use("/products", productsRouter);
app.use("/categories", categoryRouter);
app.use("/transactions", transactionsRouter);
app.use("/carts", cartsRouter);
app.use("/address", addressRouter);
app.use("/users", userRouter);

app.use((error, req, res, next) => {
  console.log(error);
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
