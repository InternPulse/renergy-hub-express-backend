import prisma from "../../util/lib/client";
import { Review } from "../../util/types/review.types";

export class ReviewRepository {
  // Create a new review
  async create(review: Omit<Review, "id" | "datePosted">): Promise<Review> {
    return prisma.review.create({
      data: {
        ...review,
        comment: review.comment ?? "",
        datePosted: new Date(),
      },
    });
  }

  async findById(id: number): Promise<Review | null> {
    return prisma.review.findUnique({
      where: { id },
    });
  }

  async findAll(productId: number): Promise<Review[]> {
    return prisma.review.findMany({
      where: { productId },
    });
  }
  // Update a review
  async update(review: Review): Promise<Review> {
    return prisma.review.update({
      where: { id: review.id },
      data: review,
    });
  }
}
