const express = require("express");
require("dotenv").config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Wolrd");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server is on ${process.env.PORT || 3000}`);
});
