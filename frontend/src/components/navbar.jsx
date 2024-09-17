import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

function Navbar() {
    const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
    const navigate = useNavigate(); // Hook for navigation

    const handleLogout = () => {
        // Here you can add logic for actual logout if needed
        navigate('/'); // Redirect to the login page
    };

    return (
        <nav className="bg-[#0CAFFF] p-4 text-white flex justify-between items-center">
            <div>
                <ul className="flex items-center">
                    <li>
                        <Link to="/" className="font-semibold text-lg hover:text-blue-200">Audit App</Link>
                    </li>
                    {/* Additional navigation links can be added here */}
                </ul>
            </div>
            <div>
                <FaUser size={20} onClick={() => setShowPopup(!showPopup)} style={{ cursor: 'pointer' }} />
                {showPopup && (
                    <div className="absolute top-12 right-4 bg-white p-3 rounded shadow-lg">
                        <button 
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={handleLogout}
                        >
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;