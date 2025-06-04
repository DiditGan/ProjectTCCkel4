import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const Barang = db.define("barangs", {
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
    onDelete: "CASCADE",
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false, // wajib diisi
    defaultValue: 0,
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("available", "sold", "donated", "exchanged"),
    allowNull: false,
    defaultValue: "available",
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Stores relative path to the image file'
  },
  date_posted: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: "barangs",
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

// Relasi harus pakai as: "user" agar hasil include: [{ model: User, as: "user", ... }] bisa digunakan di controller/frontend
Barang.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Barang, { foreignKey: "user_id" });

export default Barang;