import { Router } from 'express';
import multer from 'multer';
import { OrderController } from '../controllers/order_controller';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/orders', OrderController.createManualOrder);     
router.post('/orders/import', upload.single('file'), OrderController.importOrders); 
router.get('/orders', OrderController.getOrders);         

export default router;