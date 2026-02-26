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
  static getTaxData(lat: number, lon: number, subtotal: number): CalculatedTax {
    const stateRate = 0.04; 
    let countyRate = 0.04;  
    let cityRate = 0.0;
    let specialRates = 0.0;
    const jurisdictions = ["New York State"];

    const isNYC = lat >= 40.47 && lat <= 40.92 && lon >= -74.26 && lon <= -73.70;

    if (isNYC) {
      cityRate = 0.045;
      specialRates = 0.00375; 
      countyRate = 0.0;
      jurisdictions.push("New York City", "MCTD");
    } else {
      jurisdictions.push("Upstate NY County");
    }

    const compositeRate = stateRate + countyRate + cityRate + specialRates;
    
    const subtotalInCents = Math.round(subtotal * 100);
    const taxAmountInCents = Math.round(subtotalInCents * compositeRate);

    return {
      composite_tax_rate: Number(compositeRate.toFixed(5)),
      tax_amount: taxAmountInCents / 100,
      total_amount: (subtotalInCents + taxAmountInCents) / 100,
      breakdown: {
        state_rate: stateRate,
        county_rate: countyRate,
        city_rate: cityRate,
        special_rates: specialRates
      },
      jurisdictions
    };
  }
}