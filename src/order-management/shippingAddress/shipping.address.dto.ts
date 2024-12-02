import Joi from "joi";
import { Decimal } from "@prisma/client/runtime/library";

export interface CreateShippingAddressDto {
  userId?: number;
  state?: string;
  addressLine?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  isDefault?: boolean;
}



export function validateCreateShippingAddress(shippingAddress: CreateShippingAddressDto)
  {
    const JoiSchema = Joi.object({
      
        userId: Joi.number().required(),  
        addressLine: Joi.string().required(),     
        zipCode: Joi.string().allow(null).optional(),
        city: Joi.string().required(), 
        state: Joi.string().required(), 
        country: Joi.string().required(),
        isDefault: Joi.boolean().allow(null).optional()
        
    }).options({ abortEarly: false });
  
    return JoiSchema.validate(shippingAddress)
}