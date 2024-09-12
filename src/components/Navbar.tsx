import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
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
      navigate("/"); // Redirect to login page after logout
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
    <header className="flex justify-between items-center bg-zinc-800 text-zinc-50 py-5">
      <Link to="/" className="text-base mb-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 inline"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
          />
        </svg>
        {" "}gsuscheduler.io
      </Link>
      <div className="flex justify-center space-x-12">
        <Link
          to="/"
          className="text-base transition-colors duration-300 hover:text-blue-500"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-base transition-colors duration-300 hover:text-blue-500"
        >
          About
        </Link>
      </div>
      <div className="relative">
        <FaUserCircle
          size={28}
          className="cursor-pointer hover:fill-blue-500 transition-colors duration-300"
          onClick={toggleDropdown}
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
            {userEmail ? (
              <span className="block px-4 py-2">{userEmail}</span>
            ) : (
              <Link
                to="/auth"
                className="block px-4 py-2 hover:bg-gray-200 rounded-md transition-colors duration-300"
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
    </header>
  );
};

export default Navbar;
