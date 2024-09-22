// controllers/fileController.js
const File = require('../models/File');
const DocumentElement = require('../models/DocumentElement');
const pdf = require('pdf-parse');
const fs = require('fs');
const pdf_table_extractor = require('pdf-table-extractor');

// Function to extract paragraphs from text using improved logic
function extractParagraphs(text) {
  // Remove unwanted prefixes (like "Pdfex")
  text = text.replace(/Pdfex\s*/g, '');

  // Use a regular expression to split paragraphs more intelligently:
  // 1. Match two or more line breaks (\r?\n) to identify paragraphs
  // 2. Match significant indentation, list items, or bullet points
  const paragraphs = text.split(/(?:\r?\n\s*\r?\n)|(?:\r?\n\s*(?=\d+\.|[-*]))/g)
    .map(paragraph => paragraph.replace(/\s+/g, ' ').trim()) // Replace multiple spaces and trim
    .filter(paragraph => paragraph.length > 0); // Filter out empty strings

  return paragraphs;
}

// Function to extract text from the PDF
async function extractPDFContent(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error; // Rethrow the error to be handled in the calling function
  }
}

// Function to extract tables from the PDF using pdf-table-extractor
function extractTablesFromPDF(pdfPath) {
  return new Promise((resolve, reject) => {
    pdf_table_extractor(pdfPath, (result) => {
      resolve(result.pageTables);
    }, (error) => {
      console.error('Error extracting tables from PDF:', error);
      reject(error);
    });
  });
}

// Upload and extract content from PDF
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save the PDF file metadata to MongoDB
    const file = new File({
      fileName: req.file.originalname,
      filePath: req.file.path
    });
    await file.save();
    console.log('PDF metadata saved to MongoDB:', file);

    // Extract text from the PDF
    let paragraphs = [];
    try {
      const extractedText = await extractPDFContent(req.file.path);
      if (extractedText) { // Ensure the extracted text is valid
        paragraphs = extractParagraphs(extractedText); // Use the improved extraction logic
        console.log(`Extracted ${paragraphs.length} paragraphs from the PDF`);
      } else {
        console.log('No text extracted from PDF.');
      }
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
    }

    // Store each paragraph in MongoDB
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].trim()) { // Ignore empty paragraphs
        const element = new DocumentElement({
          type: 'paragraph',
          content: paragraphs[i].trim(),
          pdfFileId: file._id,
          order: i
        });
        await element.save();
        console.log(`Paragraph ${i} saved to MongoDB`);
      }
    }

    // Extract tables from the PDF
    let tables = [];
    try {
      tables = await extractTablesFromPDF(req.file.path);
      console.log(`Extracted ${tables.length} tables from the PDF`);
    } catch (error) {
      console.error('Error extracting tables from PDF:', error);
    }

    // Store each table in MongoDB
    for (let j = 0; j < tables.length; j++) {
      const element = new DocumentElement({
        type: 'table',
        content: JSON.stringify(tables[j]), // Store table data as JSON string
        pdfFileId: file._id,
        order: paragraphs.length + j // Continue order after paragraphs
      });
      await element.save();
      console.log(`Table ${j} saved to MongoDB`);
    }

    res.status(201).json({ message: 'File uploaded and content extracted successfully', file });
  } catch (error) {
    console.error('Error while uploading file:', error);
    res.status(500).json({ message: 'File upload failed', error });
  }
};
