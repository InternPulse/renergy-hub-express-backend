import { Router } from "express";
import passport from './passportConfig';
import {
  registerUser,
  verifyEmail,
  resendEmail,
  login,
  logout,
  googleCallback,
  facebookCallback
} from "../user-management/controller/auth.controllers";

const router = Router();

router.post("/register", registerUser);
router.post("/verify", verifyEmail);
router.get("/resend/:id", resendEmail);
router.post("/login", login);
router.get("/logout", logout);
router.get('/google', passport.authenticate('google', { scope: ['profile', "email"] }));
router.get('/google/callback', passport.authenticate('google', {session: false}), googleCallback);
router.get('/facebook', passport.authenticate('facebook', { scope: ["email"] }));
router.get('/facebook/callback', passport.authenticate('facebook', {session: false}), facebookCallback);






export default router;
