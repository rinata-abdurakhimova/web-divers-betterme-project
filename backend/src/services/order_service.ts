import fs from 'fs';
import path from 'path';
import { getCsvStream } from '../utils/csvParser';
import { OrderRepository, OrderData } from '../repositories/order_repository';
import { TaxService } from './tax_service';

export class OrderService {
  static async createManualOrder(payload: { lat: number; lon: number; subtotal: number; timestamp: string }) {
    const taxCalculation = TaxService.getTaxData(payload.lat, payload.lon, payload.subtotal);
    
    const order = await OrderRepository.insertOrder({
      latitude: payload.lat,
      longitude: payload.lon,
      subtotal: payload.subtotal,
      timestamp: new Date(payload.timestamp),
      ...taxCalculation,
    });
    
    return order;
  }

  static async importOrdersFromCsv(filePath: string): Promise<{ processed: number; errors: number; executionTime: string }> {
    const startTime = Date.now(); 

    const client = await OrderRepository.getTransactionClient();
    const stream = getCsvStream(filePath);
    
    let processedCount = 0;
    let currentBatch: OrderData[] = [];
    const BATCH_SIZE = 1000; 

    try {
      await client.query('BEGIN');
      console.log('Starting BLAZING FAST offline bulk import...');

      for await (const row of stream as any) {
        const lat = parseFloat(row.latitude);
        const lon = parseFloat(row.longitude);
        const subtotal = parseFloat(row.subtotal);

        const taxData = TaxService.getTaxData(lat, lon, subtotal);

        currentBatch.push({
          id: parseInt(row.id),
          latitude: lat,
          longitude: lon,
          subtotal: subtotal,
          timestamp: new Date(row.timestamp),
          ...taxData
        });

        if (currentBatch.length === BATCH_SIZE) {
          await OrderRepository.bulkInsertOrders(client, currentBatch);
          processedCount += currentBatch.length;
          console.log(`Bulk inserted ${processedCount} rows...`);
          currentBatch = []; 
        }
      }

      if (currentBatch.length > 0) {
        await OrderRepository.bulkInsertOrders(client, currentBatch);
        processedCount += currentBatch.length;
      }

      await client.query('COMMIT');
      
      const endTime = Date.now();
      const durationSeconds = ((endTime - startTime) / 1000).toFixed(2);

      console.log(`FINISHED! Processed all ${processedCount} rows in ${durationSeconds} seconds!`);
      
      return { processed: processedCount, errors: 0, executionTime: `${durationSeconds}s` };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Import error:', error);
      throw error;
    } finally {
      client.release();
      const isMainFile = filePath.includes('BetterMe Test-Input.csv');
      if (fs.existsSync(filePath) && !isMainFile) {
        fs.unlinkSync(filePath);
      }
    }
  }

  static async getOrders(filters: any) {
    return await OrderRepository.searchOrders(filters);
  }
}