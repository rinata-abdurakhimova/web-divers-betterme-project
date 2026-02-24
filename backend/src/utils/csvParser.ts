import fs from 'fs';
import csv from 'csv-parser';

export interface CsvRow {
  id: string;
  latitude: string;
  longitude: string;
  subtotal: string;
  timestamp: string;
}

export const getCsvStream = (filePath: string) => {
  return fs.createReadStream(filePath).pipe(csv());
};