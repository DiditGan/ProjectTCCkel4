import * as BarangController from "../controllers/BarangController.js";
import Barang from "../models/BarangModel.js";
import User from "../models/UserModel.js";
import { mockRequest, mockResponse } from "./helpers/mockExpress.js";

jest.mock("../models/BarangModel.js");
jest.mock("../models/UserModel.js");

describe("BarangController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getBarang", () => {
    it("should return all barang", async () => {
      Barang.findAll.mockResolvedValue([{ item_id: 1, item_name: "Barang 1" }]);
      const req = mockRequest();
      const res = mockResponse();

      await BarangController.getBarang(req, res);

      expect(res.json).toHaveBeenCalledWith([{ item_id: 1, item_name: "Barang 1" }]);
    });
  });

  describe("createBarang", () => {
    it("should create barang", async () => {
      Barang.create.mockResolvedValue({ item_id: 1, item_name: "Barang Baru" });
      const req = mockRequest(
        {
          item_name: "Barang Baru",
          price: 1000,
        },
        {},
        {},
        1
      );
      const res = mockResponse();

      await BarangController.createBarang(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Barang berhasil ditambahkan",
        data: { item_id: 1, item_name: "Barang Baru" },
      });
    });

    it("should fail if item_name or price missing", async () => {
      const req = mockRequest({}, {}, {}, 1);
      const res = mockResponse();

      await BarangController.createBarang(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: "Nama barang dan harga wajib diisi." });
    });
  });
});
