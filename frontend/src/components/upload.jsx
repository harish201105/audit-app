import React, { useState } from 'react';
import Navbar from './navbar';  // Adjust the import path if necessary
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

function Upload() {
  const navigate = useNavigate();  // Initialize useNavigate hook
  const [selectedOption, setSelectedOption] = useState('');  // State to track selected value

  // Handle button click for navigation
  const handleSelectClick = () => {
    // Check if a valid option is selected
    if (selectedOption === '') {
      alert('Please choose a file type.');  // Show an alert if no option is selected
    } else {
      navigate('/fileupload');  // Redirect to /fileupload if a valid option is selected
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
        <h1 className="text-center text-3xl font-bold my-5">Select Document Type</h1>
        
        {/* Center-aligned dropdown and button */}
        <div className="flex flex-col items-center space-y-5">
          {/* Dropdown */}
          <select 
            className="w-80 p-2 border border-gray-300 rounded"
            value={selectedOption}  // Bind to state
            onChange={(e) => setSelectedOption(e.target.value)}  // Update state on change
          >
            <option value="" disabled>Choose file type</option> {/* Remove selected attribute */}
            <option value="special-letter">Special Letter (30 days)</option>
            <option value="performance-audit">Performance/Theme Based Audit (6 weeks)</option>
            <option value="draft-paragraph">Draft Paragraph (6 weeks)</option>
            <option value="provisional-para">Provisional Para (2 weeks)</option>
            <option value="audit-para">Audit Para (3 weeks)</option>
          </select>

          {/* Select Button */}
          <button 
            className="text-white font-bold py-2 px-6 rounded"
            style={{ backgroundColor: '#0CAFFF' }} // Apply custom color
            onClick={handleSelectClick} // Handle button click
          >
            Select
          </button>
        </div>
        
      </div>
    </>
  );
}

export default Upload;