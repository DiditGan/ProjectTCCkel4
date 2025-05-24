import Barang from "../models/BarangModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      whereClause.status = 'available';
    }

    if (minPrice) {
        whereClause.price = { ...whereClause.price, [Op.gte]: parseFloat(minPrice) };
    }
    if (maxPrice) {
        whereClause.price = { ...whereClause.price, [Op.lte]: parseFloat(maxPrice) };
    }
    
    const validSortBy = ['date_posted', 'price', 'item_name']; // Removed 'views', 'interested_count'
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
    // await barang.increment('views'); // Removed view increment
    
    // Add ownership flag for frontend
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

export const createBarang = async (req, res) => {
  try {
    const user_id = req.userId;
    if (!user_id) {
      return res.status(401).json({ msg: "Unauthorized: User ID not found" });
    }

    console.log("Creating barang with data:", req.body);
    console.log("File info:", req.file);

    const { item_name, description, category, price, condition, location, status = "available" } = req.body;

    if (!item_name) {
      return res.status(400).json({ msg: "Nama barang wajib diisi." });
    }

    // Get file path for the image if uploaded
    let image_url = null;
    if (req.file) {
      // Path relative to the 'uploads' static directory
      image_url = `/uploads/products/${req.file.filename}`;
      console.log("Image path set to:", image_url);
    }

    const barangData = {
      user_id,
      item_name,
      description,
      category,
      price: price ? parseFloat(price) : null,
      condition,
      location,
      image_url,
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
    
    console.log("📝 Updating barang with data:", req.body);
    console.log("📁 New file uploaded:", req.file ? req.file.filename : 'No');
    
    const { item_name, description, category, price, condition, location, status } = req.body;
    
    // Build update data object
    const updateData = {};
    
    if (item_name !== undefined) updateData.item_name = item_name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (condition !== undefined) updateData.condition = condition;
    if (location !== undefined) updateData.location = location;
    if (status !== undefined) updateData.status = status;
    if (price !== undefined) updateData.price = price ? parseFloat(price) : null;

    // Handle image update
    if (req.file) {
      // Delete old image file if it exists and is different
      if (barang.image_url && barang.image_url !== `/uploads/products/${req.file.filename}`) {
        // Construct absolute path to the old image file
        // barang.image_url is like /uploads/products/old_image.jpg
        // __dirname is backend/controllers
        const oldImageAbsolutePath = path.join(__dirname, '..', barang.image_url);
        try {
          if (fs.existsSync(oldImageAbsolutePath)) {
            fs.unlinkSync(oldImageAbsolutePath);
            console.log("🗑️ Deleted old image:", oldImageAbsolutePath);
          }
        } catch (deleteError) {
          console.error("Failed to delete old image:", oldImageAbsolutePath, deleteError);
        }
      }
      
      // Set new image URL (relative path)
      updateData.image_url = `/uploads/products/${req.file.filename}`;
      console.log("🖼️ Updated image URL to:", updateData.image_url);
    }

    await barang.update(updateData);
    
    // Fetch updated barang with user info
    const updatedBarang = await Barang.findByPk(req.params.item_id, {
      include: [{ model: User, attributes: ['user_id', 'name', 'profile_picture'] }]
    });
    
    res.json({ msg: "Barang berhasil diupdate", data: updatedBarang });
  } catch (error) {
    console.error("❌ Update barang error:", error);
    
    // Clean up uploaded file if database update fails
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
        console.log("🗑️ Cleaned up uploaded file due to error");
      } catch (unlinkError) {
        console.error("Failed to clean up file:", unlinkError);
      }
    }
    
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

    // Delete associated image file
    if (barang.image_url) {
      // barang.image_url is like /uploads/products/image.jpg
      // __dirname is backend/controllers
      const imageAbsolutePath = path.join(__dirname, '..', barang.image_url);
      try {
        if (fs.existsSync(imageAbsolutePath)) {
          fs.unlinkSync(imageAbsolutePath);
          console.log("🗑️ Deleted image file:", imageAbsolutePath);
        }
      } catch (deleteError) {
        console.error("Failed to delete image file:", imageAbsolutePath, deleteError);
      }
    }

    await barang.destroy();
    res.json({ msg: "Barang berhasil dihapus" });
  } catch (error) {
    console.error("❌ Delete barang error:", error);
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