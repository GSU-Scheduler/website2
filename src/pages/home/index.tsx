import { CourseContainer } from "../../components/CourseContainer/CourseContainer";
import { Schedule } from "../../components/Schedule/Schedule";
import { Map } from '../../components/Map/Map';
import styles from './home.module.css';

export const Home = () => {
    return (
        <div className={styles.container}>
            <div className={styles.section1}>
                <CourseContainer />
            </div>
            <div className={styles.section2}>
                <Schedule />
            </div>
            <div className={styles.section3}>
                <Map />
            </div>
        </div>
    );
};