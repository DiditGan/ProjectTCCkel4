import { Sequelize, DataTypes } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const Product = db.define("barang", {
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
    allowNull: true,
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
    type: DataTypes.STRING,
    allowNull: true,
  },
  date_posted: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  interested_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  freezeTableName: true,
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

Product.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Product, { foreignKey: "user_id" });

export default Product;
