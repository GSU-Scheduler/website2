import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
            <div className="flex justify-evenly ">
                <div>
                    <h1>GSU Scheduler</h1>
                </div>
                <div className='flex'>
                    <Link to="/" className="text-white text-base mx-4 transition-colors duration-300 hover:text-blue-500">Home</Link>
                    <Link to="/about" className="text-white text-base mx-4 transition-colors duration-300 hover:text-blue-500">About</Link>
                    <h1 className="text-white text-base mx-4 transition-colors duration-300 hover:text-blue-500">Login</h1>
                </div>
                
            </div>
        </nav>
    );
};

export default Navbar;
