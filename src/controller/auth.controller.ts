import bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import prisma from '../../db/prisma';
import generateToken from '../util/generateToken';
import { Prisma } from '@prisma/client';

export const register = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      phoneNumber,
    } = req.body;

    //validate user input
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await prisma.user.findUnique({ where: { email, username } });
    // check if user already exists
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // hash password before saving to database
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // generate verification token

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); // Generates a 6-digit random number

    // save user to database
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        verificationToken,
        verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    if (newUser) {
      // generate token
      generateToken(newUser.id.toString(), res);
      res.status(201).json({
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data: User not created' });
    }
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Unique constraint failed
        return res.status(400).json({ message: 'Username already exists' });
      }
    }
    console.log('Error in the Register controller', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }
    //check if the user exists in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // check if password is correct
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // generate token
    generateToken(user.id.toString(), res);

    // return user data
    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error: any) {
    console.log('Error in the Login controller', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const forgotPassword = async (req: Request, res: Response) => {};
export const resetPassword = async (req: Request, res: Response) => {};
export const verifyEmail = async (req: Request, res: Response) => {};
