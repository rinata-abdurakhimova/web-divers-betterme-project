import { Request, Response } from 'express';
import { OrderService } from '../services/order_service';
import { z } from 'zod';

const CreateOrderSchema = z.object({
  lat: z.number().min(-90, "Широта має бути від -90 до 90").max(90),
  lon: z.number().min(-180, "Довгота має бути від -180 до 180").max(180),
  subtotal: z.number().positive("Сума має бути більшою за 0"),
  timestamp: z.string().datetime().optional().default(() => new Date().toISOString()),
});

export class OrderController {
  static async createManualOrder(req: Request, res: Response) {
    try {
      const validatedData = CreateOrderSchema.parse(req.body);
      const order = await OrderService.createManualOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.reduce((acc: any, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {});
        return res.status(400).json({ errors: formattedErrors });
      }

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Unknown error occurred" });
    }
  }

  static async importOrders(req: Request, res: Response) {
    if (!req.file) return res.status(400).json({ error: 'No CSV file uploaded' });

    try {
      const result = await OrderService.importOrdersFromCsv(req.file.path);
      res.status(200).json({ message: 'Import completed', ...result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getOrders(req: Request, res: Response) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

      const filters = {
        page,
        limit,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        minTax: req.query.minTax ? parseFloat(req.query.minTax as string) : undefined,
        maxTax: req.query.maxTax ? parseFloat(req.query.maxTax as string) : undefined,
      };

      const { data, meta } = await OrderService.getOrders(filters);

      res.status(200).json({
        data,
        meta: {
          current_page: meta.page,
          limit: meta.limit,
          total_records: meta.total_records,
          total_pages: meta.total_pages
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}