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
  private static isWithin(lat: number, lon: number, bounds: { minLat: number, maxLat: number, minLon: number, maxLon: number }): boolean {
    return lat >= bounds.minLat && lat <= bounds.maxLat && lon >= bounds.minLon && lon <= bounds.maxLon;
  }

  public static getTaxData(latitude: number, longitude: number, subtotal: number): CalculatedTax {
    let breakdown = { state_rate: 0, county_rate: 0, city_rate: 0, special_rates: 0 };
    let jurisdictions = ['Out of Nexus / No Tax'];

    if (this.isWithin(latitude, longitude, { minLat: 40.47, maxLat: 45.01, minLon: -79.76, maxLon: -71.85 })) {
      if (this.isWithin(latitude, longitude, { minLat: 40.47, maxLat: 40.91, minLon: -74.25, maxLon: -73.70 })) {
        breakdown = { state_rate: 0.0400, county_rate: 0.0000, city_rate: 0.0450, special_rates: 0.00375 };
        jurisdictions = ['New York State', 'New York City', 'MCTD'];
      } else {
        breakdown = { state_rate: 0.0400, county_rate: 0.0400, city_rate: 0.0000, special_rates: 0.0000 };
        jurisdictions = ['New York State', 'Local County'];
      }
    }
    else if (this.isWithin(latitude, longitude, { minLat: 32.53, maxLat: 42.00, minLon: -124.40, maxLon: -114.13 })) {
      if (this.isWithin(latitude, longitude, { minLat: 33.70, maxLat: 34.33, minLon: -118.66, maxLon: -118.15 })) {
        breakdown = { state_rate: 0.0725, county_rate: 0.0100, city_rate: 0.0125, special_rates: 0.0000 };
        jurisdictions = ['California State', 'Los Angeles County', 'Los Angeles City'];
      } else {
        breakdown = { state_rate: 0.0725, county_rate: 0.0100, city_rate: 0.0000, special_rates: 0.0000 };
        jurisdictions = ['California State', 'Local District'];
      }
    }
    else if (this.isWithin(latitude, longitude, { minLat: 25.83, maxLat: 36.50, minLon: -106.64, maxLon: -93.50 })) {
      if (this.isWithin(latitude, longitude, { minLat: 30.09, maxLat: 30.51, minLon: -97.93, maxLon: -97.56 })) {
        breakdown = { state_rate: 0.0625, county_rate: 0.0000, city_rate: 0.0100, special_rates: 0.0100 };
        jurisdictions = ['Texas State', 'Austin City', 'Capital Metro Transit'];
      } else {
        breakdown = { state_rate: 0.0625, county_rate: 0.0150, city_rate: 0.0000, special_rates: 0.0000 };
        jurisdictions = ['Texas State', 'Local County'];
      }
    }
    else if (this.isWithin(latitude, longitude, { minLat: 24.39, maxLat: 31.00, minLon: -87.63, maxLon: -79.97 })) {
      if (this.isWithin(latitude, longitude, { minLat: 25.70, maxLat: 25.85, minLon: -80.35, maxLon: -80.14 })) {
        breakdown = { state_rate: 0.0600, county_rate: 0.0100, city_rate: 0.0000, special_rates: 0.0000 };
        jurisdictions = ['Florida State', 'Miami-Dade County'];
      } else {
        breakdown = { state_rate: 0.0600, county_rate: 0.0100, city_rate: 0.0000, special_rates: 0.0000 };
        jurisdictions = ['Florida State', 'Local County'];
      }
    }
    else if (this.isWithin(latitude, longitude, { minLat: 30.20, maxLat: 35.00, minLon: -88.50, maxLon: -84.90 })) {
      breakdown = { state_rate: 0.0400, county_rate: 0.0200, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Alabama State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 51.20, maxLat: 71.50, minLon: -180.00, maxLon: -129.90 })) {
      breakdown = { state_rate: 0.0000, county_rate: 0.0176, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Alaska State', 'Local Borough'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 31.30, maxLat: 37.00, minLon: -114.80, maxLon: -109.00 })) {
      breakdown = { state_rate: 0.0560, county_rate: 0.0280, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Arizona State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 33.00, maxLat: 36.50, minLon: -94.60, maxLon: -89.60 })) {
      breakdown = { state_rate: 0.0650, county_rate: 0.0200, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Arkansas State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 37.00, maxLat: 41.00, minLon: -109.00, maxLon: -102.00 })) {
      breakdown = { state_rate: 0.0290, county_rate: 0.0480, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Colorado State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 40.90, maxLat: 42.10, minLon: -73.70, maxLon: -71.70 })) {
      breakdown = { state_rate: 0.0635, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Connecticut State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 38.40, maxLat: 39.80, minLon: -75.80, maxLon: -75.00 })) {
      breakdown = { state_rate: 0.0000, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Delaware State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 30.30, maxLat: 35.00, minLon: -85.60, maxLon: -80.80 })) {
      breakdown = { state_rate: 0.0400, county_rate: 0.0330, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Georgia State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 18.90, maxLat: 22.20, minLon: -160.20, maxLon: -154.80 })) {
      breakdown = { state_rate: 0.0400, county_rate: 0.0050, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Hawaii State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 42.00, maxLat: 49.00, minLon: -117.20, maxLon: -111.00 })) {
      breakdown = { state_rate: 0.0600, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Idaho State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 36.90, maxLat: 42.50, minLon: -91.50, maxLon: -87.00 })) {
      breakdown = { state_rate: 0.0625, county_rate: 0.0250, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Illinois State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 37.70, maxLat: 41.80, minLon: -88.10, maxLon: -84.70 })) {
      breakdown = { state_rate: 0.0700, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Indiana State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 40.30, maxLat: 43.50, minLon: -96.60, maxLon: -89.90 })) {
      breakdown = { state_rate: 0.0600, county_rate: 0.0090, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Iowa State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 36.90, maxLat: 40.00, minLon: -102.00, maxLon: -94.50 })) {
      breakdown = { state_rate: 0.0650, county_rate: 0.0220, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Kansas State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 36.40, maxLat: 39.10, minLon: -89.50, maxLon: -81.90 })) {
      breakdown = { state_rate: 0.0600, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Kentucky State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 28.90, maxLat: 33.00, minLon: -94.00, maxLon: -88.80 })) {
      breakdown = { state_rate: 0.0445, county_rate: 0.0510, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Louisiana State', 'Local Parish'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 43.00, maxLat: 47.40, minLon: -71.10, maxLon: -66.90 })) {
      breakdown = { state_rate: 0.0550, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Maine State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 37.80, maxLat: 39.70, minLon: -79.50, maxLon: -75.00 })) {
      breakdown = { state_rate: 0.0600, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Maryland State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 41.20, maxLat: 42.90, minLon: -73.50, maxLon: -69.90 })) {
      breakdown = { state_rate: 0.0625, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Massachusetts State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 41.60, maxLat: 48.30, minLon: -90.40, maxLon: -82.40 })) {
      breakdown = { state_rate: 0.0600, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Michigan State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 43.40, maxLat: 49.40, minLon: -97.20, maxLon: -89.40 })) {
      breakdown = { state_rate: 0.06875, county_rate: 0.0060, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Minnesota State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 30.10, maxLat: 35.00, minLon: -91.60, maxLon: -88.00 })) {
      breakdown = { state_rate: 0.0700, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Mississippi State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 35.90, maxLat: 40.60, minLon: -95.80, maxLon: -89.00 })) {
      breakdown = { state_rate: 0.04225, county_rate: 0.0400, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Missouri State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 44.30, maxLat: 49.00, minLon: -116.00, maxLon: -104.00 })) {
      breakdown = { state_rate: 0.0000, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Montana State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 39.90, maxLat: 43.00, minLon: -104.00, maxLon: -95.30 })) {
      breakdown = { state_rate: 0.0550, county_rate: 0.0150, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Nebraska State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 35.00, maxLat: 42.00, minLon: -120.00, maxLon: -114.00 })) {
      breakdown = { state_rate: 0.0685, county_rate: 0.0130, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Nevada State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 42.60, maxLat: 45.30, minLon: -72.60, maxLon: -70.60 })) {
      breakdown = { state_rate: 0.0000, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['New Hampshire State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 38.90, maxLat: 41.30, minLon: -75.60, maxLon: -73.80 })) {
      breakdown = { state_rate: 0.06625, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['New Jersey State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 31.30, maxLat: 37.00, minLon: -109.00, maxLon: -103.00 })) {
      breakdown = { state_rate: 0.05125, county_rate: 0.0270, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['New Mexico State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 33.80, maxLat: 36.60, minLon: -84.30, maxLon: -75.40 })) {
      breakdown = { state_rate: 0.0475, county_rate: 0.0225, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['North Carolina State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 45.90, maxLat: 49.00, minLon: -104.00, maxLon: -96.50 })) {
      breakdown = { state_rate: 0.0500, county_rate: 0.0190, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['North Dakota State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 38.40, maxLat: 42.00, minLon: -84.80, maxLon: -80.50 })) {
      breakdown = { state_rate: 0.0575, county_rate: 0.0150, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Ohio State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 33.60, maxLat: 37.00, minLon: -103.00, maxLon: -94.40 })) {
      breakdown = { state_rate: 0.0450, county_rate: 0.0450, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Oklahoma State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 41.90, maxLat: 46.30, minLon: -124.60, maxLon: -116.40 })) {
      breakdown = { state_rate: 0.0000, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Oregon State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 39.70, maxLat: 42.30, minLon: -80.50, maxLon: -74.60 })) {
      breakdown = { state_rate: 0.0600, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Pennsylvania State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 41.10, maxLat: 42.00, minLon: -71.90, maxLon: -71.10 })) {
      breakdown = { state_rate: 0.0700, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Rhode Island State'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 32.00, maxLat: 35.20, minLon: -83.30, maxLon: -78.50 })) {
      breakdown = { state_rate: 0.0600, county_rate: 0.0140, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['South Carolina State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 42.40, maxLat: 45.90, minLon: -104.00, maxLon: -96.40 })) {
      breakdown = { state_rate: 0.0450, county_rate: 0.0190, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['South Dakota State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 34.90, maxLat: 36.70, minLon: -90.30, maxLon: -81.60 })) {
      breakdown = { state_rate: 0.0700, county_rate: 0.0250, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Tennessee State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 36.90, maxLat: 42.00, minLon: -114.00, maxLon: -109.00 })) {
      breakdown = { state_rate: 0.0610, county_rate: 0.0110, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Utah State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 42.70, maxLat: 45.00, minLon: -73.40, maxLon: -71.40 })) {
      breakdown = { state_rate: 0.0600, county_rate: 0.0020, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Vermont State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 36.50, maxLat: 39.50, minLon: -83.70, maxLon: -75.20 })) {
      breakdown = { state_rate: 0.0530, county_rate: 0.0040, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Virginia State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 45.50, maxLat: 49.00, minLon: -124.80, maxLon: -116.90 })) {
      breakdown = { state_rate: 0.0650, county_rate: 0.0270, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Washington State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 37.20, maxLat: 40.60, minLon: -82.60, maxLon: -77.70 })) {
      breakdown = { state_rate: 0.0600, county_rate: 0.0050, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['West Virginia State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 42.40, maxLat: 47.10, minLon: -92.90, maxLon: -86.70 })) {
      breakdown = { state_rate: 0.0500, county_rate: 0.0040, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Wisconsin State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 40.90, maxLat: 45.00, minLon: -111.10, maxLon: -104.00 })) {
      breakdown = { state_rate: 0.0400, county_rate: 0.0130, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Wyoming State', 'Local County'];
    }
    else if (this.isWithin(latitude, longitude, { minLat: 38.80, maxLat: 38.99, minLon: -77.12, maxLon: -76.90 })) {
      breakdown = { state_rate: 0.0600, county_rate: 0.0000, city_rate: 0.0000, special_rates: 0.0000 };
      jurisdictions = ['Washington D.C.'];
    }

    const compositeRate = breakdown.state_rate + breakdown.county_rate + breakdown.city_rate + breakdown.special_rates;
    
    const taxAmount = Number((subtotal * compositeRate).toFixed(4));
    const totalAmount = subtotal;

    return {
      composite_tax_rate: Number(compositeRate.toFixed(4)),
      tax_amount: taxAmount,
      total_amount: totalAmount,
      breakdown,
      jurisdictions
    };
  }
}