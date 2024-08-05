// Course.tsx
// SelectedCourse.tsx
import React from 'react';
import { Course as CourseType } from '../../types'; // Import the type definition for a course

interface CourseProps {
  course: CourseType; // Define props expected by the component
}

const SelectedCourse: React.FC<CourseProps> = ({ course }) => {
  return (
    <div>
      {/* // Display the course title */}
      <h4>{course.title}</h4> 
      {/* Display a specific course attribute */}
      <p>{course.subject_course}</p> 
      {/* Add more details as needed, such as instructor, times, location, etc. */}
    </div>
  );
};

export default SelectedCourse; // Export the component for use in other parts of your application
