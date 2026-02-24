import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const TaxResponseSchema = z.object({
  composite_tax_rate: z.number(),
  breakdown: z.object({
    state_rate: z.number(),
    county_rate: z.number(),
    city_rate: z.number(),
    special_rates: z.number(),
  }),
  jurisdictions: z.array(z.string()),
});

export type TaxResult = z.infer<typeof TaxResponseSchema>;


export interface CalculatedTax {
  composite_tax_rate: number;
  tax_amount: number;
  total_amount: number;
  breakdown: TaxResult['breakdown'];
  jurisdictions: string[];
}

export class TaxService {
  static async getTaxData(lat: number, lon: number, subtotal: number): Promise<CalculatedTax> {
    try {
      const response = await openai.chat.completions.parse({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a NYS Tax Jurisdiction expert. Identify jurisdictions for Lat ${lat}, Lon ${lon}.
            Rules for 2026:
            - NY State: 4.0%
            - MCTD: 0.375% if in NYC, Nassau, Suffolk, Westchester, Rockland, Putnam, Orange, or Dutchess.
            - County/City: Varies by precise location.`
          },
          {
            role: "user",
            content: `Determine exact rates for Lat ${lat}, Lon ${lon}.`
          },
        ],
        response_format: zodResponseFormat(TaxResponseSchema, "tax_resolution"),
        temperature: 0,
      });

      const parsed = response.choices[0].message.parsed;
      if (!parsed) throw new Error("Invalid LLM response");

      const subtotalInCents = Math.round(subtotal * 100);
      const taxAmountInCents = Math.round(subtotalInCents * parsed.composite_tax_rate);
      const totalAmountInCents = subtotalInCents + taxAmountInCents;

      return {
        composite_tax_rate: parsed.composite_tax_rate,
        tax_amount: taxAmountInCents / 100,
        total_amount: totalAmountInCents / 100,
        breakdown: parsed.breakdown,
        jurisdictions: parsed.jurisdictions,
      };
    } catch (error) {
      console.error("TaxService Error:", error);
      throw error;
    }
  }
}