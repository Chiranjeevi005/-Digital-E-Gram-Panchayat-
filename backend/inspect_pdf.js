const fs = require('fs');
const path = require('path');

// Read the PDF file
const pdfPath = path.join(__dirname, 'test_certificate.pdf');
const pdfBuffer = fs.readFileSync(pdfPath);

console.log('PDF file size:', pdfBuffer.length, 'bytes');
console.log('First 100 bytes:', pdfBuffer.slice(0, 100).toString('hex'));

// Check if it starts with %PDF
if (pdfBuffer.slice(0, 4).toString() === '%PDF') {
  console.log('File is a valid PDF');
} else {
  console.log('File is not a valid PDF');
  console.log('First 4 bytes:', pdfBuffer.slice(0, 4).toString());
}