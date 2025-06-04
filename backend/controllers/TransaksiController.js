import Transaksi from "../models/TransaksiModel.js";
import Barang from "../models/BarangModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

const getTransaksi = async (req, res) => {
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

const getTransaksiById = async (req, res) => {
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

const createTransaksi = async (req, res) => {
  try {
    const buyer_id = req.userId;
    const { item_id, quantity, payment_method, shipping_address, customerInfo } = req.body;

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
    
    // Prevent self-purchase
    if (buyer_id === seller_id) {
      return res.status(400).json({ 
        msg: "Anda tidak dapat membeli barang sendiri",
        code: "SELF_PURCHASE_NOT_ALLOWED"
      });
    }
    
    const parsedQuantity = parseInt(quantity, 10);
    const totalPrice = barang.price * parsedQuantity;

    const finalShippingAddress = shipping_address || customerInfo?.address;

    const transaksiData = {
      item_id,
      buyer_id,
      seller_id,
      quantity: parsedQuantity,
      total_price: totalPrice,
      status: "pending",
      payment_method: payment_method || customerInfo?.paymentMethod?.name,
      shipping_address: finalShippingAddress,
      transaction_date: new Date()
    };
    
    const newTransaksi = await Transaksi.create(transaksiData);
    await barang.update({ status: 'sold' });

    res.status(201).json({ msg: "Transaksi berhasil dibuat", data: newTransaksi });
  } catch (error) {
    console.error("Create transaksi error:", error);
    res.status(400).json({ msg: error.message });
  }
};

const updateTransaksi = async (req, res) => {
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

const deleteTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.transaction_id);
    if (!transaksi) return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    
    // Allow both buyer and seller to delete transactions they're involved in
    if (transaksi.buyer_id !== req.userId && transaksi.seller_id !== req.userId) {
      return res.status(403).json({ msg: "Anda tidak memiliki akses untuk menghapus transaksi ini" });
    }
    
    // If transaction is pending or cancelled, update item status to available
    if (['pending', 'cancelled'].includes(transaksi.status)) {
      const barang = await Barang.findByPk(transaksi.item_id);
      if (barang) await barang.update({ status: 'available' });
    }

    await transaksi.destroy();
    res.json({ msg: "Transaksi berhasil dihapus" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(400).json({ msg: error.message });
  }
};

export {
  getTransaksi,
  getTransaksiById,
  createTransaksi,
  updateTransaksi,
  deleteTransaksi
};