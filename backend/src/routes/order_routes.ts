import { Router } from 'express';
import { OrderController } from '../controllers/order_controller';

const router = Router();

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);

export default router;