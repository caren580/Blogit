import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const client = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, emailAddress, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.user.create({
      data: {
        firstName,
        lastName,
        username,
        emailAddress,
        password: hashedPassword,
      },
    });

    res.status(201).json('Account created successfully');
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    const user = await client.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { emailAddress: identifier }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Wrong login credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Wrong login credentials" });
    }

    const {password: userPassword , createdAt, updatedAt, ...userDetails} = user;
    const token= jwt.sign(userDetails, process.env.JWT_SECRET!)
    res.cookie("authToken", token).json(userDetails)

    res.send(userDetails)
    
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const logoutUser = (_req: Request, res: Response) => {

  res.clearCookie("authToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.json({ message: "Logged out successfully" });
};


  