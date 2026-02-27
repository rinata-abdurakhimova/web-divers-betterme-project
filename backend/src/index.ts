import express from 'express';
import dotenv from 'dotenv';
import orderRoutes from './routes/order_routes';
import cors from 'cors';

dotenv.config();


const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/', orderRoutes);

app.listen(PORT, () => {
  console.log(`SERVER LISTENING ON ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});