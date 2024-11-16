import express from 'express';
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserOrders,
} from '../controller/user.controller';

const router = express.Router();

// User Management Routes
router.get('/', getAllUsers); // GET /api/v1/users
router.post('/', createUser); // POST /api/v1/users
router.get('/:userId', getUserById); // GET /api/v1/users/{userId}
router.put('/:userId', updateUserById); // PUT /api/v1/users/{userId}
router.delete('/:userId', deleteUserById); // DELETE /api/v1/users/{userId}
router.get('/:userId/orders', getUserOrders); // GET /api/v1/users/{userId}/orders

export default router;
