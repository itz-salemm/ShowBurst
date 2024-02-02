const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("authToken")?.split(" ")[1];
  //const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }

  try {
    const decodedToken = jwt.verify(token, "secret_key");
    req.userData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
