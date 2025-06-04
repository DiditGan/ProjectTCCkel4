import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Tambahkan log error jika env tidak terisi
const requiredEnv = ['_DB_NAME', '_DB_USER', '_DB_PASS', '_DB_HOST'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ ENV ERROR: ${key} is not set. Please check your .env file.`);
  }
}

const db = new Sequelize(
  process.env._DB_NAME,
  process.env._DB_USER,
  process.env._DB_PASS,
  {
    host: process.env._DB_HOST,
    dialect: "mysql",
    logging: false, // nonaktifkan log query jika tidak perlu
  }
);

export default db;