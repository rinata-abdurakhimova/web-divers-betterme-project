import pool from '../config/db';
import { CalculatedTax } from '../services/tax_service';
import { PoolClient } from 'pg';

export interface OrderData extends CalculatedTax {
  id?: number;
  latitude: number;
  longitude: number;
  subtotal: number;
  timestamp: Date;
}

export class OrderRepository {
  static async insertOrder(data: OrderData) {
    const query = `
      INSERT INTO orders (
        latitude, longitude, subtotal, timestamp,
        composite_tax_rate, tax_amount, total_amount, 
        breakdown, jurisdictions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;

    const values = [
      data.latitude, data.longitude, data.subtotal, data.timestamp,
      data.composite_tax_rate, data.tax_amount, data.total_amount,
      data.breakdown, 
      data.jurisdictions
    ];

    const res = await pool.query(query, values);
    return res.rows[0];
  }

  static async insertOrderWithClient(client: PoolClient, data: OrderData) {
    const query = `
      INSERT INTO orders (
        id, latitude, longitude, subtotal, timestamp,
        composite_tax_rate, tax_amount, total_amount, 
        breakdown, jurisdictions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO NOTHING;
    `;

    const values = [
      data.id, data.latitude, data.longitude, data.subtotal, data.timestamp,
      data.composite_tax_rate, data.tax_amount, data.total_amount,
      data.breakdown,
      data.jurisdictions
    ];

    await client.query(query, values);
  }

  static async getTransactionClient(): Promise<PoolClient> {
    const client = await pool.connect();
    return client;
  }

  static async searchOrders(filters: {
    page: number;
    limit: number;
    startDate?: string;
    endDate?: string;
    minTax?: number;
    maxTax?: number;
  }) {
    const offset = (filters.page - 1) * filters.limit;
    let query = `SELECT * FROM orders WHERE 1=1`;
    const values: any[] = [];
    let paramIndex = 1;

    if (filters.startDate) {
      query += ` AND timestamp >= $${paramIndex++}`;
      values.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ` AND timestamp <= $${paramIndex++}`;
      values.push(filters.endDate);
    }
    if (filters.minTax !== undefined) {
      query += ` AND tax_amount >= $${paramIndex++}`;
      values.push(filters.minTax);
    }
    if (filters.maxTax !== undefined) {
      query += ` AND tax_amount <= $${paramIndex++}`;
      values.push(filters.maxTax);
    }

    query += ` ORDER BY timestamp DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    values.push(filters.limit, offset);

    const res = await pool.query(query, values);
    return res.rows;
  }
}