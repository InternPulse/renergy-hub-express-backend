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
// Get all users (Admin only)
// export const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;

//     // If getting own profile, use the authenticated user's ID
//     const targetUserId =
//       userId === 'profile' ? (req.user as any).id : parseInt(userId);

//     // Validate targetUserId
//     if (isNaN(targetUserId)) {
//       return res.status(400).json({ message: 'Invalid user ID' });
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: targetUserId },
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         username: true,
//         email: true,
//         phoneNumber: true,
//         userType: true,
//         registerType: true,
//         registrationDate: true,
//         addresses: true,
//         orders: {
//           take: 5,
//           orderBy: { id: 'desc' },
//         },
//         _count: {
//           select: {
//             orders: true,
//             products: true,
//             reviews: true,
//           },
//         },
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     console.error('Error in getAllUsers:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json({
      status: true,
      message: 'Users retrieved successfully',
      users,
    });
  } catch (error: any) {
    console.error('Error in getAllUsers:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId =
      req.params.userId === 'profile'
        ? (req.user as any).id
        : parseInt(req.params.userId);

    // Validate targetUserId
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      status: true,
      message: 'User retrieved successfully',
      user,
    });
  } catch (error: any) {
    console.error('Error in getUserById:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Update a user by ID
export const updateUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const { firstName, lastName, phoneNumber } = req.body;

    // If updating own profile, use the authenticated user's ID
    const targetUserId =
      req.params.userId === 'profile' ? (req.user as any).id : userId;

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        firstName,
        lastName,
        phoneNumber,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        phoneNumber: true,
        userType: true,
        registerType: true,
        registrationDate: true,
      },
    });

    return res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a user by ID
export const deleteUserById = async (req: Request, res: Response) => {};

// Get all orders for a user
export const getUserOrders = async (req: Request, res: Response) => {};
