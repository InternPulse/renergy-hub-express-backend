import { randomInt } from "crypto";

export const validateCategory = (requestBody: any)=>{
  const expectedProperties = ["categoryName", "description"];
  if(expectedProperties.some((prop) => !(prop in requestBody))){
    throw Error("missing field");
  }
}

export const validateProduct = (requestBody: any)=>{
  const expectedProperties = ["categoryId", "userId", "name", "description", "price", "stock", "image"];
  if(expectedProperties.some((prop) => !(prop in requestBody))){
    throw Error("missing field");
  }
}

export const sendErrorResponse = (err: any, res: any)=>{
  if(err.message === "missing field"){
    return res.status(400).json({
      status: "error",
      code: "400",
      message: "All fields are required"
    })
  }
};

export const GenerateOrderNumber = (): string => {
  const randomNum = randomInt(10000000000, 99999999999); // Generate a random 11-digit number
  return randomNum.toString();
}