import fs from 'fs';
import path from 'path';

async function uploadFile() {
  const filePath = path.join(process.cwd(), 'test.csv');
  
  if (!fs.existsSync(filePath)) {
     console.error(`Cannot find CSV file at ${filePath}`);
     return;
  }

  const formData = new FormData();
  formData.append('file', new Blob([fs.readFileSync(filePath)]), 'BetterMe Test-Input.csv');

  console.log('Sending file to your backend...');

  try {
    const response = await fetch('http://localhost:3000/orders/import', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log('Server Response:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

uploadFile();