import React from 'react'
import styles from './CourseFilter.module.css'

export type CourseFilterProps = {
    name: string;
    // labels: Record<string, string>;
    // selectedTags: string[];
    // onReset: () => void;
    // onToggle: (tag: string) => void;
  };


export const CourseFilter = () => {
  return (
    <div className={styles.container}>CourseFilter</div>
  );
};