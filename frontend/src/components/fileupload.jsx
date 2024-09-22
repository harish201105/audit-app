import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Handle file selection
  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const onFileUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/files/upload', formData, {

        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err); // Log the error to see what's going wrong
      setMessage('File upload failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
        <h1 className="text-center text-3xl font-bold my-5">Upload File</h1>
        
        {/* Center-aligned file input and button */}
        <div className="flex flex-col items-center space-y-5">
          {/* File Input */}
          <input type="file" onChange={onFileChange} />

          {/* Upload Button */}
          <button 
            className="text-white font-bold py-2 px-6 rounded"
            style={{ backgroundColor: '#0CAFFF' }} // Apply custom color
            onClick={onFileUpload} // Handle button click
          >
            Upload
          </button>
          
          {/* Message */}
          {message && <p>{message}</p>}
        </div>
      </div>
    </>
  );
}

export default FileUpload;
