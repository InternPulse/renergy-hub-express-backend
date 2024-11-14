import bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import prisma from '../../db/prisma';
import generateToken from '../util/generateToken';

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

    // save user to database
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        phoneNumber,
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
    console.log('Error in the Register controller', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const login = async (req: Request, res: Response) => {};
export const logout = async (req: Request, res: Response) => {};
export const forgotPassword = async (req: Request, res: Response) => {};
export const resetPassword = async (req: Request, res: Response) => {};
export const verifyEmail = async (req: Request, res: Response) => {};
