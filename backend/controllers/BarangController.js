import Barang from "../models/BarangModel.js";

export const getBarang = async (req, res) => {
  try {
    const barang = await Barang.findAll();
    res.json(barang);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBarangById = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.item_id);
    if (!barang) return res.status(404).json({ msg: "Barang tidak ditemukan" });
    res.json(barang);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createBarang = async (req, res) => {
  try {
    await Barang.create(req.body);
    res.status(201).json({ msg: "Barang berhasil ditambahkan" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateBarang = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.item_id);
    if (!barang) return res.status(404).json({ msg: "Barang tidak ditemukan" });
    await barang.update(req.body);
    res.json({ msg: "Barang berhasil diupdate" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteBarang = async (req, res) => {
  try {
    const barang = await Barang.findByPk(req.params.item_id);
    if (!barang) return res.status(404).json({ msg: "Barang tidak ditemukan" });
    await barang.destroy();
    res.json({ msg: "Barang berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};