const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // ✅ If no token → allow PUBLIC access (VERY IMPORTANT)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = { id: decoded.id || decoded._id };
    next();

  } catch (err) {
    console.error("⚠️ Token verification failed (expired/invalid):", err.message);

    // ✅ DO NOT CRASH SERVER
    return res.status(401).json({
      message: "Session expired. Please login again.",
      expired: true,
    });
  }
};

module.exports = verifyToken;
