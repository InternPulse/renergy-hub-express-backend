import { Router } from "express";
import passport from "./passportConfig";
import {
  registerUser,
  verifyEmail,
  resendEmail,
  login,
  logout,
  googleCallback,
  facebookCallback,
  requestPasswordReset,
  verifyPasswordReset,
  resetPassword,
  forgotPassword,
  verifyForgotPassword,
} from "../user-management/controller/auth.controllers";

const router = Router();

router.post("/register", registerUser);
router.post("/verify", verifyEmail);
router.get("/resend/:id", resendEmail);
router.post("/login", login);
router.get("/logout", logout);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  facebookCallback
);
router.post("/request-password-reset", requestPasswordReset);
router.get("/verify-password-reset", verifyPasswordReset);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password", verifyForgotPassword);
router.post("/reset-password", resetPassword);

export default router;
