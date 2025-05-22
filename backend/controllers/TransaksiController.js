import Transaksi from "../models/TransaksiModel.js";
import Barang from "../models/BarangModel.js";
import User from "../models/UserModel.js"; // Import User model
import { Op } from "sequelize";

export const getTransaksi = async (req, res) => {
  try {
    const { type } = req.query; // type can be 'purchase' or 'sale'
    let whereClause = {};

    if (type === 'purchase') {
      whereClause.buyer_id = req.userId;
    } else if (type === 'sale') {
      whereClause.seller_id = req.userId;
    } else {
      // If no type, or invalid type, get all transactions user is involved in
      whereClause = {
        [Op.or]: [
          { buyer_id: req.userId },
          { seller_id: req.userId }
        ]
      };
    }

    const transaksi = await Transaksi.findAll({
      where: whereClause,
      include: [
        { 
          model: Barang, 
          as: 'item',
          attributes: ['item_id', 'item_name', 'image_url', 'price'] 
        },
        { model: User, as: 'buyer', attributes: ['user_id', 'name', 'email'] },
        { model: User, as: 'seller', attributes: ['user_id', 'name', 'email'] }
      ],
      order: [['transaction_date', 'DESC']]
    });
    res.json(transaksi);
  } catch (error) {
    console.error("Get transaksi error:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const getTransaksiById = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.transaction_id, {
      include: [
        { 
          model: Barang, 
          as: 'item',
          attributes: ['item_id', 'item_name', 'image_url', 'price', 'user_id'], // Include seller_id from item
          include: [{model: User, attributes: ['name', 'email']}] // Seller info from Barang model
        },
        { model: User, as: 'buyer', attributes: ['user_id', 'name', 'email', 'phone_number', 'address'] },
        // Seller info is now part of item.User
      ]
    });
    if (!transaksi) return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    
    if (transaksi.buyer_id !== req.userId && transaksi.seller_id !== req.userId) {
      return res.status(403).json({ msg: "Anda tidak memiliki akses untuk melihat transaksi ini" });
    }
    
    res.json(transaksi);
  } catch (error) {
    console.error("Get TransaksiById error:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const createTransaksi = async (req, res) => {
  try {
    const buyer_id = req.userId;
    const { item_id, quantity, payment_method, shipping_address, customerInfo } = req.body; // customerInfo from frontend

    if (!item_id || !quantity) {
        return res.status(400).json({ msg: "Item ID dan quantity wajib diisi." });
    }

    const barang = await Barang.findByPk(item_id);
    if (!barang) {
      return res.status(404).json({ msg: "Barang tidak ditemukan" });
    }
    if (barang.status !== 'available') {
        return res.status(400).json({ msg: "Barang sudah tidak tersedia." });
    }

    const seller_id = barang.user_id;
    
    if (buyer_id === seller_id) {
      return res.status(400).json({ msg: "Anda tidak dapat membeli barang sendiri" });
    }
    
    const parsedQuantity = parseInt(quantity, 10);
    const totalPrice = barang.price * parsedQuantity; // Assuming barang.price is numeric

    // Use customerInfo from request body if available, otherwise default to buyer's profile (if needed)
    const finalShippingAddress = shipping_address || customerInfo?.address;


    const transaksiData = {
      item_id,
      buyer_id,
      seller_id,
      quantity: parsedQuantity,
      total_price: totalPrice,
      status: "pending", // Default status
      payment_method: payment_method || customerInfo?.paymentMethod?.name,
      shipping_address: finalShippingAddress,
      transaction_date: new Date()
    };
    
    const newTransaksi = await Transaksi.create(transaksiData);
    
    // Optionally, update item status to 'sold' or decrease stock if applicable
    // For simplicity, we'll assume one item, so mark as sold.
    // If multiple quantities, this logic would be more complex.
    await barang.update({ status: 'sold' });

    res.status(201).json({ msg: "Transaksi berhasil dibuat", data: newTransaksi });
  } catch (error) {
    console.error("Create transaksi error:", error);
    res.status(400).json({ msg: error.message });
  }
};

export const updateTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.transaction_id);
    if (!transaksi) return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    
    // Allow buyer or seller to update status (e.g., seller confirms payment, buyer confirms receipt)
    if (transaksi.buyer_id !== req.userId && transaksi.seller_id !== req.userId) {
      return res.status(403).json({ msg: "Anda tidak memiliki akses untuk mengupdate transaksi ini" });
    }
    
    const { status } = req.body; // Only allow updating status for now
    if (status && !["pending", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ msg: "Status tidak valid." });
    }

    await transaksi.update({ status });
    res.json({ msg: "Transaksi berhasil diupdate", data: transaksi });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.transaction_id);
    if (!transaksi) return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    
    // Example: Only admin or involved parties under certain conditions can delete
    // For now, let's restrict to seller if status is 'pending' or 'cancelled'
    if (transaksi.seller_id !== req.userId || !['pending', 'cancelled'].includes(transaksi.status)) {
      return res.status(403).json({ msg: "Anda tidak memiliki akses untuk menghapus transaksi ini atau status tidak memungkinkan." });
    }
    
    // If transaction is cancelled, item might become available again
    if (transaksi.status === 'cancelled') {
        const barang = await Barang.findByPk(transaksi.item_id);
        if (barang) await barang.update({ status: 'available' });
    }

    await transaksi.destroy();
    res.json({ msg: "Transaksi berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};