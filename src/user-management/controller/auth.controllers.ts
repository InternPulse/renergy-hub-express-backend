import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { validateUserDetails } from "../../util/validateUserDetails";
import { checkPasswordMatch } from "../../util/checkPasswordMatch";
import { generateToken } from "../../util/generateToken";
import { hashSync } from "bcryptjs";
import sendVerificationEmail from "../../util/sendVerificationEmail";
import * as EmailValidator from "email-validator";

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
    console.log(check);

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

    console.log(time + " UTC");
    console.log(new Date(time + " UTC"));

    console.log(token);

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
    console.log(error.message);

    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error",
    });
    return;
  }
};
