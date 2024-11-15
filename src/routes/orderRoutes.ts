//import express from 'express';
import {Router}  from 'express';

import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controller/orderController.ts';

const router = Router();

router.get('/', getAllOrders); // Get all orders
router.post('/', createOrder); // Create a new order
router.get('/:orderId', getOrderById); // Get an order by ID
router.put('/:orderId', updateOrder); // Update an order by ID
router.delete('/:orderId', deleteOrder); // Delete an order by ID

export default router;
