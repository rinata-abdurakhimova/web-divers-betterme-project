import fs from 'fs';
import { getCsvStream, CsvRow } from '../utils/csvParser';
import { OrderRepository, OrderData } from '../repositories/order_repository';
import { TaxService } from './tax_service';

export class OrderService {
  static async createManualOrder(payload: { lat: number; lon: number; subtotal: number; timestamp: string }) {
    const taxCalculation = await TaxService.getTaxData(payload.lat, payload.lon, payload.subtotal);

    const order = await OrderRepository.insertOrder({
      latitude: payload.lat,
      longitude: payload.lon,
      subtotal: payload.subtotal,
      timestamp: new Date(payload.timestamp),
      ...taxCalculation,
    });

    return order;
  }
  static async importOrdersFromCsv(filePath: string): Promise<{ processed: number; errors: number }> {
    const client = await OrderRepository.getTransactionClient();
    const stream = getCsvStream(filePath);
    
    let processedCount = 0;
    let errorCount = 0;
    const BATCH_SIZE = 15; 
    let currentBatch: CsvRow[] = [];

    const handleBatchResults = (results: PromiseSettledResult<void>[]) => {
      results.forEach((res) => {
        if (res.status === 'fulfilled') processedCount++;
        else {
          console.error(`Error in row:`, res.reason);
          errorCount++;
        }
      });
    };

    try {
      await client.query('BEGIN');
      for await (const row of stream as any) {
        currentBatch.push(row as CsvRow);

        if (currentBatch.length === BATCH_SIZE) {
          const results = await Promise.allSettled(
            currentBatch.map(item => this.processSingleRow(client, item))
          );
          handleBatchResults(results);
          currentBatch = []; 
          if (processedCount % 100 === 0) console.log(`Processed ${processedCount} rows...`);
        }
      }

      if (currentBatch.length > 0) {
        const finalResults = await Promise.allSettled(
          currentBatch.map(item => this.processSingleRow(client, item))
        );
        handleBatchResults(finalResults);
      }

      await client.query('COMMIT');
      return { processed: processedCount, errors: errorCount };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Production practice: clean up temp files
    }
  }

  private static async processSingleRow(client: any, csvRow: CsvRow) {
    const lat = parseFloat(csvRow.latitude);
    const lon = parseFloat(csvRow.longitude);
    const subtotal = parseFloat(csvRow.subtotal);

    const taxData = await TaxService.getTaxData(lat, lon, subtotal);

    await OrderRepository.insertOrderWithClient(client, {
      id: parseInt(csvRow.id),
      latitude: lat,
      longitude: lon,
      subtotal: subtotal,
      timestamp: new Date(csvRow.timestamp),
      ...taxData
    });
  }

  static async getOrders(filters: any) {
    return await OrderRepository.searchOrders(filters);
  }
}