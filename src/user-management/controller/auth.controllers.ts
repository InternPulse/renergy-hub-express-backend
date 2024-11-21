import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { validateUserDetails } from "../../util/validateUserDetails";
import { checkPasswordMatch } from "../../util/checkPasswordMatch";
import { generateToken } from "../../util/generateToken";
import { compareSync, hashSync } from "bcryptjs";
import sendVerificationEmail from "../../util/sendVerificationEmail";
import * as EmailValidator from "email-validator";
import { createJWT } from "../../util/createJWT";
import { NODE_ENV } from "../../util/secrets";
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

let token: string;
let emailFirstName: string;

export const registerUser = async (req: Request, res: Response) => {
  try {
    //Validate user details
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
    const check = checkPasswordMatch(req.body);

    if (!check) {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "Passwords do not match",
      });
      return;
    }

    const {
      email,
      firstName,
      lastName,
      username,
      password,
      registerType,
      userType,
      phoneNumber,
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

    let userNameAlreadyExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    //Check if user already exists
    if (emailAlreadyExists || userNameAlreadyExists) {
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
        username,
        password: hashSync(password, 10),
        verificationToken: token,
        verificationTokenExpiresAt: time,
        registerType,
        userType,
        phoneNumber,
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

    await sendVerificationEmail(email, emailFirstName, token).catch(
      (err: any) => {
        console.error(err);
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
    console.error("Error during registration:", error.message, error.stack);
    res.status(500).json({
        status: "error",
        code: "500",
        message: "Internal server error",
    });
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
    console.error(error.message);
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
  }
};

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const user = await prisma.user.findUnique({
//       where: {
//         email: email,
//       },
//     });

//     if (user?.isVerified! === "true") {
//       //decrypt password
//       const result = compareSync(password, user?.password!);

//       if (result) {
//         const accessToken = createJWT({
//           userID: `${user?.id}`,
//           role: `${user?.userType}`,
//         });

//         const date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
//         const expiryDate = new Date(date + " UTC");

//         res.cookie("accessToken", accessToken, {
//           httpOnly: true,
//           expires: expiryDate,
//           sameSite: "lax",
//           secure: NODE_ENV === "production",
//         });

//         res
//           .status(201)
//           .json({ status: "success", code: "201", message: "user logged in" });

//         return;
//       }
//     }
//     //Create verification token
//     token = generateToken().toString();

//     //Verification time span
//     const time = new Date(Date.now() + 1 * 60 * 60 * 1000);

//     //Assign firstName to email variable
//     emailFirstName = user?.firstName!;

//     const updateUser = await prisma.user.update({
//       where: {
//         email: email,
//       },
//       data: {
//         verificationToken: token,
//         verificationTokenExpiresAt: time,
//       },
//     });

//     let result = await sendVerificationEmail(
//       user?.email!,
//       user?.firstName!,
//       token
//     ).catch((err: any) => {
//       console.error(err);
//     });
//   } catch (error: any) {
//     console.error(error.message);
//   }
// };



export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: '404',
        message: 'User with this email does not exist.',
      });
    }

    // Check if user is verified
    if (user.isVerified === 'true') {
      // Verify password
      const isPasswordCorrect = compareSync(password, user.password);

      if (isPasswordCorrect) {
        // Create JWT token
        const accessToken = createJWT({
          userID: `${user.id}`,
          role: `${user.userType}`,
        });

        // Set cookie expiration date (e.g., 14 days)
        const expiryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        // Set the cookie for the user session
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          expires: expiryDate,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production', // Ensure secure flag in production
        });

        return res.status(200).json({
          status: 'success',
          code: '200',
          message: 'User logged in successfully.',
        });
      } else {
        return res.status(400).json({
          status: 'error',
          code: '400',
          message: 'Incorrect password.',
        });
      }
    }

    // If user is not verified, send a verification email
    const token = generateToken().toString(); // Generate a verification token
    const verificationExpiryTime = new Date(Date.now() + 1 * 60 * 60 * 1000); // Token expiry time (1 hour)

    // Update the user with verification token and expiration time
    await prisma.user.update({
      where: { email: email },
      data: {
        verificationToken: token,
        verificationTokenExpiresAt: verificationExpiryTime,
      },
    });

    // Send verification email
    await sendVerificationEmail(user.email, user.firstName, token);

    return res.status(400).json({
      status: 'error',
      code: '400',
      message:
        'Your email is not verified. A verification email has been sent to you.',
    });
  } catch (error: any) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      status: 'error',
      code: '500',
      message: 'Internal server error.',
    });
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


// Function to validate email format using a regular expression
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

     // Validate the email address
     if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        code: '400',
        message: 'Please provide a valid email address.',
      });
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

    // Generate a reset token
    const resetToken = generateToken().toString();

    // Set token expiration time (e.g., 1 hour)
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

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
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASSWORD, 
      },
    });

    const resetLink = `http://yourapp.com/reset-password?token=${resetToken}`; // Replace with your app's actual URL

    const mailOptions = {
      from: '"Renergy Hub" <oghenetegaokotie@gmail.com>', // Sender's email
      to: user.email, // Receiver's email
      subject: 'Password Reset Request', // Email subject
      text: `Hello, \n\nWe received a request to reset your password. Please click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request a password reset, please ignore this email.`, // Plain text body
      html: `<p>Hello,</p><p>We received a request to reset your password. Please click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you did not request a password reset, please ignore this email.</p>`, // HTML body
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return success response
    res.status(200).json({
      status: "success",
      code: "200",
      message: "Password reset email sent successfully.",
    });
  } catch (error) {
    console.error("Error during password reset request:", error);
    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error.",
    });
  }
};




export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;

    // Validate that the new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        status: 'error',
        code: '400',
        message: 'Passwords do not match.',
      });
    }

    // Regular expression for password validation
    // Must contain at least:
    // 1. One lowercase letter
    // 2. One uppercase letter
    // 3. One digit
    // 4. One special character
    // 5. Minimum length of 8 characters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Check if the new password matches the regex
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        status: 'error',
        code: '400',
        message: 'Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one digit, and one special character.',
      });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        code: '404',
        message: 'User with this email does not exist.',
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
      status: 'success',
      code: '200',
      message: 'Password reset successful.',
    });
  } catch (error: any) {
    console.error('Error during password reset:', error.message);
    res.status(500).json({
      status: 'error',
      code: '500',
      message: 'Internal server error.',
    });
  }
};

