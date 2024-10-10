const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  documentType: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  elements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DocumentElement' }]  // Assuming 'elements' are referenced
});

module.exports = mongoose.model('File', fileSchema);
