import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const exportToPDF = (content:any) => {
  const pdf = new jsPDF();
  const pdfWidth = 120;
  const pdfHeight = 110;

  html2canvas(content, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.setFont("calibri")
    pdf.save('interview-report.pdf');
  });
};

export default exportToPDF;
