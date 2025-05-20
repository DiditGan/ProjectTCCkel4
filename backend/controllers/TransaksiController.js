import Transaksi from "../models/TransaksiModel.js";

export const getTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findAll();
    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTransaksiById = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.transaction_id);
    if (!transaksi) return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    res.json(transaksi);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createTransaksi = async (req, res) => {
  try {
    await Transaksi.create(req.body);
    res.status(201).json({ msg: "Transaksi berhasil dibuat" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.transaction_id);
    if (!transaksi) return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    await transaksi.update(req.body);
    res.json({ msg: "Transaksi berhasil diupdate" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteTransaksi = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.transaction_id);
    if (!transaksi) return res.status(404).json({ msg: "Transaksi tidak ditemukan" });
    await transaksi.destroy();
    res.json({ msg: "Transaksi berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};