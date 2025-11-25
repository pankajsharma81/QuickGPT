const jwt = require("jsonwebtoken");
const UserModel = require("../src/models/user.model");
async function authMiddleware(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token, Please login again",
    });
  }
}

module.exports = { authMiddleware };
