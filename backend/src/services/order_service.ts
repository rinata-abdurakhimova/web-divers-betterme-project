import fs from 'fs';
import path from 'path';
import { getCsvStream, CsvRow } from '../utils/csvParser';
import { OrderRepository, OrderData } from '../repositories/order_repository';
import { TaxService, CalculatedTax } from './tax_service';

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
    const BATCH_SIZE = 12; 
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
      console.log('Starting batch import with caching...');

      for await (const row of stream as any) {
        currentBatch.push(row as CsvRow);

        if (currentBatch.length === BATCH_SIZE) {
          for (const item of currentBatch) {
      try {
        await this.processSingleRow(client, item);
        processedCount++;
      } catch (rowError) {
        console.error(`Error in row:`, rowError);
        errorCount++;
      }
    }
    currentBatch = []; 
    if (processedCount % 100 === 0) console.log(`Processed ${processedCount} rows`);
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
      
      const isMainFile = filePath.includes('BetterMe Test-Input.csv');
      if (fs.existsSync(filePath) && !isMainFile) {
        fs.unlinkSync(filePath);
        console.log(`Temporary upload file cleaned up: ${path.basename(filePath)}`);
      } else {
        console.log(`Main file preserved: ${path.basename(filePath)}`);
      }
    }
  }

  private static async processSingleRow(client: any, csvRow: CsvRow) {
    const lat = parseFloat(csvRow.latitude);
    const lon = parseFloat(csvRow.longitude);
    const subtotal = parseFloat(csvRow.subtotal);

    const existingTax = await OrderRepository.findExistingTaxByLocation(lat, lon);

    let taxData: CalculatedTax;

    if (!existingTax) {
      taxData = await TaxService.getTaxData(lat, lon, subtotal);
    } else {
      const subtotalInCents = Math.round(subtotal * 100);
      const taxAmountInCents = Math.round(subtotalInCents * existingTax.composite_tax_rate);
      
      taxData = {
        ...existingTax,
        tax_amount: taxAmountInCents / 100,
        total_amount: (subtotalInCents + taxAmountInCents) / 100
      };
    }

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