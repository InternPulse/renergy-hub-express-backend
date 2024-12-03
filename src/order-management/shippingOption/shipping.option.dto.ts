import Joi from "joi";

export interface CreateShippingOptionDto {
  name?: string;
  amount?: number;
}



export function validateCreateShippingOption(shippingOption: CreateShippingOptionDto)
  {
    const JoiSchema = Joi.object({
      
        name: Joi.string().required(),  
        amount: Joi.number().required(),
        
    }).options({ abortEarly: false });
  
    return JoiSchema.validate(shippingOption)
}