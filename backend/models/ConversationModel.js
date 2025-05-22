import { DataTypes } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";
import Barang from "./BarangModel.js";

const Conversation = db.define("conversations", {
  conversation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: { // Optional: link conversation to a product
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Barang,
      key: "item_id",
    },
    onDelete: "SET NULL",
  },
  // Timestamps will be managed by Sequelize
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at'
});

// Junction table for participants
const ConversationParticipant = db.define('conversation_participants', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  conversation_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Conversation,
      key: 'conversation_id'
    }
  }
}, { timestamps: false });

User.belongsToMany(Conversation, { through: ConversationParticipant, foreignKey: 'user_id', otherKey: 'conversation_id', as: 'conversations' });
Conversation.belongsToMany(User, { through: ConversationParticipant, foreignKey: 'conversation_id', otherKey: 'user_id', as: 'participants' });

Conversation.belongsTo(Barang, { foreignKey: "product_id", as: "product" });
Barang.hasMany(Conversation, { foreignKey: "product_id" });


export { Conversation, ConversationParticipant };
