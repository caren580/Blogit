
import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getSpecificBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.post("/", verifyToken, createBlog);
router.get("/", getAllBlogs);
router.get("/:blogId", getSpecificBlog);
router.patch("/:blogId", verifyToken, updateBlog);
router.delete("/:blogId", verifyToken, deleteBlog);

export default router;
