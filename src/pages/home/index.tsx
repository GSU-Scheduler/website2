// import { CourseContainer } from "../../components/CourseContainer/CourseContainer";
// import { Schedule } from "../../components/Schedule/Schedule";
// import { AddClassForm } from '../../components/AddClass/AddClassForm';
// import { Map } from '../../components/Map/Map';
// import styles from './home.module.css';

// export const Home = () => {
//     return (
//         <div className={styles.container}>
//             <div className={styles.section1}>
//                 <CourseContainer />
//             </div>
//             <div className={styles.section2}>
//                 <Schedule />
//             </div>
//             <div className={styles.section3}>
//                 <Map />
//             </div>
//         </div>
//     );
// };

import React from 'react';
import { CourseContainer } from "../../components/CourseContainer/CourseContainer";
import { Schedule } from "../../components/Schedule/Schedule";
import AddClassForm from '../../components/AddClass/AddClassForm';
import { Map } from '../../components/Map/Map';
import styles from './home.module.css';
import { ClassInfo } from '../../types';

export const Home = () => {
    const [classes, setClasses] = React.useState<ClassInfo[]>([]);

    const handleAddClass = (newClass: ClassInfo) => {
      setClasses([...classes, newClass]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.section1}>
                <CourseContainer />
            </div>
            <div className={styles.section2}>
                <AddClassForm onAddClass={handleAddClass} />
                <Schedule classes={classes} />
            </div>
            <div className={styles.section3}>
                <Map />
            </div>
        </div>
    );
};
