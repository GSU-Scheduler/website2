import React from 'react'
import styles from './CourseNav.module.css'
function CourseNav() {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <p>Courses</p>
      </div>
      <div className={styles.item}>
        <p>Add Event</p>
      </div>
        
        
    </div>
  )
}

export default CourseNav;