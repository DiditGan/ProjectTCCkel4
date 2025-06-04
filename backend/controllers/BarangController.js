import Barang from "../models/BarangModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";

const getBarang = async (req, res) => {
  try {
    const { search, category, status, minPrice, maxPrice, sortBy = 'date_posted', order = 'DESC' } = req.query;
    let whereClause = {};

    if (search) {
      whereClause.item_name = { [Op.like]: `%${search}%` };
    }
    if (category && category.toLowerCase() !== 'all items') {
      whereClause.category = category;
    }
    if (status) {
      whereClause.status = status;
    }

    if (minPrice) {
        whereClause.price = { ...whereClause.price, [Op.gte]: parseFloat(minPrice) };
    }
    if (maxPrice) {
        whereClause.price = { ...whereClause.price, [Op.lte]: parseFloat(maxPrice) };
    }
    
    const validSortBy = ['date_posted', 'price', 'item_name'];
    const sortField = validSortBy.includes(sortBy) ? sortBy : 'date_posted';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const barang = await Barang.findAll({
      where: whereClause,
      include: [{ model: User, as: "user", attributes: ['user_id', 'name'] }],
      order: [[sortField, sortOrder]]
    });

    res.json(barang);
  } catch (error) {
    console.error("Get barang error:", error);
    res.status(500).json({ msg: error.message });
  }
};

const getBarangById = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.item_id, {
      include: [{ model: User, as: "user", attributes: ['user_id', 'name', 'email', 'phone_number'] }]
    });
    if (!barang) return res.status(404).json({ msg: "Barang tidak ditemukan" });
    const responseData = {
      ...barang.toJSON(),
      isOwner: req.userId ? barang.user_id === req.userId : false,
      canPurchase: req.userId ? barang.user_id !== req.userId && barang.status === 'available' : false
    };
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createBarang = async (req, res) => {
  try {
    const user_id = req.userId;
    if (!user_id) {
      return res.status(401).json({ msg: "Unauthorized: User ID not found" });
    }

    let {
      item_name,
      description,
      category,
      price,
      condition,
      location,
      status = "available",
      image_url
    } = req.body;

    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/products/${req.file.filename}`;
    } else if (image_url) {
      imagePath = image_url;
    }

    if (!item_name || !price) {
      return res.status(400).json({ msg: "Nama barang dan harga wajib diisi." });
    }

    const barangData = {
      user_id,
      item_name,
      description,
      category,
      price: price ? parseFloat(price) : 0,
      condition,
      location,
      image_url: imagePath,
      status,
      date_posted: new Date()
    };

    const barang = await Barang.create(barangData);
    res.status(201).json({
      msg: "Barang berhasil ditambahkan",
      data: barang,
    });
  } catch (error) {
    console.error("Create barang error:", error);
    res.status(400).json({ msg: error.message });
  }
};

const updateBarang = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.item_id);
    if (!barang) return res.status(404).json({ msg: "Barang tidak ditemukan" });

    if (barang.user_id !== req.userId) {
      return res.status(403).json({ msg: "Anda tidak memiliki akses untuk update barang ini" });
    }

    // Support both JSON and multipart/form-data
    let {
      item_name,
      description,
      category,
      price,
      condition,
      location,
      status,
      image_url
    } = req.body;

    let imagePath = barang.image_url;
    if (req.file) {
      imagePath = `/uploads/products/${req.file.filename}`;
      // Optionally: delete old image file here
    } else if (image_url !== undefined) {
      imagePath = image_url;
    }

    const updateData = {};
    if (item_name !== undefined) updateData.item_name = item_name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (condition !== undefined) updateData.condition = condition;
    if (location !== undefined) updateData.location = location;
    if (status !== undefined) updateData.status = status;
    if (price !== undefined) updateData.price = price ? parseFloat(price) : null;
    if (imagePath !== undefined) updateData.image_url = imagePath;

    await barang.update(updateData);

    const updatedBarang = await Barang.findByPk(req.params.item_id, {
      include: [{ model: User, as: "user", attributes: ['user_id', 'name'] }]
    });

    res.json({ msg: "Barang berhasil diupdate", data: updatedBarang });
  } catch (error) {
    console.error("❌ Update barang error:", error);
    res.status(400).json({ msg: error.message });
  }
};

const deleteBarang = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.item_id);
    if (!barang) return res.status(404).json({ msg: "Barang tidak ditemukan" });

    if (barang.user_id !== req.userId) {
      return res.status(403).json({ msg: "Anda tidak memiliki akses untuk menghapus barang ini" });
    }

    await barang.destroy();
    res.json({ msg: "Barang berhasil dihapus" });
  } catch (error) {
    console.error("❌ Delete barang error:", error);
    res.status(400).json({ msg: error.message });
  }
};

const getMyBarang = async (req, res) => {
  try {
    const user_id = req.userId;
    const { status } = req.query;
    let whereClause = { user_id };

    if (status && status !== 'all') {
        whereClause.status = status;
    }

    const barang = await Barang.findAll({
      where: whereClause,
      order: [['date_posted', 'DESC']]
    });
    res.json(barang);
  } catch (error) {
    console.error("Get my barang error:", error);
    res.status(500).json({ msg: error.message });
  }
};

export {
  getBarang,
  getBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
  getMyBarang
};