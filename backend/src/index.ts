import express from 'express';
import orderRoutes from './routes/order_routes';

const app = express();

app.use(express.json());

app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});