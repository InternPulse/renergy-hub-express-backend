import Joi, { func } from "joi";
export interface CreateReviewDTO {
  productId: number;
  rating: number;
  comment: string;
  datePosted: string
}
export interface UpdateReviewDTO {
  rating?: number;
  comment?: string;
}


export function validateCreateReview(review: CreateReviewDTO){
    const JoiSchema = Joi.object({
        productId: Joi.number().required(),
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
        datePosted: Joi.date().default(Date.now)
    }).options({ abortEarly: false });

    return JoiSchema.validate(review);
}

export function validateUpdateReview(review: UpdateReviewDTO) {
    const JoiSchema = Joi.object({
        rating: Joi.number().min(1).max(5),
        comment: Joi.string()
    }).options({ abortEarly: false });

    return JoiSchema.validate(review);
}