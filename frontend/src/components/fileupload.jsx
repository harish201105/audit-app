import React, { useState } from 'react';
import Navbar from './navbar';  // Adjust the import path if necessary
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);  // State to track the selected file
  const navigate = useNavigate();  // Initialize useNavigate hook

  // Handle file input change
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);  // Store the selected file in the state
  };

  // Handle submit button click
  const handleSubmit = () => {
    if (!selectedFile) {
      alert('Please select a file before submitting.');  // Alert if no file is selected
    } else {
      // Implement the logic to handle file submission here
      console.log('File submitted:', selectedFile);
      alert('File submitted successfully.');
      // Redirect to /files and pass the file name as state
      navigate('/files', { state: { fileName: selectedFile.name } });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
        <h1 className="text-center text-3xl font-bold my-5">Upload Files</h1>
        
        {/* File input and submit button */}
        <div className="flex flex-col items-center space-y-5">
          {/* File Input */}
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="w-80 p-2 border border-gray-300 rounded"
            required  // Make the file input a required field
          />

          {/* Submit Button */}
          <button 
            className="text-white font-bold py-2 px-6 rounded"
            style={{ backgroundColor: '#0CAFFF' }} // Apply custom color
            onClick={handleSubmit} // Handle button click
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default FileUpload;