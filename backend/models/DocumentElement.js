const mongoose = require('mongoose');

const documentElementSchema = new mongoose.Schema({
  type: { type: String, enum: ['paragraph', 'image', 'table'], required: true },
  content: { type: String }, // For paragraphs and tables
  imagePath: { type: String }, // For images
  pdfFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true }, // Reference to the original PDF
  paraAuditId: { type: String, required: true }, // To store the Para Audit ID (e.g., 1.1, 1.2, etc.)
  paraId: { type: String, required: true }, // To store the Para ID based on the document type (e.g., PP101)
  order: { type: Number, required: true }, // To maintain order in the document
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DocumentElement', documentElementSchema);
