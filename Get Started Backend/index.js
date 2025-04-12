const express = require("express");
require("dotenv").config();

const signup = require("./src/controllers/signup.controller");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/signup", signup);

app.listen(process.env.PORT, () => {
  console.log(`server is on ${process.env.PORT}`);
});
