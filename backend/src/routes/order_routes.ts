import { Router } from 'express';
import multer from 'multer';
import { OrderController } from '../controllers/order_controller';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/import', upload.single('file'), OrderController.importOrders);
router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);

export default router;