
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../Types/auth";

export default function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const bearer = req.headers.authorization?.split(" ")[1];
  const token = req.cookies?.authToken || bearer;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as any; 
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
