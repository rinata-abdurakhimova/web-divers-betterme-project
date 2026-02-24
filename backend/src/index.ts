import express from 'express';
import dotenv from 'dotenv';
import orderRoutes from './routes/order_routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', orderRoutes);

app.listen(PORT, () => {
  console.log(`PostgreSQL connected. OpenAI Tax Resolution active.`);
});