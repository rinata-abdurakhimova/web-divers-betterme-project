import { Request, Response } from 'express';
import { OrderService } from '../services/order_service';

export class OrderController {
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { latitude, longitude, subtotal } = req.body;

      if (latitude === undefined || longitude === undefined || subtotal === undefined) {
        res.status(400).json({ error: 'Missing required fields: latitude, longitude, subtotal' });
        return;
      }

      const order = await OrderService.createOrder(Number(latitude), Number(longitude), Number(subtotal));
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const result = await OrderService.getOrders(filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}