import express from "express";
import { configDotenv } from "dotenv";

import SignupRouter from "./src/routes/signup.js";
import JokesRouter from "./src/routes/jokes.js";

configDotenv;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello Wolrd");
});

app.use("/", SignupRouter);
app.use("/", JokesRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is on ${port}`);
});
