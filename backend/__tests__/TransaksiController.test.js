import * as TransaksiController from "../controllers/TransaksiController.js";
import Transaksi from "../models/TransaksiModel.js";
import Barang from "../models/BarangModel.js";
import { mockRequest, mockResponse } from "./helpers/mockExpress.js";

jest.mock("../models/TransaksiModel.js");
jest.mock("../models/BarangModel.js");

describe("TransaksiController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTransaksi", () => {
    it("should return transaksi for user", async () => {
      Transaksi.findAll.mockResolvedValue([{ transaction_id: 1 }]);
      const req = mockRequest({}, {}, {}, 1);
      const res = mockResponse();

      await TransaksiController.getTransaksi(req, res);

      expect(res.json).toHaveBeenCalledWith([{ transaction_id: 1 }]);
    });
  });

  describe("createTransaksi", () => {
    it("should create transaksi if valid", async () => {
      Barang.findByPk.mockResolvedValue({
        item_id: 1,
        user_id: 2,
        status: "available",
        price: 1000,
        update: jest.fn(),
      });
      Transaksi.create.mockResolvedValue({ transaction_id: 1 });

      const req = mockRequest(
        { item_id: 1, quantity: 2 },
        {},
        {},
        1
      );
      const res = mockResponse();

      await TransaksiController.createTransaksi(req, res);

      expect(Transaksi.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Transaksi berhasil dibuat",
        data: { transaction_id: 1 },
      });
    });

    it("should not allow self-purchase", async () => {
      Barang.findByPk.mockResolvedValue({
        item_id: 1,
        user_id: 1,
        status: "available",
        price: 1000,
      });

      const req = mockRequest({ item_id: 1, quantity: 1 }, {}, {}, 1);
      const res = mockResponse();

      await TransaksiController.createTransaksi(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ code: "SELF_PURCHASE_NOT_ALLOWED" })
      );
    });
  });
});
