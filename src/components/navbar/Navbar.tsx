import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
    return (
        <nav className={styles.container}>
            <div>
                <h1>GSU Scheduler</h1>
            </div>
            <div className={styles.linkContainer}>
                <Link to="/" className={styles.links}>Home</Link>
                <Link to="/about" className={styles.links}>About</Link>
                <Link to='/' className={styles.links}>Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
