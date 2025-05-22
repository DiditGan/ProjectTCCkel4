import { Conversation, ConversationParticipant } from "../models/ConversationModel.js";
import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import Barang from "../models/BarangModel.js";
import { Op, Sequelize } from "sequelize";
import db from "../config/database.js";


export const getConversations = async (req, res) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.findAll({
      include: [
        {
          model: User,
          as: 'participants',
          where: { user_id: userId },
          attributes: [], // Don't select attributes from User via this include directly
        },
        {
          model: User,
          as: 'participants', // Get all participants for the conversation
          attributes: ['user_id', 'name', 'profile_picture'],
          through: { attributes: [] }, // Don't select attributes from junction table
          where: { user_id: { [Op.ne]: userId } } // Exclude the current user from this specific participant list
        },
        {
          model: Barang,
          as: 'product',
          attributes: ['item_id', 'item_name', 'image_url']
        },
        {
          model: Message,
          as: 'lastMessage', // Sequelize will fetch the latest message based on association order
          attributes: ['content', 'timestamp', 'sender_id'],
        }
      ],
      order: [['updated_at', 'DESC']], // Order conversations by the most recently updated
    });
    
    // Add unread count (this is a simplified version, real unread count needs more logic e.g. last_read_timestamp)
    const conversationsWithDetails = conversations.map(conv => {
        const plainConv = conv.get({ plain: true });
        // Determine the other participant
        const otherParticipant = plainConv.participants.find(p => p.user_id !== userId);
        return {
            ...plainConv,
            participant: otherParticipant || {}, // Ensure participant object exists
            unreadCount: 0 // Placeholder for unread count logic
        };
    });

    res.json(conversationsWithDetails);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { conversation_id } = req.params;

    // Verify user is part of the conversation
    const conversation = await Conversation.findByPk(conversation_id, {
      include: [{ model: User, as: 'participants', where: { user_id: userId } }]
    });

    if (!conversation) {
      return res.status(403).json({ msg: "Akses ditolak atau percakapan tidak ditemukan." });
    }

    const messages = await Message.findAll({
      where: { conversation_id },
      include: [{ model: User, as: 'sender', attributes: ['user_id', 'name', 'profile_picture'] }],
      order: [['timestamp', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const createMessage = async (req, res) => {
  const t = await db.transaction();
  try {
    const sender_id = req.userId;
    const { conversation_id } = req.params; // Can be 'new' or an existing ID
    const { content, recipient_id, product_id } = req.body; // recipient_id and product_id for new conversations

    if (!content) return res.status(400).json({ msg: "Konten pesan tidak boleh kosong." });

    let convId = conversation_id;
    let conversation;

    if (convId && convId !== 'new') {
        conversation = await Conversation.findByPk(convId);
        if (!conversation) return res.status(404).json({ msg: "Percakapan tidak ditemukan." });
        // Verify sender is part of this conversation
        const participant = await ConversationParticipant.findOne({ where: { conversation_id: convId, user_id: sender_id } });
        if (!participant) return res.status(403).json({ msg: "Anda bukan bagian dari percakapan ini." });
    } else { // Create new conversation
        if (!recipient_id) return res.status(400).json({ msg: "ID Penerima dibutuhkan untuk percakapan baru." });
        if (sender_id === parseInt(recipient_id, 10)) return res.status(400).json({msg: "Tidak bisa mengirim pesan ke diri sendiri."});

        // Check if a conversation already exists between these two users for this product
        const existingConversation = await Conversation.findOne({
            include: [
                {
                    model: User,
                    as: 'participants',
                    attributes: ['user_id'],
                    through: { attributes: [] },
                    where: { user_id: { [Op.in]: [sender_id, parseInt(recipient_id, 10)] } }
                },
                {
                    model: Barang,
                    as: 'product',
                    required: !!product_id, // only include if product_id is present
                    where: product_id ? { item_id: product_id } : {}
                }
            ],
            group: ['conversations.conversation_id', 'product.item_id'], // Ensure correct grouping
            having: Sequelize.literal(`COUNT(DISTINCT \`participants\`.\`user_id\`) = 2`) // Both users must be participants
        });


        if (existingConversation) {
            conversation = existingConversation;
            convId = existingConversation.conversation_id;
        } else {
            conversation = await Conversation.create({ product_id: product_id || null }, { transaction: t });
            await conversation.addParticipants([sender_id, parseInt(recipient_id, 10)], { transaction: t });
            convId = conversation.conversation_id;
        }
    }

    const message = await Message.create({
      conversation_id: convId,
      sender_id,
      content
    }, { transaction: t });

    // Update conversation's updated_at timestamp
    await conversation.changed('updated_at', true); // Mark as changed
    await conversation.update({ updated_at: new Date() }, { transaction: t }); // Force update updated_at

    await t.commit();
    res.status(201).json(message);
  } catch (error) {
    await t.rollback();
    console.error("Create message error:", error);
    res.status(500).json({ msg: error.message });
  }
};
