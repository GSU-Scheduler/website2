import React from 'react';
import { ClassInfo } from '../../types'; // Ensure this path is correct
import styles from './Schedule.module.css';

type ScheduleProps = {
  classes: ClassInfo[];
};

// Define the structure for timeMap with an index signature
interface TimeMap {
  [key: string]: {
    M: string;
    T: string;
    W: string;
    R: string;
    F: string;
  };
}

export const Schedule: React.FC<ScheduleProps> = ({ classes }) => {
  // Function to create the schedule grid
  const renderSchedule = () => {
    // Define time slots
    const times = [
      '8am', '9am', '10am', '11am', '12pm',
      '1pm', '2pm', '3pm', '4pm', '5pm',
      '6pm', '7pm', '8pm', '9pm'
    ];

    // Create a map of times to days
    const timeMap: TimeMap = times.reduce((acc, time) => {
      acc[time] = { M: '', T: '', W: '', R: '', F: '' };
      return acc;
    }, {} as TimeMap);

    // Fill the map with class data
    classes.forEach(({ name, startTime, endTime, days }) => {
      const startHour = parseInt(startTime.replace(/[^0-9]/g, ''), 10);
      const endHour = parseInt(endTime.replace(/[^0-9]/g, ''), 10);
      const startIndex = times.findIndex(time => time.startsWith(startHour.toString()));
      const endIndex = times.findIndex(time => time.startsWith(endHour.toString()));
      
      if (startIndex !== -1 && endIndex !== -1) {
        times.slice(startIndex, endIndex + 1).forEach((time) => {
          days.forEach(day => {
            // Cast `time` to a valid index type for `timeMap`
            (timeMap as any)[time][day] = name;
          });
        });
      }
    });

    return (
      <>
        {times.map(time => (
          <tr key={time}>
            <td className={styles.time}>{time}</td>
            <td>{timeMap[time].M}</td>
            <td>{timeMap[time].T}</td>
            <td>{timeMap[time].W}</td>
            <td>{timeMap[time].R}</td>
            <td>{timeMap[time].F}</td>
          </tr>
        ))}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <table className={styles.tableContainer}>
        <thead>
          <tr>
            <th></th>
            <th>M</th>
            <th>T</th>
            <th>W</th>
            <th>R</th>
            <th>F</th>
          </tr>
        </thead>

        <tbody className={styles.bodyContainer}>
          {renderSchedule()}
        </tbody>
      </table>
    </div>
  );
};
