// Utility functions for file generation and download
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Function to generate a professional PDF report
export const generatePDFReport = (title: string, data: Record<string, Record<string, string> | string>): void => {
  const doc = new jsPDF();
  
  // Set font and title
  doc.setFontSize(22);
  doc.setTextColor(40, 116, 166);
  doc.text('Digital E-Panchayat', 105, 20, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(title, 105, 35, { align: 'center' });
  
  // Add a line separator
  doc.setDrawColor(72, 186, 136);
  doc.line(20, 42, 190, 42);
  
  // Add report generation date
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);
  
  // Add content
  let yPosition = 65;
  
  Object.entries(data).forEach(([section, sectionData]) => {
    // Add section title
    doc.setFontSize(14);
    doc.setTextColor(72, 186, 136);
    doc.text(section, 20, yPosition);
    yPosition += 8;
    
    // Add section data
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    Object.entries(sectionData).forEach(([key, value]) => {
      // Check if we need a new page
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`${key}: ${value}`, 25, yPosition);
      yPosition += 7;
    });
    
    yPosition += 5;
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'This is a computer-generated document. No signature required.',
      105,
      290,
      { align: 'center' }
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      105,
      295,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '-').toLowerCase()}-report.pdf`);
};

// Function to generate a JPG report
export const generateJPGReport = async (title: string, data: Record<string, Record<string, string> | string>): Promise<void> => {
  // Create a temporary HTML element for rendering
  const tempElement = document.createElement('div');
  tempElement.style.position = 'absolute';
  tempElement.style.left = '-9999px';
  tempElement.style.width = '800px';
  tempElement.style.padding = '20px';
  tempElement.style.backgroundColor = '#f9fafb';
  tempElement.style.fontFamily = 'Arial, sans-serif';
  
  // Build HTML content
  let htmlContent = `
    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 30px; border-radius: 10px; border: 2px solid #34d399;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #047857; font-size: 32px; margin: 0 0 10px 0;">Digital E-Panchayat</h1>
        <h2 style="color: #1f2937; font-size: 24px; margin: 0;">${title}</h2>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #d1d5db;">
          <p style="color: #6b7280; font-size: 14px;">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  `;
  
  Object.entries(data).forEach(([section, sectionData]) => {
    htmlContent += `
      <div style="margin-bottom: 25px;">
        <h3 style="color: #047857; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #d1d5db;">${section}</h3>
        <div style="margin-left: 10px;">
    `;
    
    Object.entries(sectionData).forEach(([key, value]) => {
      htmlContent += `
        <div style="margin-bottom: 8px; display: flex;">
          <div style="font-weight: bold; width: 200px; color: #374151;">${key}:</div>
          <div style="color: #1f2937;">${value}</div>
        </div>
      `;
    });
    
    htmlContent += `
        </div>
      </div>
    `;
  });
  
  htmlContent += `
      </div>
      <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #6b7280;">
        Digital E-Panchayat System | Valid Document
      </div>
    </div>
  `;
  
  tempElement.innerHTML = htmlContent;
  document.body.appendChild(tempElement);
  
  try {
    // Use html2canvas to capture the element as an image
    const canvas = await html2canvas(tempElement, {
      scale: 2, // Higher quality
      backgroundColor: '#ffffff'
    });
    
    // Convert to JPG and download
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.href = imgData;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-report.jpg`;
    link.click();
  } finally {
    // Clean up
    document.body.removeChild(tempElement);
  }
};

// Function to generate and download a report
export const generateAndDownloadReport = async (
  title: string, 
  data: Record<string, Record<string, string> | string>, 
  format: 'pdf' | 'jpg'
): Promise<void> => {
  if (format === 'pdf') {
    generatePDFReport(title, data);
  } else {
    await generateJPGReport(title, data);
  }
};