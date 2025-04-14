import "dotenv/config";
import connectDB from "./db/db.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running PORT:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection FAILED !!! ", err);
  });
