import React from 'react'
import CourseNav from '../CourseNav/CourseNav';
import { CourseAdd } from '../CourseAdd/CourseAdd';
import styles from './CourseContainer.module.css'
export const CourseContainer = () => {
  return (
    <div className={styles.container}>
        <div>
            <CourseNav/>
        </div>
        <div>
            <CourseAdd/>
        </div>
        
        
    </div>
  );
};

