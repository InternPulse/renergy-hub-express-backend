import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client";
import { validateUserDetails } from "../../util/validateUserDetails";
import { checkPasswordMatch } from "../../util/checkPasswordMatch";
import { generateToken } from "../../util/generateToken";
import { compareSync, hashSync } from "bcryptjs";
import sendVerificationEmail from "../../util/sendVerificationEmail";
import * as EmailValidator from "email-validator";
import { createJWT } from "../../util/createJWT";
import { NODE_ENV } from "../../util/secrets";
import { environment } from '../../util/secrets'
import { generateAuthJWT } from '../../util/authJWT';

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

        res
          .status(201)
          .json({ status: "success", code: "201", message: "user logged in" });

        return;
      }
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
    console.error(error.message);
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
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as { 
    firstName: string, 
    lastName: string, 
    email: string, 
    registerType: string,
    socialId: string,
    registrationDate: Date,
    isVerified: string
  };
  if(!user){
    return res.status(400).json({
      status: "error",
      code: "400",
      message: "Google login failed",
    });
  }
  try{
      const token = generateAuthJWT(user);
      const date = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      const expiryDate = new Date(date + " UTC");
      res.cookie("accessToken", token, {
        httpOnly: true, 
        expires: expiryDate, 
        secure: environment === "production",
        sameSite: "lax"
      });
      return res.status(200).json({
        status: "success",
        code: "200",
        message: "google login successful",
        data:{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          registerType: user.registerType,
          socialId: user.socialId,
          isVerified: user.isVerified
        }
      });
  }
  catch(err){
    next()
  }
};

//Facebook
export const facebookCallback = (req: Request, res: Response, next: NextFunction)=>{
  const user = req.user as { 
    firstName: string, 
    lastName: string, 
    email: string, 
    registerType: string,
    socialId: string,
    registrationDate: Date,
    isVerified: string
  };
  if(!user){
    return res.status(400).json({
      success: false,
      message: "Facebook login failed",
    });
  }
  try{
      const token = generateAuthJWT(user);
      res.cookie("accessToken", token, {
        httpOnly: true, 
        maxAge: 3600000, 
        secure: environment === "production",
        sameSite: "lax"
      });
      return res.status(200).json({
        status: "success",
        code: "200",
        message: "Facebook login successful",
        data:{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          registerType: user.registerType,
          socialId: user.socialId,
          isVerified: user.isVerified
        }
      });
  }
  catch(err){
    next();
  }
}
