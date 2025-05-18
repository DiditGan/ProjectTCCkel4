import express from "express";
import db from "./config/database.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(UserRoute);
app.use(AuthRoute);

const startServer = async () => {
  try {
    await db.authenticate();
    await db.sync();
    console.log("Database connected...");
    app.listen(5000, () => console.log("Server running on port 5000"));
  } catch (error) {
    console.error(error);
  }
};

startServer();