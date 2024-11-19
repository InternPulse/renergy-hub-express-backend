import { Request, Response } from "express";
import prisma from "../../util/db";
import { validateUserDetails } from "../../util/validateUserDetails";
import { checkPasswordMatch } from "../../util/checkPasswordMatch";

export const registerUser = async (req: Request, res: Response) => {
  try {
    let result = validateUserDetails(req.body);

    if (result == "rejected") {
      res.status(400).json({
        status: "error",
        code: "400",
        message: "All fields are required",
      });
    }

    const check = checkPasswordMatch(req.body);

    res.status(200).json(req.body);
  } catch (error: any) {
    console.log(error.message);
  }
};
