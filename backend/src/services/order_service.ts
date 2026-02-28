import { OrderRepository, OrderData } from '../repositories/order_repository';
import { TaxService } from './tax_service';

export class OrderService {

  private static isValidUSALocation(lat: number, lon: number): boolean {
    const isContinental = lat >= 24.396 && lat <= 49.384 && lon >= -125.000 && lon <= -66.934;
    const isAlaska = lat >= 51.209 && lat <= 71.502 && lon <= -129.979;
    const isHawaii = lat >= 18.910 && lat <= 22.235 && lon >= -160.247 && lon <= -154.806;
    
    return isContinental || isAlaska || isHawaii;
  }
  static async createOrder(latitude: number, longitude: number, subtotal: number) {
    if (!this.isValidUSALocation(latitude, longitude)) {
      throw new Error('Coordinates must be within the United States.');
    }

    const taxData = TaxService.getTaxData(latitude, longitude, subtotal);

    const orderData: OrderData = {
      latitude,
      longitude,
      subtotal,
      composite_tax_rate: taxData.composite_tax_rate,
      tax_amount: taxData.tax_amount,
      total_amount: taxData.total_amount,
      breakdown: taxData.breakdown,
      jurisdictions: taxData.jurisdictions,
      timestamp: new Date()
    };

    return await OrderRepository.insertOrder(orderData);
  }

  static async getOrders(filters: any) {
    return await OrderRepository.searchOrders(filters);
  }

  static async importCSV(csvText: string) {
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const startIndex = lines[0].toLowerCase().includes('lat') ? 1 : 0;
    
    const ordersToInsert: OrderData[] = [];

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(/[;,]/);
      if (parts.length >= 3) {
        const latitude = parseFloat(parts[0]);
        const longitude = parseFloat(parts[1]);
        const subtotal = parseFloat(parts[2]);

        if (!isNaN(latitude) && !isNaN(longitude) && !isNaN(subtotal) && this.isValidUSALocation(latitude, longitude)) {
          try {
            const taxData = TaxService.getTaxData(latitude, longitude, subtotal);
            ordersToInsert.push({
              latitude,
              longitude,
              subtotal,
              composite_tax_rate: taxData.composite_tax_rate,
              tax_amount: taxData.tax_amount,
              total_amount: taxData.total_amount,
              breakdown: taxData.breakdown,
              jurisdictions: taxData.jurisdictions,
              timestamp: new Date()
            });
          } catch (e) {
            console.log("Failed row:", i, latitude, longitude, subtotal);
          }
        }
      }
    }

    if (ordersToInsert.length > 0) {
      await OrderRepository.bulkInsertOrders(ordersToInsert);
    }
    
    return { inserted: ordersToInsert.length };
  }
}