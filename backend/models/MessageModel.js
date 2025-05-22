import { DataTypes } from "sequelize";
import db from "../config/database.js";
import User from "./UserModel.js";
import { Conversation } from "./ConversationModel.js";

const Message = db.define("messages", {
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Conversation,
      key: "conversation_id",
    },
    onDelete: "CASCADE",
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
    onDelete: "CASCADE",
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image_url: { // Optional for image messages
    type: DataTypes.STRING,
    allowNull: true,
  },
  // timestamp is createdAt by Sequelize
}, {
  timestamps: true,
  updatedAt: false, // Messages are typically not updated
  createdAt: 'timestamp' // Alias createdAt to timestamp
});

Message.belongsTo(Conversation, { foreignKey: "conversation_id", as: "conversation" });
Conversation.hasMany(Message, { foreignKey: "conversation_id", as: "messages" });
Conversation.hasOne(Message, { foreignKey: 'conversation_id', as: 'lastMessage', order: [['timestamp', 'DESC']] });


Message.belongsTo(User, { foreignKey: "sender_id", as: "sender" });
User.hasMany(Message, { foreignKey: "sender_id" });

export default Message;
