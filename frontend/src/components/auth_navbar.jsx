import React from 'react';
import { Link } from 'react-router-dom'; // This assumes you are using React Router for navigation

function Navbar() {
    return (
        <nav className="bg-[#0CAFFF] p-4 text-white">
            <ul className="flex justify-between items-center">
                <li>
                    <Link to="/" className="font-semibold text-lg hover:text-blue-200">Audit App</Link>
                </li>
                {/* Add additional navigation links here */}
            </ul>
        </nav>
    );
}

export default Navbar;