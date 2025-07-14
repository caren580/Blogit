
import { Router } from "express";
import {
  updateUserInfo,
  updateUserPassword,
  getUserBlogs,
} from "../controllers/user.controller";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.patch("/", verifyToken, updateUserInfo);
router.patch("/password", verifyToken, updateUserPassword);
router.get("/blogs", verifyToken, getUserBlogs);

export default router;
