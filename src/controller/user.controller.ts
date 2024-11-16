import { Request, Response } from 'express';
import prisma from '../db/prisma';
import bcryptjs from 'bcryptjs';

// Create a new User
export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phoneNumber, username, password } =
    req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    // Check if user already exists
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password before saving to database
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        username,
      },
    });

    return res.status(201).json({
      status: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        username: newUser.username,
      },
    });
  } catch (error: any) {
    console.error('Error in createUser:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Get all users
export const getAllUsers = async (req: Request, res: Response) => {};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {};

// Update a user by ID
export const updateUserById = async (req: Request, res: Response) => {};

// Delete a user by ID
export const deleteUserById = async (req: Request, res: Response) => {};

// Get all orders for a user
export const getUserOrders = async (req: Request, res: Response) => {};
