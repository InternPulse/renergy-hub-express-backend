import { Request, Response } from "express";
import prisma from "../util/db";
import { sendErrorResponse } from "../util/helpers";

// Validation helper
const validateProductInformation = async (data: any) => {
  const errors: string[] = [];

  // Name validations
  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("Name is required and must be a non-empty string.");
  } else {
    if (data.name.length < 3 || data.name.length > 50) {
      errors.push("Name must be between 3 and 50 characters long.");
    }
    const nameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!nameRegex.test(data.name)) {
      errors.push("Name can only contain letters, numbers, and spaces.");
    }
  }

  // Value validations
  if (!data.value || typeof data.value !== "string" || data.value.trim() === "") {
    errors.push("Value is required and must be a non-empty string.");
  } else {
    if (data.value.length > 255) {
      errors.push("Value must not exceed 255 characters.");
    }
  }

  // ProductId validations
  if (!data.productId || typeof data.productId !== "number" || data.productId <= 0) {
    errors.push("ProductId is required and must be a valid positive number.");
  }

  // Optional: Check uniqueness (requires async query)
  if (data.name && data.productId) {
    const existingInfo = await prisma.productInformation.findFirst({
      where: { name: data.name, productId: data.productId },
    });
    if (existingInfo) {
      errors.push("A ProductInformation with this name already exists for the product.");
    }
  }

  return errors;
};

export const createProductInformation = async (req: Request, res: Response) => {
  const requestBody = req.body;

  try {
    // Validate the request body
    const validationErrors = await validateProductInformation(requestBody); // Add `await` here
    if (validationErrors.length > 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Validation failed.",
        errors: validationErrors,
      });
    }

    // Extract fields after validation
    const { name, value, productId } = requestBody;

    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Product not found.",
      });
    }

    // Create ProductInformation entry
    const productInformation = await prisma.productInformation.create({
      data: {
        name,
        value,
        product: {
          connect: { id: productId },
        },
      },
    });

    // Return success response
    return res.status(201).json({
      status: "success",
      code: 201,
      message: "Product information added successfully.",
      data: productInformation,
    });
  } catch (err: any) {
    console.error(err.message);
    sendErrorResponse(err, res);
  }
};



export const getAllProductInformation = async (req: Request, res: Response) => {
  try {
    // Fetch all ProductInformation along with the associated Product details
    const productInformationList = await prisma.productInformation.findMany({
      include: {
        product: true, // Include related Product details
      },
    });

    // Return success response
    return res.status(200).json({
      status: "success",
      code: 200,
      data: productInformationList,
    });
  } catch (err: any) {
    console.error(err.message);
    sendErrorResponse(err, res);
  }
};



export const getProductInformation = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Validate the ID parameter
    const productInformationId = parseInt(id, 10);
    if (isNaN(productInformationId) || productInformationId <= 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Invalid ProductInformation ID.",
      });
    }

    // Fetch the ProductInformation with the associated Product details
    const productInformation = await prisma.productInformation.findUnique({
      where: { id: productInformationId },
      include: {
        product: true, // Include related Product details
      },
    });

    // Handle not found case
    if (!productInformation) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "ProductInformation not found.",
      });
    }

    // Return success response
    return res.status(200).json({
      status: "success",
      code: 200,
      data: productInformation,
    });
  } catch (err: any) {
    console.error(err.message);
    sendErrorResponse(err, res);
  }
};





// Validation helper for update
const validateProductInformationUpdate = (data: any) => {
  const errors: string[] = [];

  // Name validation
  if (data.name && (typeof data.name !== "string" || data.name.trim() === "")) {
    errors.push("Name must be a non-empty string if provided.");
  } else if (data.name && (data.name.length < 3 || data.name.length > 50)) {
    errors.push("Name must be between 3 and 50 characters long.");
  }

  // Value validation
  if (data.value && (typeof data.value !== "string" || data.value.trim() === "")) {
    errors.push("Value must be a non-empty string if provided.");
  } else if (data.value && data.value.length > 255) {
    errors.push("Value must not exceed 255 characters.");
  }

  return errors;
};

export const updateProductInformation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, value } = req.body;  // Extract name and value explicitly

  try {
    // Validate ID
    const productInformationId = parseInt(id, 10);
    if (isNaN(productInformationId) || productInformationId <= 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Invalid ProductInformation ID.",
      });
    }

    // Validate the provided fields
    const validationErrors = validateProductInformationUpdate({ name, value });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Validation failed.",
        errors: validationErrors,
      });
    }

    // Check if the ProductInformation exists
    const existingProductInformation = await prisma.productInformation.findUnique({
      where: { id: productInformationId },
    });

    if (!existingProductInformation) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "ProductInformation not found.",
      });
    }

    // Prepare the data to update, only if the fields are provided
    const updateData: any = {};
    if (name) updateData.name = name;
    if (value) updateData.value = value;

    // Update the ProductInformation
    const updatedProductInformation = await prisma.productInformation.update({
      where: { id: productInformationId },
      data: updateData, // Update only provided fields
    });

    // Return success response
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Product information updated successfully.",
      data: updatedProductInformation,
    });
  } catch (err: any) {
    console.error(err.message);
    sendErrorResponse(err, res);
  }
};





export const deleteProductInformation = async (req: Request, res: Response) => {
  const { id } = req.params;  // Get the ID from URL params

  try {
    // Validate ID
    const productInformationId = parseInt(id, 10);
    if (isNaN(productInformationId) || productInformationId <= 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Invalid ProductInformation ID.",
      });
    }

    // Check if the ProductInformation exists
    const existingProductInformation = await prisma.productInformation.findUnique({
      where: { id: productInformationId },
    });

    if (!existingProductInformation) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "ProductInformation not found.",
      });
    }

    // Delete the ProductInformation
    await prisma.productInformation.delete({
      where: { id: productInformationId },
    });

    // Return success response
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Product information deleted successfully.",
    });
  } catch (err: any) {
    console.error(err.message);
    sendErrorResponse(err, res);
  }
};

