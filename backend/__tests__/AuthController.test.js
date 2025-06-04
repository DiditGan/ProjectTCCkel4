const AuthController = require("../controllers/AuthController");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { mockRequest, mockResponse } = require("./helpers/mockExpress");

jest.mock("../models/UserModel");

describe("AuthController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ user_id: 1 });

      const req = mockRequest({
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      });
      const res = mockResponse();

      await AuthController.register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: "Register berhasil" });
    });

    it("should not register if email exists", async () => {
      User.findOne.mockResolvedValue({ user_id: 1 });

      const req = mockRequest({
        email: "test@example.com",
        password: "password123",
        name: "Test User"
      });
      const res = mockResponse();

      await AuthController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ msg: "Email sudah terdaftar" });
    });
  });

  describe("login", () => {
    it("should login user and return tokens", async () => {
      const hashed = await bcrypt.hash("password123", 10);
      User.findOne.mockResolvedValue({
        user_id: 1,
        email: "test@example.com",
        password: hashed,
        name: "Test User",
        phone_number: "08123456789",
        profile_picture: null,
        address: null,
      });

      const req = mockRequest({
        email: "test@example.com",
        password: "password123"
      });
      const res = mockResponse();

      await AuthController.login(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({
          user_id: 1,
          name: "Test User",
        })
      }));
    });

    it("should fail login if user not found", async () => {
      User.findOne.mockResolvedValue(null);
      const req = mockRequest({ email: "notfound@example.com", password: "pass" });
      const res = mockResponse();

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "User tidak ditemukan" });
    });
  });
});
