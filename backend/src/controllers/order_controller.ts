import { Request, Response } from 'express';
import { OrderService } from '../services/order_service';

const isValidUSALocation = (lat: number, lon: number): boolean => {
  const isContinental = lat >= 24.396 && lat <= 49.384 && lon >= -125.000 && lon <= -66.934;
  const isAlaska = lat >= 51.209 && lat <= 71.502 && lon <= -129.979;
  const isHawaii = lat >= 18.910 && lat <= 22.235 && lon >= -160.247 && lon <= -154.806;

  return isContinental || isAlaska || isHawaii;
};

export class OrderController {
  static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { lat, lon, subtotal } = req.body;

      if (lat === undefined || lon === undefined || subtotal === undefined) {
        res.status(400).json({ error: 'Missing required fields: lat, lon, subtotal' });
        return;
      }

      const numLat = Number(lat);
      const numLon = Number(lon);

      if (!isValidUSALocation(numLat, numLon)) {
        res.status(400).json({ error: 'Coordinates must be within the United States.' });
        return;
      }

      const order = await OrderService.createOrder(numLat, numLon, Number(subtotal));
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async importOrders(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const csvData = req.file.buffer.toString('utf-8');
      const result = await OrderService.importCSV(csvData);
      
      res.status(201).json({ message: 'CSV imported successfully', count: result.inserted });
    } catch (error) {
      console.error('CSV Import Error:', error);
      res.status(500).json({ error: 'Internal server error during import' });
    }
  }

  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const filters = { ...req.query, startDate: req.query.from, endDate: req.query.to };
      
      const result = await OrderService.getOrders(filters);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}