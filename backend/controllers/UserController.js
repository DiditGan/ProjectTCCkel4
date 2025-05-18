import User from "../models/UserModel.js";

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

