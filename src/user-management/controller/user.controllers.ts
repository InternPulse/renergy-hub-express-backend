import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({});

    res.status(200).json({
      status: "success",
      code: "200",
      message: "Users retrieved successfully",
      data: users.map((user) => {
        return {
          ...user,
          password: null,
          verificationToken: null,
          verificationTokenExpiresAt: null,
          resetToken: null,
          resetTokenExpiresAt: null,
        };
      }),
    });
  } catch (error: any) {
    console.error("Get all users:", error.message);

    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error",
    });
    return;
  }
};

export const getUserByID = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!user) {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "User does not exist.",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      code: "200",
      message: "User retrieved successfully",
      data: {
        ...user,
        password: null,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });
    return;
  } catch (error: any) {
    console.error("Get User By ID:", error.message);

    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error",
    });
    return;
  }
};

export const deleteUserByID = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(200).json({
      status: "success",
      code: "200",
      message: "User deleted successfully",
      data: {
        ...user,
        password: null,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });
    return;
  } catch (error: any) {
    console.error("Get User By ID:", error.message);

    res.status(400).json({
      status: "error",
      code: "400",
      message: "No record or user found.",
    });
    return;
  }
};

export const updateUserByID = async (req: Request, res: Response) => {
  try {
    const userExist = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!userExist) {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "User does not exist.",
      });
      return;
    }

    //validate input
    const { firstName, lastName, registerType, phoneNumber } = req.body;

    if (!firstName || !lastName || !registerType || !phoneNumber) {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "All fields are required.",
      });
      return;
    }

    const user = await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: req.body,
    });

    res.status(200).json({
      status: "success",
      code: "200",
      message: "User updated successfully",
      data: {
        ...user,
        password: null,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });
    return;
  } catch (error: any) {
    console.error("Update User By ID:", error.message);

    res.status(500).json({
      status: "error",
      code: "500",
      message: "Internal server error.",
    });
    return;
  }
};
