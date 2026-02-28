import { Router } from 'express';
import cors from 'cors'; 
import multer from 'multer';
import { OrderController } from '../controllers/order_controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const corsOptions = { origin: '*' };

router.post('/import', cors(corsOptions), upload.single('file'), OrderController.importOrders);
router.post('/', cors(corsOptions), OrderController.createOrder);
router.get('/', cors(corsOptions), OrderController.getOrders);

export default router;