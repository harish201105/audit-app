import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar'; // Import Navbar component
import { useNavigate } from 'react-router-dom'; // For navigation after upload

function Upload() {
  const navigate = useNavigate(); // For navigation after file upload
  const [file, setFile] = useState(null); // State to store the selected file
  const [selectedOption, setSelectedOption] = useState(''); // State to track the selected document type
  const [message, setMessage] = useState(''); // State to store messages for feedback
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to hold fetched files based on the selected document type

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set the selected file in state
  };

  // Handle file upload and conversion
  const handleFileUpload = async () => {
    // Check if both file and document type are selected
    if (!file || selectedOption === '') {
      alert('Please choose a file type and upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', selectedOption);

    try {
      const response = await axios.post('http://localhost:5000/upload-and-convert', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('File uploaded and converted successfully.');
      fetchFilesByType(); // Refresh the file list after upload

      // Navigate to files page to edit the uploaded file immediately
      navigate('/files', { state: { fileName: file.name, elements: response.data.elements } });
    } catch (error) {
      console.error('Error uploading file', error);
      setMessage('Error uploading file. Please try again.');
    }
  };

  // Fetch files by document type
  const fetchFilesByType = async () => {
    if (!selectedOption) {
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/files-by-type?documentType=${selectedOption}`);
      setUploadedFiles(response.data); // Update the state with the fetched files
    } catch (error) {
      console.error('Error fetching files:', error);
      setMessage('Error fetching files. Please try again.');
    }
  };

  // Handle converting an existing file without saving
  const handleFileEdit = async (file) => {
    try {
      const response = await axios.get(`http://localhost:5000/convert-file/${file._id}`); // Fetch the file details by ID
      navigate('/files', { state: { fileName: file.fileName, elements: response.data.elements } });
    } catch (error) {
      console.error('Error fetching file details:', error);
      setMessage('Error fetching file details. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
        <h1 className="text-center text-3xl font-bold my-5">Upload PDF and Select Document Type</h1>

        <div className="flex flex-col items-center space-y-5">
          {/* File Input */}
          <input type="file" onChange={handleFileChange} />

          {/* Dropdown for Document Type */}
          <select
            className="w-80 p-2 border border-gray-300 rounded"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="" disabled>Choose document type</option>
            <option value="special-letter">Special Letter (30 days)</option>
            <option value="performance-audit">Performance/Theme Based Audit (6 weeks)</option>
            <option value="draft-paragraph">Draft Paragraph (6 weeks)</option>
            <option value="provisional-para">Provisional Para (2 weeks)</option>
            <option value="audit-para">Audit Para (3 weeks)</option>
          </select>

          {/* Upload and Convert Button */}
          <button
            className="text-white font-bold py-2 px-6 rounded"
            style={{ backgroundColor: '#0CAFFF' }}
            onClick={handleFileUpload}
          >
            Upload and Convert
          </button>

          {message && <p>{message}</p>}

          {/* Button to Fetch Files */}
          <button
            className="mt-5 p-2 bg-blue-500 text-white rounded"
            onClick={fetchFilesByType}
          >
            Fetch Files for {selectedOption}
          </button>

          {/* Display Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <table className="table-auto mt-5">
              <thead>
                <tr>
                  <th className="px-4 py-2">S.No</th>
                  <th className="px-4 py-2">File Name</th>
                  <th className="px-4 py-2">Document Type</th>
                  <th className="px-4 py-2">Convert</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file, index) => (
                  <tr key={file._id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{file.fileName}</td>
                    <td className="border px-4 py-2">{file.documentType}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="text-white bg-green-500 p-2 rounded"
                        onClick={() => handleFileEdit(file)}
                      >
                        Convert and Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Upload;
