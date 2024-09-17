import React from 'react';
import Navbar from './navbar';  // Adjust the import path if necessary
import { useLocation } from 'react-router-dom';  // Import useLocation from react-router-dom

function Files() {
  const location = useLocation();  // Get the current location
  const fileName = location.state?.fileName || 'No file selected';  // Extract file name from state

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-10">
        <h1 className="text-center text-3xl font-bold my-5">{fileName}</h1>
        <p className="text-center">This is the files page content.</p>
      </div>
    </>
  );
}

export default Files;