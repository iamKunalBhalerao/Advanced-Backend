import 'dotenv/config'
import express from "express";
import connectDB from "./db/db.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT:${process.env.PORT}`);
  connectDB();
});
