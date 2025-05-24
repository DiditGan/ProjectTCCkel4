import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
  process.env._DB_NAME,
  process.env._DB_USER,
  process.env._DB_PASS,
  {
    host: process.env._DB_HOST,
    dialect: "mysql",
  }
);

export default db;