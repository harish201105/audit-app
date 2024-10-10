const File = require('../models/File');
const DocumentElement = require('../models/DocumentElement');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const pdf_table_extractor = require('pdf-table-extractor');
const convertapi = require('convertapi')('secret_VJkaVYAd86iRtjgh'); // Replace with your actual API key

// Function to extract paragraphs from text
function extractParagraphs(text) {
  const paragraphs = text.split(/(?:\r?\n\s*\r?\n)|(?:\r?\n\s*(?=\d+\.|[-*]))/g)
    .map(paragraph => paragraph.replace(/\s+/g, ' ').trim())
    .filter(paragraph => paragraph.length > 0);
  return paragraphs;
}

// Function to extract tables from the PDF
function extractTables(filePath) {
  return new Promise((resolve, reject) => {
    pdf_table_extractor(filePath, (result) => {
      if (result && result.pageTables && result.pageTables.length > 0) {
        const filteredTables = result.pageTables
          .filter(table => table.data && table.data.length > 0) // Filter empty tables
          .map(table => table.data); // Extract only table data
        resolve(filteredTables);
      } else {
        resolve([]); // If no tables found, return an empty array
      }
    }, (error) => {
      console.error('Error extracting tables from PDF:', error);
      reject(error);
    });
  });
}

// Function to extract text from PDF
async function extractPDFContent(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  return data.text;
}

// Route to handle PDF upload and conversion
exports.uploadAndConvert = async (req, res) => {
  try {
    const { documentType } = req.body;
    if (!req.files || !req.files.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Store PDF file
    const pdfFile = req.files.file;
    const uploadPath = path.join(__dirname, '../uploads', pdfFile.name);
    pdfFile.mv(uploadPath, async (err) => {
      if (err) return res.status(500).send(err);

      // Save file metadata to MongoDB, including documentType
      const file = new File({ 
        fileName: pdfFile.name, 
        filePath: uploadPath, 
        documentType  // Store the document type
      });
      await file.save();

      // Extract text from the PDF
      const extractedText = await extractPDFContent(uploadPath);
      const paragraphs = extractParagraphs(extractedText);

      // Extract tables from the PDF
      const tables = await extractTables(uploadPath);

      // Store paragraphs in MongoDB
      const elements = [];
      for (let i = 0; i < paragraphs.length; i++) {
        const paraId = `${documentType}${i + 1}`;  // Generate Para ID based on document type
        const paraAuditId = `1.${i + 1}`;  // Generate Para Audit ID
        const element = new DocumentElement({
          type: 'paragraph',
          content: paragraphs[i],
          pdfFileId: file._id,
          paraId,
          paraAuditId,
          order: i
        });
        await element.save();
        elements.push(element);
      }

      // Store tables in MongoDB
      for (let j = 0; j < tables.length; j++) {
        if (!tables[j].data || tables[j].data.length === 0) {
          console.log(`Skipping empty table at index ${j}`);
          continue;
        }
         // Generate Table Audit ID
        const element = new DocumentElement({
          type: 'table',
          content: JSON.stringify(tables[j]),  // Store the table as a JSON string
          pdfFileId: file._id,
          paraId: tableId,
          paraAuditId: tableAuditId,
          order: paragraphs.length + j
        });
        await element.save();
        elements.push(element);
      }

      // Convert PDF to DOCX
      const result = await convertapi.convert('docx', { File: uploadPath }, 'pdf');
      const docxFilePath = path.join(__dirname, '../uploads', pdfFile.name.replace('.pdf', '.docx'));
      await result.saveFiles(docxFilePath);

      // Send extracted paragraphs and tables back to frontend
      res.status(201).json({
        message: 'File uploaded and converted successfully',
        elements, // Send extracted elements (paragraphs and tables) to frontend
      });
    });
  } catch (error) {
    console.error('Error uploading and converting file:', error);
    res.status(500).send('File upload and conversion failed.');
  }
};

// Route to fetch files by document type
exports.getFilesByType = async (req, res) => {
  const { documentType } = req.query; // Extract documentType from query params

  try {
    // Find all files that match the specified document type
    const files = await File.find({ documentType });

    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'No files found for this document type.' });
    }

    res.json(files); // Send the list of files back to the frontend
  } catch (error) {
    console.error('Error fetching files by document type:', error);
    res.status(500).json({ message: 'Error fetching files. Please try again later.' });
  }
};

// Route to fetch a specific file's details by ID and extract content without saving in the database
exports.convertFileWithoutSaving = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found.' });
    }

    const extractedText = await extractPDFContent(file.filePath);
    const paragraphs = extractParagraphs(extractedText);
    const tables = await extractTables(file.filePath);

    // Send the extracted paragraphs and tables without saving
    res.status(200).json({
      message: 'File converted successfully for editing.',
      elements: [...paragraphs, ...tables], // Combine paragraphs and tables into elements
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Error fetching file details.' });
  }
};
