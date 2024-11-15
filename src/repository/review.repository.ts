import prisma from "../util/db";
import { Review } from "../types/review.types";

export class ReviewRepository {
  // Create a new review
  async create(review: Omit<Review, "id" | "datePosted">): Promise<Review> {
    return prisma.review.create({
      data: {
        ...review,
        datePosted: new Date(),
      },
    });
  }

  // Find a review by ID
  async findById(id: number): Promise<Review | null> {
    return prisma.review.findUnique({
      where: { id },
    });
  }
  // Get all reviews
  async findAll(): Promise<Review[]> {
    return prisma.review.findMany();
  }
  // Update a review
  async update(review: Review): Promise<Review> {
    return prisma.review.update({
      where: { id: review.id },
      data: review,
    });
  }
}
