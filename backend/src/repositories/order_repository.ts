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
      JSON.stringify(data.breakdown), 
      JSON.stringify(data.jurisdictions)
    ];

    const res = await pool.query(query, values);
    return res.rows[0];
  }

  static async getTransactionClient(): Promise<PoolClient> {
    return await pool.connect(); 
  }

  static async bulkInsertOrders(client: PoolClient, orders: OrderData[]) {
    if (orders.length === 0) return;

    const ids: number[] = [];
    const lats: number[] = [];
    const lons: number[] = [];
    const subtotals: number[] = [];
    const timestamps: Date[] = [];
    const rates: number[] = [];
    const taxAmounts: number[] = [];
    const totalAmounts: number[] = [];
    const breakdowns: string[] = [];
    const jurisdictions: string[] = [];

    for (const order of orders) {
      ids.push(order.id!);
      lats.push(order.latitude);
      lons.push(order.longitude);
      subtotals.push(order.subtotal);
      timestamps.push(order.timestamp);
      rates.push(order.composite_tax_rate);
      taxAmounts.push(order.tax_amount);
      totalAmounts.push(order.total_amount);
      breakdowns.push(JSON.stringify(order.breakdown));
      jurisdictions.push(JSON.stringify(order.jurisdictions));
    }

    const query = `
      INSERT INTO orders (
        id, latitude, longitude, subtotal, timestamp,
        composite_tax_rate, tax_amount, total_amount, breakdown, jurisdictions
      )
      SELECT * FROM UNNEST(
        $1::int[], $2::numeric[], $3::numeric[], $4::numeric[], $5::timestamp[],
        $6::numeric[], $7::numeric[], $8::numeric[], $9::jsonb[], $10::jsonb[]
      )
      ON CONFLICT (id) DO NOTHING;
    `;

    await client.query(query, [
      ids, lats, lons, subtotals, timestamps,
      rates, taxAmounts, totalAmounts, breakdowns, jurisdictions
    ]);
  }

  static async searchOrders(filters: any) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const offset = (page - 1) * limit;

    let dataQuery = `SELECT * FROM orders WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) FROM orders WHERE 1=1`;
    const values: any[] = [];
    let paramIndex = 1;

    if (filters.startDate) {
      dataQuery += ` AND timestamp >= $${paramIndex}`;
      countQuery += ` AND timestamp >= $${paramIndex}`;
      values.push(filters.startDate);
      paramIndex++;
    }
    if (filters.endDate) {
      dataQuery += ` AND timestamp <= $${paramIndex}`;
      countQuery += ` AND timestamp <= $${paramIndex}`;
      values.push(filters.endDate);
      paramIndex++;
    }
    if (filters.minTax !== undefined) {
      dataQuery += ` AND tax_amount >= $${paramIndex}`;
      countQuery += ` AND tax_amount >= $${paramIndex}`;
      values.push(filters.minTax);
      paramIndex++;
    }
    if (filters.maxTax !== undefined) {
      dataQuery += ` AND tax_amount <= $${paramIndex}`;
      countQuery += ` AND tax_amount <= $${paramIndex}`;
      values.push(filters.maxTax);
      paramIndex++;
    }

    dataQuery += ` ORDER BY timestamp DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    const dataValues = [...values, limit, offset];

    const [dataResult, countResult] = await Promise.all([
      pool.query(dataQuery, dataValues),
      pool.query(countQuery, values)
    ]);

    const totalRecords = parseInt(countResult.rows[0].count, 10);

    return {
      data: dataResult.rows,
      meta: {
        page: page,
        limit: limit,
        total_records: totalRecords,
        total_pages: Math.ceil(totalRecords / limit)
      }
    };
  }
}