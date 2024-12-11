import { Request, Response} from "express";
import { validateCategory, sendErrorResponse, validateProduct } from "../util/helpers";
import prisma from "../util/db";

export const AddNewProduct  = async (req: Request, res: Response)=>{
  // const user = req.user as {
  //   userID: any,
  //   role: string
  // }

  if(!req.file){
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Product image required"
    })
  }
  const { categoryId, userId, name, description, price, stock } = req.body;
  if(!categoryId || !name || !description || !price || !stock){
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "All fields are required"
    })
  }

  const existingProductCategory = await prisma.category.findUnique({
    where: {
      id: parseInt(categoryId) // Ensure the ID is parsed as an integer
    }
  });
  
  if (!existingProductCategory) {
    return res.status(404).json({
      status: "error",
      code: 404,
      message: "Invalid product category",
    });
  }
 
  try{
    const imageURL = (req.file as any).path;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price),
        stock: parseInt(stock),
        image: imageURL,
        category: {
          connect: {
            id: parseInt(categoryId)
          }
        },
        user: {
          connect: {
            // id: parseInt(user.userID)
            id: parseInt(userId)
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
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error"
    }) 
  }
};

export const UpdateProduct  = async (req: Request, res: Response)=>{
  const user = req.user as {
    userID: any,
    role: string
  }
  const { id } = req.params;

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: parseInt(id) // Ensure the ID is parsed as an integer
    }
  });
  
  if (!existingProduct) {
    return res.status(404).json({
      status: "error",
      code: 404,
      message: "Product not found",
    });
  }

  if(!req.file){
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Product image required"
    })
  }
 
  const { categoryId, name, description, price, stock } = req.body;
  if(!categoryId || !name || !description || !price || !stock){
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "All fields are required"
    })
  }

  const existingProductCategory = await prisma.category.findUnique({
    where: {
      id: parseInt(categoryId) // Ensure the ID is parsed as an integer
    }
  });
  
  if (!existingProductCategory) {
    return res.status(404).json({
      status: "error",
      code: 404,
      message: "Invalid product category",
    });
  }
  try{
    const imageURL = (req.file as any).path;
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseInt(price),
        stock: parseInt(stock),
        image: imageURL,
        category: {
          connect: {
            id: parseInt(categoryId)
          }
        },
        user: {
          connect: {
            id: parseInt(user.userID)
          }
        }
      }
    });
    return res.status(200).json({
      status: "success",
      code: 200,
      data: product
    })
  }
  catch(err: any){
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal server error"
    }) 
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

export const getAllProductCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    if(!categories){
      return res.status(404).json({
        status: "error",
        message: "No categories found"
      });
    }
    return res.status(200).json({
      status: "success",
      code: 200,
      data: categories
    });
  } catch (err: any) {
    sendErrorResponse(err, res);
  }
};

export const deleteProductCategory = async (req: Request, res: Response)=>{
  const { id } = req.params; // Get the product ID from the route parameters

  try {
    const existingProductCategory = await prisma.Category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProductCategory) {
      return res.status(404).json({
        status: "error",
        code: 404,
        message: "Category not found",
      });
    }

    await prisma.product.deleteMany({
      where: {
        categoryId: parseInt(id),
      },
    });
    
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Product category deleted successfully",
    });
  } catch (err: any) {
    console.log(err)
    return res.status(500).json({
      status: "error",
      code: 500,
      message: "internal server error"
    })
  }

}

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true, // Include category details
        user: {
          select: {
            firstName: true,
            lastName: true,
            brandName: true,
            brandType: true,
            phoneNumber: true,
            streetAddress: true,
            city: true,
            zipCode: true,
            imageURL: true
            // Exclude 'content' by not selecting it
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      code: 200,
      data: products,
    });
  } catch (err: any) {
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
        user: {
          select: {
            firstName: true,
            lastName: true,
            brandName: true,
            brandType: true,
            phoneNumber: true,
            streetAddress: true,
            city: true,
            zipCode: true,
            imageURL: true
            // Exclude 'content' by not selecting it
          },
        },
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
    sendErrorResponse(err, res);
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params; // Get the product ID from the route parameters

  try {
    // Check if the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
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
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Product deleted successfully",
    });
  } catch (err: any) {
    sendErrorResponse(err, res);
  }
};