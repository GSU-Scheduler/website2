import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null); // State to store user email
    const auth = getAuth();
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setDropdownOpen(false);
            setUserEmail(null); // Reset the user email on logout
            navigate('/'); // Redirect to login page after logout
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email); // Set the user email when logged in
            } else {
                setUserEmail(null); // Reset the user email when logged out
            }
        });

        return () => unsubscribe(); // Cleanup the subscription on component unmount
    }, [auth]);

    return (
        <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
            <div className="flex justify-center flex-grow">
                <Link to="/" className="text-white text-base mx-4 transition-colors duration-300 hover:text-blue-500">Home</Link>
                <Link to="/about" className="text-white text-base mx-4 transition-colors duration-300 hover:text-blue-500">About</Link>
            </div>
            <div className="relative">
                <FaUserCircle 
                    size={28} 
                    className="cursor-pointer" 
                    onClick={toggleDropdown}
                />
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
                        {userEmail ? (
                            <span className="block px-4 py-2">{userEmail}</span>
                        ) : (
                            <Link 
                                to="/auth" 
                                className="block px-4 py-2 hover:bg-gray-200"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                        {userEmail && (
                            <button 
                                onClick={handleLogout} 
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;