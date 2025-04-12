import { configDotenv } from "dotenv";
import express from "express";
configDotenv();

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "This is about Advanced Data Modeling ",
  });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`server is on PORT:${port}`);
});
