import CustomHttpError from "../../util/custom.error";
import prisma from "../../util/db";
import UserRepository from "../user.repository";
import { CreateShippingOptionDto, validateCreateShippingOption } from "./shipping.option.dto";
import ShippingOptionRepository from "./shipping.option.repository";

const shippingOptionRepository = new ShippingOptionRepository();
const userRepository = new UserRepository();

export const getAll= async () => {
  return shippingOptionRepository.findAll()
};

export const getShippingOptionById = async (id: number) => {
  const shippingOption = prisma.shippingOption.findUnique({
    where: { id }
  });

  if (!shippingOption)
    throw new CustomHttpError(404, "Shipping Option Not found")

  return shippingOption;
};


export const createShippingOption= async (data: CreateShippingOptionDto) => {


  const { error } = validateCreateShippingOption(data);

  if(error)
    throw new CustomHttpError(400, `Invalid Request: ${error}`);


  const shippingOption = shippingOptionRepository.create(data)

  return shippingOption;
};

export const updateShippingOption = async (id: number, data: any) => {
  return prisma.shippingOption.update({
    where: { id },
    data,
  });
};

export const deleteShippingOption = async (id: number) => {
  return prisma.shippingOption.delete({
    where: { id }
  });
};