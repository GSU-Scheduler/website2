export interface  SpecificCourse {
    building: string;
    campus: string;
    classType: string;
    courseNumber: string;
    days: string;
    endingTime: number;
    extraLabBuilding: string;
    extraLabDay: string;
    extraLabEndingTime: number;
    extraLabRoom: number;
    extraLabStartingTime: number;
    extraLabTime: number;
    hours: number;
    id: string;
    labBuilding: string;
    labDay: string;
    labEndingTime: number;
    labRoom: number;
    labStartingTime: number;
    labTime: string;
    otherInstructor: string;
    instructor: string;
    room: string;
    stability: string;
    startingTime: string;
    subject: string;
    time: string;
    title: string;
}

export interface Course {
    ids: string;
    subject_course: string; 
}