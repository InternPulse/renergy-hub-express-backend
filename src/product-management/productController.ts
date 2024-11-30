import { Request, Response} from "express";
import { validateCategory, sendErrorResponse, validateProduct } from "../util/helpers";
import prisma from "../util/db";

export const AddNewProduct  = async (req: Request, res: Response)=>{
  const requestBody = req.body
   validateProduct(requestBody);
  const { categoryId, userId, name, description, price, stock, image } = requestBody;
  try{
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        image,
        category: {
          connect: {
            id: categoryId
          }
        },
        user: {
          connect: {
            id: userId
          }
        }
      }
    });
    return res.status(201).json({
      status: "success",
      code: 201,
      data: product
    })
  }
  catch(err: any){
    console.log(err.message)
    sendErrorResponse(err, res);  
  }
};

export const addProductCategory = async (req: Request, res: Response)=>{
  try{
   const requestBody = req.body
   validateCategory(requestBody);
    const { categoryName, description } = requestBody;
    const category = await prisma.category.create({
      data: {
        categoryName,
        description   
      }
    });
    res.status(201).json({
      status: "success",
      code: 201,
      data: category
    })
  }
  catch(err: any){
    sendErrorResponse(err, res);
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true, // Include category details
        user: true, // Include user details
      },
    });

    return res.status(200).json({
      status: "success",
      code: 200,
      data: products,
    });
  } catch (err: any) {
    console.error(err.message);
    sendErrorResponse(err, res);
  }
};



export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params; // Extract product ID from request parameters

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id, 10), // Ensure the ID is parsed as an integer
      },
      include: {
        category: true, // Include related category details
        user: true, // Include related user details
      },
    });

    // If the product is not found, return a 404 response
    if (!product) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Product not found",
      });
    }

    // Return the product details
    return res.status(200).json({
      status: "success",
      code: 200,
      data: product,
    });
  } catch (err: any) {
    console.error(err.message);
    sendErrorResponse(err, res);
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params; // Get the product ID from the route parameters

  try {
    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!existingProduct) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Product not found",
      });
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: parseInt(id, 10) },
    });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Product deleted successfully",
    });
  } catch (err: any) {
    console.error(err.message);
    sendErrorResponse(err, res);
  }
};