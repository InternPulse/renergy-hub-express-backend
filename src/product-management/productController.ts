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
