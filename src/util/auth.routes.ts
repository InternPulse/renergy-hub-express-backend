// import { Router } from "express";
// import {
//   registerUser,
//   verifyEmail,
//   resendEmail,
//   login,
//   logout,
// } from "../user-management/controller/auth.controllers";

// const router = Router();

// router.post("/register", registerUser);
// router.post("/verify", verifyEmail);
// router.get("/resend/:id", resendEmail);
// router.post("/login", login);
// router.get("/logout", logout);

// export default router;


import { Router } from "express";
import {
  registerUser,
  verifyEmail,
  resendEmail,
  login,
  logout,
  requestPasswordReset, 
  resetPassword, 
} from "../user-management/controller/auth.controllers"; // Import the new functions

const router = Router();

// User registration
router.post("/register", registerUser);

// Email verification
router.post("/verify", verifyEmail);

// Resend verification email
router.get("/resend/:id", resendEmail);

// User login
router.post("/login", login);

// User logout
router.get("/logout", logout);

// Password reset request (send email with reset link)
router.post("/password-reset", requestPasswordReset); 

// Reset password with the token received in the password reset email
router.post("/reset-password", resetPassword); 

export default router;
