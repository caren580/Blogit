import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller';
import { verifyUserInfo } from '../middlewares/verifyUserInfo';
import { checkEmailAndPasswordStrength } from '../middlewares/checkEmailAndPasswordStrength';

const router = Router();

router.post('/register', verifyUserInfo, checkEmailAndPasswordStrength, registerUser);
router.post('/login', loginUser )
router.post("/logout", logoutUser);

export default router;
