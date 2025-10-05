const jwt = require("jsonwebtoken");
const { prisma } = require("../db.js");

exports.protect = async (req, res, next) => {
  console.log("Headers:", req.headers.authorization);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      console.log("token", token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
