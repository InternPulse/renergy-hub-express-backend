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
  changePassword,
  registerVendor,
  registerAdmin,
} from "../user-management/controller/auth.controllers";

const router = Router();

router.post("/register/customer", registerUser);
router.post("/register/vendor", registerVendor);
router.post("/register/admin", registerAdmin);
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
router.post("/change-password", changePassword);

export default router;
