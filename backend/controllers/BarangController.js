import Barang from "../models/BarangModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getBarang = async (req, res) => {
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
    } else {
      // Default to showing only available items if no status is specified for general browsing
      whereClause.status = 'available';
    }

    if (minPrice) {
        whereClause.price = { ...whereClause.price, [Op.gte]: parseFloat(minPrice) };
    }
    if (maxPrice) {
        whereClause.price = { ...whereClause.price, [Op.lte]: parseFloat(maxPrice) };
    }
    
    const validSortBy = ['date_posted', 'price', 'item_name', 'views', 'interested_count'];
    const sortField = validSortBy.includes(sortBy) ? sortBy : 'date_posted';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';


    const barang = await Barang.findAll({
      where: whereClause,
      include: [{ model: User, attributes: ['user_id', 'name', 'profile_picture'] }],
      order: [[sortField, sortOrder]]
    });
    res.json(barang);
  } catch (error) {
    console.error("Get barang error:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const getBarangById = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.item_id, {
      include: [{ model: User, attributes: ['user_id', 'name', 'email', 'phone_number', 'profile_picture'] }]
    });
    if (!barang) return res.status(404).json({ msg: "Barang tidak ditemukan" });
    
    // Increment views (optional, can be done more robustly)
    await barang.increment('views');
    
    res.json(barang);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createBarang = async (req, res) => {
  try {
    const user_id = req.userId;
    if (!user_id) {
      return res.status(401).json({ msg: "Unauthorized: User ID not found" });
    }

    const { item_name, description, category, price, condition, location, image_url, status = "available" } = req.body;

    if (!item_name || !category || !price || !condition) {
        return res.status(400).json({ msg: "Nama barang, kategori, harga, dan kondisi wajib diisi." });
    }

    const barangData = {
      user_id,
      item_name,
      description,
      category,
      price: parseFloat(price),
      condition,
      location,
      image_url, // Handle multiple images if frontend supports it
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

export const updateBarang = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.item_id);
    if (!barang) return res.status(404).json({ msg: "Barang tidak ditemukan" });

    if (barang.user_id !== req.userId) {
      return res.status(403).json({ msg: "Anda tidak memiliki akses untuk update barang ini" });
    }
    
    const { item_name, description, category, price, condition, location, image_url, status } = req.body;
    const updateData = { item_name, description, category, condition, location, image_url, status };
    if (price) {
        updateData.price = parseFloat(price);
    }

    await barang.update(updateData);
    res.json({ msg: "Barang berhasil diupdate", data: barang });
  } catch (error) {
    console.error("Update barang error:", error);
    res.status(400).json({ msg: error.message });
  }
};

export const deleteBarang = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.item_id);
    if (!barang) return res.status(404).json({ msg: "Barang tidak ditemukan" });

    if (barang.user_id !== req.userId) {
      return res.status(403).json({ msg: "Anda tidak memiliki akses untuk menghapus barang ini" });
    }

    await barang.destroy();
    res.json({ msg: "Barang berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Get items listed by the authenticated user
export const getMyBarang = async (req, res) => {
  try {
    const user_id = req.userId;
    const { status } = req.query; // Allow filtering by status (all, available, sold)
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