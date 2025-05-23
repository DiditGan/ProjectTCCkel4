import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { email, password, name, phone_number, profile_picture } = req.body;
  try {
    await User.create({ email, password, name, phone_number, profile_picture });
    res.status(201).json({ msg: "User created" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { email, name, phone_number, profile_picture } = req.body;
  try {
    await User.update(
      { email, name, phone_number, profile_picture },
      { where: { user_id } }
    );
    res.json({ msg: "User updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    await User.destroy({ where: { user_id } });
    res.json({ msg: "User deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { email, name, phone_number, address, current_password, new_password } = req.body;
    
    console.log("📝 Updating profile with data:", {
      email, name, phone_number, address,
      has_current_password: !!current_password,
      has_new_password: !!new_password,
      file: req.file ? req.file.filename : 'No file uploaded'
    });
    
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    // Build update data with only provided fields
    const updateData = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (phone_number !== undefined) updateData.phone_number = phone_number;
    if (address !== undefined) updateData.address = address;

    // Handle profile picture upload
    if (req.file) {
      updateData.profile_picture = `/uploads/profiles/${req.file.filename}`;
      console.log("📸 Profile picture updated to:", updateData.profile_picture);
    }

    // Handle password update
    if (new_password) {
      if (!current_password) {
        return res.status(400).json({ msg: "Password saat ini diperlukan untuk mengubah password." });
      }
      const match = await bcrypt.compare(current_password, user.password);
      if (!match) {
        return res.status(401).json({ msg: "Password saat ini salah." });
      }
      updateData.password = await bcrypt.hash(new_password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ msg: "Tidak ada data yang diubah" });
    }

    await User.update(updateData, { where: { user_id: req.userId } });
    
    // Return updated user data (excluding password)
    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ["password"] }
    });
    
    res.json({ 
      msg: "Profil berhasil diupdate",
      user: updatedUser
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(400).json({ msg: error.message });
  }
};

// Admin function - Get all users (optional, if needed)
export const getAllUsers = async (req, res) => {
  try {
    // Add admin role check here if you have roles
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Admin function - Delete user (optional, if needed)
export const deleteUserById = async (req, res) => {
  const { user_id } = req.params;
  try {
    // Add admin role check here
    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
    await User.destroy({ where: { user_id } });
    res.json({ msg: "User berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

