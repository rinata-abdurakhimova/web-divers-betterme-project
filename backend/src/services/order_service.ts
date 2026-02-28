import { OrderRepository, OrderData } from '../repositories/order_repository';
import { TaxService } from './tax_service';

export class OrderService {
  static async createOrder(latitude: number, longitude: number, subtotal: number) {
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
}