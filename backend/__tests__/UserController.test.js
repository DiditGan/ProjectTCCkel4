const UserController = require("../controllers/UserController");
const User = require("../models/UserModel");
const { mockRequest, mockResponse } = require("./helpers/mockExpress");

jest.mock("../models/UserModel");

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getMyProfile", () => {
    it("should return user profile", async () => {
      User.findByPk.mockResolvedValue({ user_id: 1, name: "Test User" });
      const req = mockRequest({}, {}, {}, 1);
      const res = mockResponse();

      await UserController.getMyProfile(req, res);

      expect(res.json).toHaveBeenCalledWith({ user_id: 1, name: "Test User" });
    });

    it("should return 404 if user not found", async () => {
      User.findByPk.mockResolvedValue(null);
      const req = mockRequest({}, {}, {}, 1);
      const res = mockResponse();

      await UserController.getMyProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "User tidak ditemukan" });
    });
  });
});
