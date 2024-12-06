import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";
import { validateUserDetails } from "../../util/validateUserDetails";
// import { checkPasswordMatch } from "../../util/checkPasswordMatch";
import { generateToken } from "../../util/generateToken";
import { compareSync, hashSync } from "bcryptjs";
import sendVerificationEmail from "../../util/sendVerificationEmail";
import * as EmailValidator from "email-validator";
import { createJWT } from "../../util/createJWT";
import { NODE_ENV } from "../../util/secrets";
import { environment } from "../../util/secrets";
import { generateAuthJWT } from "../../util/authJWT";
import sendResetVerificationEmail from "../../util/sendResetVerificationEmail";
import { checkNewPasswordMatch } from "../../util/checkNewPasswordMatch";
import sendForgotPasswordEmail from "../../util/sendForgotPasswordEmail";
import { validateVendorDetails } from "../../util/validateVendorDetails";
import { validateAdminDetails } from "../../util/validateAdminDetails";

const prisma = new PrismaClient();

let token: string;
let emailFirstName: string;

export const registerUser = async (req: Request, res: Response) => {
  try {
    let usertype = req.body["userType"];

    //check user type
    if (usertype != "CUSTOMER") {
      console.error("RegisterUser Controller: Invalid user type");
      res.status(400).json({
        status: "error",
        code: "400",
        message: "Invalid user type",
      });
      return;
    }

    //validate customer details
    let result = validateUserDetails(req.body);

    if (result == "rejected") {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "All fields are required",
      });
      return;
    }

    //Check password match
    // const check = checkPasswordMatch(req.body);

    // if (!check) {
    //   res.status(400).json({
    //     status: "error",
    //     code: "400",
    //     message: "Passwords do not match",
    //   });
    //   return;
    // }

    const { email, firstName, lastName, password, userType }: User = req.body;

    const emailFormResult = EmailValidator.validate(email);

    if (!emailFormResult) {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "Invalid email format",
      });
      return;
    }

    let emailAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // let userNameAlreadyExists = await prisma.user.findUnique({
    //   where: {
    //     username: req.body["username"],
    //   },
    // });

    //Check if user already exists
    if (emailAlreadyExists) {
      return res
        .status(400)
        .json({ status: "error", code: "400", message: "User already exists" });
    }

    //Create verification token
    token = generateToken().toString();

    //Assign firstName to email variable
    emailFirstName = firstName;

    //Verification time span
    const time = new Date(Date.now() + 1 * 60 * 60 * 1000);

    //Hash password and create new user
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashSync(password!, 10),
        verificationToken: token,
        verificationTokenExpiresAt: time,
        userType,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userType: true,
      },
    });

    await sendVerificationEmail(email, emailFirstName, token).catch(
      (err: any) => {
        console.error("Register user send verification email:", err.message);
      }
    );

    res.status(201).json({
      status: "success",
      code: "201",
      message:
        "You have successfully registered. Please check your email for verification.",
      data: newUser,
    });
    return;
  } catch (error: any) {
    console.error("Register user:", error.message);

    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error",
    });
    return;
  }
};

export const registerVendor = async (req: Request, res: Response) => {
  try {
    let usertype = req.body["userType"];

    //check user type
    if (usertype != "VENDOR") {
      console.error("RegisterVendor Controller: Invalid user type");
      res.status(400).json({
        status: "error",
        code: "400",
        message: "Invalid user type",
      });
      return;
    }

    //validate customer details
    let result = validateVendorDetails(req.body);

    if (result == "rejected") {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "All fields are required",
      });
      return;
    }

    const {
      email,
      firstName,
      lastName,
      password,
      brandName,
      brandType,
      streetAddress,
      city,
      zipCode,
      taxID,
      userType,
    }: User = req.body;

    const emailFormResult = EmailValidator.validate(email);

    if (!emailFormResult) {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "Invalid email format",
      });
      return;
    }

    let emailAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    //Check if user already exists
    if (emailAlreadyExists) {
      return res
        .status(400)
        .json({ status: "error", code: "400", message: "User already exists" });
    }

    //Create verification token
    token = generateToken().toString();

    //Assign firstName to email variable
    emailFirstName = firstName;

    //Verification time span
    const time = new Date(Date.now() + 1 * 60 * 60 * 1000);

    //Hash password and create new user
    const newVendor = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        brandName,
        brandType,
        streetAddress,
        city,
        zipCode,
        taxID,
        password: hashSync(password!, 10),
        verificationToken: token,
        verificationTokenExpiresAt: time,
        userType,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        brandName: true,
        brandType: true,
        streetAddress: true,
        city: true,
        zipCode: true,
        taxID: true,
        userType: true,
      },
    });

    await sendVerificationEmail(email, emailFirstName, token).catch(
      (err: any) => {
        console.error("Register user send verification email:", err.message);
      }
    );

    res.status(201).json({
      status: "success",
      code: "201",
      message:
        "You have successfully registered. Please check your email for verification.",
      data: newVendor,
    });
    return;
  } catch (error: any) {
    console.error("Register user:", error.message);

    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error",
    });
    return;
  }
};

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    let usertype = req.body["userType"];

    //check user type
    if (usertype != "ADMIN") {
      console.error("RegisterAdmin Controller: Invalid user type");
      res.status(400).json({
        status: "error",
        code: "400",
        message: "Invalid user type",
      });
      return;
    }

    //validate customer details
    let result = validateAdminDetails(req.body);

    if (result == "rejected") {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "All fields are required",
      });
      return;
    }

    const { email, firstName, lastName, password, userType }: User = req.body;

    const emailFormResult = EmailValidator.validate(email);

    if (!emailFormResult) {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "Invalid email format",
      });
      return;
    }

    let emailAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    //Check if user already exists
    if (emailAlreadyExists) {
      return res
        .status(400)
        .json({ status: "error", code: "400", message: "User already exists" });
    }

    //Create verification token
    token = generateToken().toString();

    //Assign firstName to email variable
    emailFirstName = firstName;

    //Verification time span
    const time = new Date(Date.now() + 1 * 60 * 60 * 1000);

    //Hash password and create new user
    const newAdmin = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashSync(password!, 10),
        isVerified: "true",
        verificationToken: token,
        verificationTokenExpiresAt: time,
        userType,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userType: true,
        isVerified: true,
      },
    });

    ////
    //skip send verification email for admins
    ////

    res.status(201).json({
      status: "success",
      code: "201",
      message: "You have successfully registered and been verified.",
      data: newAdmin,
    });
    return;
  } catch (error: any) {
    console.error("RegisterAdmin Controller:", error.message);

    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error",
    });
    return;
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { id, verifyToken } = req.body;

    const verifyUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        verificationToken: true,
        verificationTokenExpiresAt: true,
      },
    });

    let dateNow = new Date(Date.now());
    let date = new Date(dateNow + " UTC");
    let tokenDate = new Date(verifyUser?.verificationTokenExpiresAt + " UTC");

    //check for token expiration
    if (tokenDate > date) {
      if (verifyToken == verifyUser?.verificationToken) {
        //update isVerified to "true"
        await prisma.user.update({
          where: {
            id: Number(id),
          },
          data: {
            isVerified: "true",
          },
        });

        res.status(200).json({
          status: "success",
          code: "200",
          message: "Email verification successful",
        });
        return;
      }
      res.status(400).json({
        status: "error",
        code: "400",
        message: "Invalid input. Please check and try again.",
      });
      return;
    }
    res.status(400).json({
      status: "error",
      code: "400",
      message:
        "The token has expired. Please press the 'Resend' button below the page to resend a new token to your email. Thank you.",
    });
    return;
  } catch (error: any) {
    console.error("Verify email:", error.message);
    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error",
    });
    return;
  }
};

export const resendEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const resendUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        email: true,
        firstName: true,
      },
    });

    //Create verification token
    token = generateToken().toString();

    //Verification time span
    const time = new Date(Date.now() + 1 * 60 * 60 * 1000);

    //Assign firstName to email variable
    emailFirstName = resendUser?.firstName!;

    const updateUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        verificationToken: token,
        verificationTokenExpiresAt: time,
      },
    });

    let result = await sendVerificationEmail(
      resendUser?.email!,
      resendUser?.firstName!,
      token
    ).catch((err: any) => {
      console.error(err);
    });

    res.status(200).json({
      status: "success",
      code: "200",
      message: "Please check your email for verification.",
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error",
    });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user?.isVerified! === "true") {
      //decrypt password
      const result = compareSync(password, user?.password!);

      if (result) {
        const accessToken = createJWT({
          userID: `${user?.id}`,
          role: `${user?.userType}`,
        });

        const date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
        const expiryDate = new Date(date + " UTC");

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          expires: expiryDate,
          sameSite: "lax",
          secure: NODE_ENV === "production",
        });

        const userData = await prisma.user.findUnique({
          where: {
            email: email,
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            username: true,
            registerType: true,
            userType: true,
            phoneNumber: true,
          },
        });

        res.status(201).json({
          status: "success",
          code: "201",
          message: "user logged in",
          data: userData,
        });

        return;
      }

      res.status(400).json({
        status: "error",
        code: "400",
        message: "Invalid email or password.",
      });

      return;
    }
    //Create verification token
    token = generateToken().toString();

    //Verification time span
    const time = new Date(Date.now() + 1 * 60 * 60 * 1000);

    //Assign firstName to email variable
    emailFirstName = user?.firstName!;

    const updateUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        verificationToken: token,
        verificationTokenExpiresAt: time,
      },
    });

    let result = await sendVerificationEmail(
      user?.email!,
      user?.firstName!,
      token
    ).catch((err: any) => {
      console.error(err);
    });
  } catch (error: any) {
    console.error("Login user:", error);
    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error",
    });
    return;
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res
    .status(200)
    .json({ status: "success", code: "200", message: "user logged out!" });
};

// google login callback
export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as {
    firstName: string;
    lastName: string;
    email: string;
    registerType: string;
    socialId: string;
    registrationDate: Date;
    isVerified: string;
  };
  if (!user) {
    return res.status(400).json({
      status: "error",
      code: "400",
      message: "Google login failed",
    });
  }
  try {
    const token = generateAuthJWT(user);
    const date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const expiryDate = new Date(date + " UTC");
    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: expiryDate,
      secure: environment === "production",
      sameSite: "lax",
    });
    return res.status(200).json({
      status: "success",
      code: "200",
      message: "google login successful",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        registerType: user.registerType,
        socialId: user.socialId,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    next();
  }
};

//Facebook
export const facebookCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as {
    firstName: string;
    lastName: string;
    email: string;
    registerType: string;
    socialId: string;
    registrationDate: Date;
    isVerified: string;
  };
  if (!user) {
    return res.status(400).json({
      status: "error",
      code: "400",
      message: "Facebook login failed",
    });
  }
  try {
    const token = generateAuthJWT(user);
    const date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const expiryDate = new Date(date + " UTC");
    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: expiryDate,
      secure: environment === "production",
      sameSite: "lax",
    });
    return res.status(200).json({
      status: "success",
      code: "200",
      message: "Facebook login successful",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        registerType: user.registerType,
        socialId: user.socialId,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    next();
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate the email address
    const emailFormResult = EmailValidator.validate(email);

    if (!emailFormResult) {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "Please provide a valid email address.",
      });
      return;
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(404).json({
        status: "error",
        code: "404",
        message: "User with this email does not exist.",
      });
      return;
    }

    // Generate a reset token
    const resetToken = generateToken().toString();

    // Set token expiration time (e.g., 1 hour)
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

    // Update the user with the reset token and expiration time
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        resetToken: resetToken,
        resetTokenExpiresAt: resetTokenExpiresAt,
      },
    });

    const resetLink: string = `http://localhost:5000/api/v1/auth/verify-reset?resetToken=${resetToken}&email=${email}`;

    // Send the password reset email using Nodemailer
    await sendResetVerificationEmail(email, user.firstName, resetLink).catch(
      (err: any) => {
        console.error(err);
      }
    );

    res.status(200).json({
      status: "success",
      code: "200",
      message: "Reset password verification email sent successfully.",
    });
  } catch (error: any) {
    console.log("Request Password Reset:", error.message);
  }
};

export const verifyPasswordReset = async (req: Request, res: Response) => {
  try {
    const email = req.query["email"] as string;
    const resetToken = req.query["resetToken"] as string;

    //extract user details from database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        resetTokenExpiresAt: true,
        resetToken: true,
      },
    });

    let dateNow = new Date(Date.now());
    let date = new Date(dateNow + " UTC");
    let tokenDate = new Date(user?.resetTokenExpiresAt + " UTC");

    //check for token expiration
    if (tokenDate > date) {
      if (resetToken == user?.resetToken) {
        res.status(200).json({
          status: "success",
          code: "200",
          message:
            "Password reset verification successful. Remember to redirect user to frontend url",
        });
        return;
      }
      res.status(500).json({
        status: "error",
        code: "500",
        message: "Internal server error.",
      });
      return;
    }
    res
      .status(400)
      .send(
        "The link has expired. Please go back to your dashboard to request a new password reset in order to generate a new link!!!"
      );
    return;
  } catch (error: any) {
    console.log(error.message);

    res
      .status(500)
      .json({ status: "error", code: "500", message: "Internal server error" });
    return;
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body["email"] as string;

    // Validate the email address
    const emailFormResult = EmailValidator.validate(email);

    if (!emailFormResult) {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "Please provide a valid email address.",
      });
      return;
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      res.status(404).json({
        status: "error",
        code: "404",
        message: "User with this email does not exist.",
      });
      return;
    }

    // Generate a reset token
    const resetToken = generateToken().toString();

    // Set token expiration time (e.g., 1 hour)
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

    // Update the user with the reset token and expiration time
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        resetToken: resetToken,
        resetTokenExpiresAt: resetTokenExpiresAt,
      },
    });

    // Send the password reset email using Nodemailer
    await sendForgotPasswordEmail(email, user.firstName, resetToken).catch(
      (err: any) => {
        console.error("Send Forgot Password Email:", err.message);
      }
    );

    res.status(200).json({
      status: "success",
      code: "200",
      message: "Forgot password verification email sent successfully.",
    });
  } catch (error: any) {
    console.log("Forgot password:", error.message);
  }
};

export const verifyForgotPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body["email"] as string;
    const token = req.body["resetToken"] as string;

    //extract user details from database
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        resetTokenExpiresAt: true,
        resetToken: true,
      },
    });

    let dateNow = new Date(Date.now());
    let date = new Date(dateNow + " UTC");
    let tokenDate = new Date(user?.resetTokenExpiresAt + " UTC");

    //check for token expiration
    if (tokenDate > date) {
      if (token == user?.resetToken) {
        res.status(200).json({
          status: "success",
          code: "200",
          message: "Forgot password reset verification successful",
        });
        return;
      }
      res.status(400).json({
        status: "error",
        code: "400",
        message: "Invalid token provided. Please check and try again",
      });
      return;
    }
    res.status(400).send("The token has expired.");
    return;
  } catch (error: any) {
    console.log("verifyForgotPassword:", error.message);
    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error.",
    });
    return;
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const email = req.body["email"] as string;
    const newPassword = req.body["newPassword"] as string;
    const confirmNewPassword = req.body["confirmNewPassword"] as string;

    // Validate that the new password and confirm new password match
    const check = checkNewPasswordMatch({ newPassword, confirmNewPassword });

    if (!check) {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "Passwords do not match",
      });
      return;
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: "404",
        message: "User with this email does not exist.",
      });
    }

    // Hash the new password
    const hashedPassword = hashSync(newPassword, 10);

    // Update the user's password
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Respond with success message
    res.status(200).json({
      status: "success",
      code: "200",
      message: "Password reset successful.",
    });
  } catch (error: any) {
    console.error("Error during password reset:", error.message);
    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error.",
    });
    return;
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { email, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    // Check if all fields are provided
    if (!email || !currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        status: "error",
        code: "400",
        message:
          "All fields are required: email, currentPassword, newPassword, confirmNewPassword.",
      });
    }

    // Validate that the new password and confirm new password match
    const passwordMatch = checkNewPasswordMatch({
      newPassword,
      confirmNewPassword,
    });

    if (!passwordMatch) {
      return res.status(400).json({
        status: "error",
        code: "400",
        message: "New passwords do not match.",
      });
    }

    // Fetch the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        code: "404",
        message: "User not found.",
      });
    }

    // Check if the current password matches the stored password
    const isPasswordValid = compareSync(currentPassword, user.password!);

    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        code: "400",
        message: "Current password is incorrect.",
      });
    }

    // Hash the new password
    const hashedPassword = hashSync(newPassword, 10);

    // Update the user's password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      status: "success",
      code: "200",
      message: "Password changed successfully.",
    });
  } catch (error: any) {
    console.error("Change Password:", error.message);
    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error.",
    });
  }
};
