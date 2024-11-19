import bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import generateToken from '../util/generateToken';
import { Prisma } from '@prisma/client';
import {
  passwordResetEmail,
  verificationEmail,
  welcomeEmail,
} from '../resend/email';
import prisma from '../db/prisma';

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

    // Validate user input
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

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Ensure Prisma Client is available
    if (!prisma) {
      throw new Error('Prisma Client is not initialized');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before saving to database
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Generate verification token
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); // Generates a 6-digit random number

    // Save user to database with verification code and expiration
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

    // Generate token
    generateToken(newUser.id.toString(), res);

    // Send verification email
    await verificationEmail(email, verificationToken);

    // Send response to client
    res.status(201).json({
      success: true,
      message:
        'Registration successful. Please check your email for verification.',
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Unique constraint failed
        return res
          .status(400)
          .json({ message: 'Username or email already exists' });
      }
    }

    console.error('Error in the Register controller:', error);

    if (error.message === 'Cannot fetch data from service') {
      return res.status(503).json({
        message: 'Unable to connect to the database. Please try again later.',
      });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, verificationToken } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (user.verificationToken !== verificationToken) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: null },
    });

    // 4. Send a welcome email after verification
    await welcomeEmail(user.email, user.firstName);
    // 5. Send response to client
    res.status(200).json({
      message: 'Email verified successfully! Welcome email has been sent.',
    });
  } catch (error: any) {
    console.log('Error in the Verify Email controller', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    // Check if the user exists in the database
    console.log('Attempting to find user with email:', email);
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User found:', user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate token with expiration time (e.g., 1 hour)
    generateToken(user.id.toString(), res);

    // Return user data excluding sensitive information
    const { password: _, ...userData } = user;

    res.status(200).json({
      message: 'Login successful',
      user: userData,
    });
  } catch (error: any) {
    console.error('Error in the Login controller', error.message);
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
export const forgotPassword = async (req: Request, res: Response) => {
  // Extract email from request body
  const { email } = req.body;
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate a reset token and expiration date
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random number
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update the user with the reset token and expiration date

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiresAt },
    });

    // Send a reset password email with the reset token link to the user email address (use the PasswordResetEmail function) and return a success response
    passwordResetEmail(user.email, resetToken);
    res.status(200).json({ message: 'Reset password email sent successfully' });
  } catch (error: any) {
    console.error('Error in forgot password controller', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const resetPassword = async (req: Request, res: Response) => {
  // Extract the reset token and new password from the request param and  body
  const { resetToken } = req.params;
  const { newPassword } = req.body;
  // Find the user by reset token and ensure the token is still valid
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken,
        resetTokenExpiresAt: {
          gte: new Date(),
        },
      },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired reset token' });
    }
    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);
    // Update the user with the new password and clear the reset token and expiration date
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });
    // Send a password reset success email to the user email address (use the PasswordResetSuccessEmail function) and return a success response
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error: any) {
    console.error('Error in reset password controller', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
