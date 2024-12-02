import CustomHttpError from "../../util/custom.error";
import prisma from "../../util/db";
import UserRepository from "../user.repository";
import { CreateShippingAddressDto, validateCreateShippingAddress } from "./shipping.address.dto";
import ShippingRepository from "./shipping.repository";

const shippingAddressRepository = new ShippingRepository();
const userRepository = new UserRepository();

export const getAllUserAddress= async (userId: number) => {
  return shippingAddressRepository.findByUserId(userId)
};

export const getShippingAddressById = async (id: number) => {
  const shippingAddress = prisma.shippingAddress.findUnique({
    where: { id }
  });

  if (!shippingAddress)
    throw new CustomHttpError(404, "Shipping Address Not found")

  return shippingAddress;
};


export const createShippingAddress= async (data: CreateShippingAddressDto) => {


  const { error } = validateCreateShippingAddress(data);

  if(error)
    throw new CustomHttpError(400, `Invalid Request: ${error}`);


  const order = shippingAddressRepository.create(data)

  return order;
};

export const updateShippingAddress = async (id: number, data: any) => {
  return prisma.shippingAddress.update({
    where: { id },
    data,
  });
};

export const deleteShippingAddress = async (id: number) => {
  return prisma.shippingAddress.delete({
    where: { id }
  });
};