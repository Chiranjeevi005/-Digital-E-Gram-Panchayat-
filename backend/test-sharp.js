const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Test PDF to JPG conversion
async function testPdfToJpg() {
  try {
    const pdfPath = path.join(__dirname, 'uploads', 'certificate_CRT-MFL1OPEFNK2J2.pdf');
    
    // Check if PDF file exists
    if (!fs.existsSync(pdfPath)) {
      console.log('PDF file does not exist');
      return;
    }
    
    console.log('PDF file exists, attempting conversion...');
    
    // Convert PDF to JPG
    const jpgPath = path.join(__dirname, 'uploads', 'test-output.jpg');
    
    const pdfBuffer = await fs.promises.readFile(pdfPath);
    await sharp(pdfBuffer, { density: 300 })
      .jpeg({ quality: 90 })
      .toFile(jpgPath);
    
    console.log('Conversion successful! JPG saved to:', jpgPath);
  } catch (error) {
    console.error('Error during conversion:', error);
  }
}

testPdfToJpg();