export interface CalculatedTax {
  composite_tax_rate: number;
  tax_amount: number;
  total_amount: number;
  breakdown: {
    state_rate: number;
    county_rate: number;
    city_rate: number;
    special_rates: number;
  };
  jurisdictions: string[];
}

export class TaxService {
  public static getTaxData(latitude: number, longitude: number, subtotal: number): CalculatedTax {
    const isNYCBorough = latitude >= 40.4774 && latitude <= 40.9176 && longitude >= -74.2591 && longitude <= -73.7004;

    let breakdown = { 
      state_rate: 0.0400, 
      county_rate: 0.0400, 
      city_rate: 0.0000, 
      special_rates: 0.0000 
    };
    let jurisdictions = ['New York State', 'Rest of State'];

    if (isNYCBorough) {
      breakdown = { 
        state_rate: 0.0400, 
        county_rate: 0.0000, 
        city_rate: 0.0450, 
        special_rates: 0.00375 
      };
      jurisdictions = ['New York State', 'New York City', 'MCTD'];
    }

    const compositeRate = breakdown.state_rate + breakdown.county_rate + breakdown.city_rate + breakdown.special_rates;
    
    const taxAmount = Number((subtotal * compositeRate).toFixed(4));
    
    const totalAmount = subtotal;

    return {
      composite_tax_rate: compositeRate,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      breakdown,
      jurisdictions
    };
  }
}