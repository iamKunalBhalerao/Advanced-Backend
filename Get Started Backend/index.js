import express from "express";
import { signup } from "./src/controllers/signup.controller.js";

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/signup", signup);

app.listen(port, () => {
  console.log(`server is on ${port}`);
});
