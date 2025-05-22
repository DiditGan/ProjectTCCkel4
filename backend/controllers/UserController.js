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
  const { email, name, phone_number, profile_picture, current_password, new_password } = req.body;
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

    const updateData = { email, name, phone_number, profile_picture };

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


    await User.update(updateData, { where: { user_id: req.userId } });
    res.json({ msg: "Profil berhasil diupdate" });
  } catch (error) {
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

