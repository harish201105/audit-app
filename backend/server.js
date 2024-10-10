const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/db'); // MongoDB connection
const fileController = require('./controllers/fileController'); // Import file controller
require('dotenv').config(); // Load environment variables

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for multiple origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Adjust to your frontend port (5173 for Vite, 3000 for React)
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Middleware to handle file uploads and JSON parsing
app.use(fileUpload());
app.use(express.json()); // To parse incoming JSON

// Route for handling PDF upload and conversion
app.post('/upload-and-convert', fileController.uploadAndConvert);

// Route to fetch files by document type
app.get('/files-by-type', fileController.getFilesByType);

// Route to fetch a specific file's details by ID and extract content without storing in the database
app.get('/convert-file/:id', fileController.convertFileWithoutSaving);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
