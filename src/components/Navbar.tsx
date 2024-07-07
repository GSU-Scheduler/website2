import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
            </div>
            <div className="navbar-profile">
                <Link to="/login">
                    <FaUserCircle size={30} />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
