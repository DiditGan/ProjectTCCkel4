import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Barang from "./BarangModel.js";
import User from "./UserModel.js";

const Transaksi = db.define("transaksi", {
  transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Barang,
      key: "item_id",
    },
    onDelete: "CASCADE",
  },
  buyer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
    onDelete: "CASCADE",
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
    onDelete: "CASCADE",
  },
  transaction_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "cancelled"),
    allowNull: false,
    defaultValue: "pending",
  },
}, {
  timestamps: false,
});

Transaksi.belongsTo(Barang, { foreignKey: "item_id" });
Transaksi.belongsTo(User, { as: "buyer", foreignKey: "buyer_id" });
Transaksi.belongsTo(User, { as: "seller", foreignKey: "seller_id" });

export default Transaksi;