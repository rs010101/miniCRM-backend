import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request (assuming token has an _id or id field)
    req.user = { _id: decoded._id || decoded.id };

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}
