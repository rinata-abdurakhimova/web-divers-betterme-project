import pool from '../config/db';

export interface OrderData {
  id?: number | string;
  latitude: number;
  longitude: number;
  subtotal: number;
  timestamp?: Date;
  
  composite_tax_rate: number;
  tax_amount: number;
  total_amount: number;
  breakdown: any;
  jurisdictions: string[];
  
  created_at?: Date | string;
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
      data.latitude, 
      data.longitude, 
      data.subtotal, 
      data.timestamp || new Date(), 
      data.composite_tax_rate, 
      data.tax_amount, 
      data.total_amount,
      JSON.stringify(data.breakdown), 
      JSON.stringify(data.jurisdictions)
    ];

    const res = await pool.query(query, values);
    return res.rows[0];
  }

  static async searchOrders(filters: any) {
    const page = filters.page ? parseInt(filters.page, 10) : 1;
    const limit = filters.limit ? parseInt(filters.limit, 10) : 50;
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