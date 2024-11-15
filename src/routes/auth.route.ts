import express from 'express';
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from '../controller/auth.controller';
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.post('/verify-email', verifyEmail);
// social login here
export default router;
