import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { email, password, name, phone_number, profile_picture } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ msg: "Email, password, dan name wajib diisi" });

  try {
    const exist = await User.findOne({ where: { email } });
    if (exist)
      return res.status(409).json({ msg: "Email sudah terdaftar" });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash, name, phone_number, profile_picture });
    res.status(201).json({ msg: "Register berhasil" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Email dan password wajib diisi" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ msg: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ msg: "Password salah" });

    const accessToken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};