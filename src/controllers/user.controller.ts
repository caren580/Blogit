import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../Types/auth";
import bcrypt from "bcryptjs";

const client = new PrismaClient();



export const updateUserInfo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.user!;
    const { firstName, lastName, username, emailAddress } = req.body;

    const updatedUser = await client.user.update({
      where: { id },
      data: { firstName, lastName, username, emailAddress },
    });

    const { password, ...userData } = updatedUser;
    res.json(userData);
  } catch (e) {
    res.status(500).json({ message: "Failed to update user info." });
  }
};
export const updateUserPassword = async (req: AuthRequest, res: Response) => {
  try {
   const { id } = req.user as { id: string };

    const { currentPassword, newPassword } = req.body;

    const user = await client.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await client.user.update({
      where: { id },
      data: { password: hashed },
    });

    res.json({ message: "Password updated successfully" });
  } catch (e) {
    res.status(500).json({ message: "Failed to update password" });
  }
};
export const getUserBlogs = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.user!;

    const blogs = await client.blog.findMany({
      where: { userId: id, isDeleted: false },
    });

    res.json(blogs);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};


