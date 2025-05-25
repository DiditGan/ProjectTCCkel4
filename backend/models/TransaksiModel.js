import { DataTypes } from "sequelize";
import db from "../config/Database.js";
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
    onDelete: "CASCADE", // Changed from SET NULL to CASCADE
    onUpdate: "CASCADE"
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
  quantity: { // Added
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  total_price: { // Added
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "cancelled"),
    allowNull: false,
    defaultValue: "pending",
  },
  payment_method: { // Added based on frontend
    type: DataTypes.STRING,
    allowNull: true,
  },
  shipping_address: { // Added based on frontend
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true, // Enable Sequelize timestamps
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

Transaksi.belongsTo(Barang, { foreignKey: "item_id", as: "item" });
Barang.hasMany(Transaksi, { foreignKey: "item_id", onDelete: "CASCADE", onUpdate: "CASCADE" });

Transaksi.belongsTo(User, { as: "buyer", foreignKey: "buyer_id" });
User.hasMany(Transaksi, { foreignKey: "buyer_id", as: "purchases" });

Transaksi.belongsTo(User, { as: "seller", foreignKey: "seller_id" });
User.hasMany(Transaksi, { foreignKey: "seller_id", as: "sales" });

export default Transaksi;