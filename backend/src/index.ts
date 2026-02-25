import express from 'express';
import dotenv from 'dotenv';
import orderRoutes from './routes/order_routes';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/', orderRoutes);

app.listen(PORT, () => {
  console.log(`PostgreSQL connected. OpenAI Tax Resolution active.`);
});