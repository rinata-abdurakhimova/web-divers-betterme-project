import express from 'express';
import orderRoutes from './routes/order_routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});