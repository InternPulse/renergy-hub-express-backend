import Joi from "joi";

export interface CreateWishlistDto {
    productId: number;
    userId: number;
}


export function validateCreateWishlist(wishlist: CreateWishlistDto)
  {
    const JoiSchema = Joi.object({
      
        userId: Joi.number().required(),     
        productId: Joi.number().required(),              
        
    }).options({ abortEarly: false });
  
    return JoiSchema.validate(wishlist)
}