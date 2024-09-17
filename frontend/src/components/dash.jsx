import React from 'react';
import Navbar from './navbar';  // Adjust the import path if necessary
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

function Dash() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-10"> {/* Add margin-top here */}
        <h1 className="text-center text-3xl font-bold my-5">Dashboard</h1>
        
        {/* Static Progress Bar */}
        <div className="w-full bg-gray-300 rounded-full h-8 my-10 overflow-hidden"> {/* Adjust margin here */}
          <div className="flex h-full text-white text-center text-sm font-bold">
            {/* Green section */}
            <div className="bg-green-500 flex items-center justify-center" style={{ width: '50%' }}>
              10
            </div>
            {/* Yellow section */}
            <div className="bg-yellow-500 flex items-center justify-center" style={{ width: '30%' }}>
              6
            </div>
            {/* Red section */}
            <div className="bg-red-500 flex items-center justify-center" style={{ width: '20%' }}>
              3
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <div className="text-center">
          <Link to="/upload">
            <button className="bg-[#0CAFFF] text-white font-bold py-2 px-4 rounded-full">
              Upload
            </button>
          </Link>
        </div>

      </div>
    </>
  );
}

export default Dash;