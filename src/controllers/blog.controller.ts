
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()
interface AuthRequest extends Request {
  user?: { id: string };
}

export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { title, synopsis, content, featuredImage } = req.body;
    const { id } = req.user!;            

    const blog = await prisma.blog.create({
      data: { title, synopsis, content, featuredImage, userId: id },
    });

    return res.status(201).json({ message: "Blog created", blogId: blog.id });
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};


export const getAllBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { isDeleted: false },
      include: {
        user: { select: { firstName: true, lastName: true, username: true } },
      },
    });

    return res.status(200).json({ blogs });
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};


export const getSpecificBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    const blog = await prisma.blog.findFirst({
      where: { id: blogId, isDeleted: false },
    });

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    return res.status(200).json({ blog });
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};


export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const { title, synopsis, content, featuredImage } = req.body;

    const updated = await prisma.blog.update({
      where: { id: blogId },
      data: { title, synopsis, content, featuredImage },
    });

    return res.status(200).json({ message: "Blog updated", blog: updated });
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};


export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    await prisma.blog.update({
      where: { id: blogId },
      data: { isDeleted: true },
    });

    return res.status(200).json({ message: "Blog deleted" });
  } catch {
    return res.status(500).json({ message: "something went wrong" });
  }
};
