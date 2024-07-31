import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className='container'>
            <div>
                <h1>GSU Scheduler</h1>
            </div>
            <div className='linkContainer'>
                <Link to="/" className="links">Home</Link>
                <Link to="/about" className="links">About</Link>
                <h1 className="links">Login</h1>
            </div>
        </nav>
    );
};

export default Navbar;
