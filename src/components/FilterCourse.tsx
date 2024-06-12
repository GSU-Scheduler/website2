import {getDocs, collection, doc} from 'firebase/firestore';
import {db} from '../config/firebase';
import {useState, useEffect} from 'react';

// Defining interface to represent the returns object posts
export interface Course {
    building: string;
    campus: string;
    classType: string;
    courseNumber: number;
    days: string;
    ending: string;
    hours: number;
    id: number;
    instructor: string;
    room: number;
    startingTime: string;
    subject: string;
    time: string;
    title: string;
}


export const FilterCourse = () => {

    // Creating a state to manage posts returned, the initial post will either null when we first have none or an array of Post
    const [courseList, setCourseList] = useState<Course[] | null>(null);

    //  We select the imported db from config, and the collection posts
    const  coursesRef = collection(db, 'courses');

    // All firestore operations require async/await
    const getCourse = async () => {
        const data = await getDocs(coursesRef);
        console.log(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    };

    //  We want to call the function everytime the page renders, so the function will be called once, when the component is mounted
    useEffect(() => {
        getCourse();
    }, [])
    return(
        <div>

        </div>
    )
};