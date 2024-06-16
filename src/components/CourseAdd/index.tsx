// import {getDocs, collection,  query, limit } from 'firebase/firestore';
// import {db} from '../config/firebase';
import {useState, useRef, ChangeEvent, useCallback} from 'react';

// Defining interface to represent the returns object posts
export interface Course {
    building: string;
    campus: string;
    classType: string;
    courseNumber: number;
    days: string;
    ending: string;
    hours: number;
    id: string;
    instructor: string;
    room: number;
    startingTime: string;
    subject: string;
    time: string;
    title: string;
}

export const CourseAdd = () => {

    // Creating a state to manage posts returned, the initial post will either null when we first have none or an array of Post
    // const [courseList, setCourseList] = useState<Course[] | null>(null);
    const [keyword, setKeyword] = useState<string | null>('');

     // Ref to access the input element directly
    const inputRef = useRef<HTMLInputElement | null>(null); // Ref to access input element
    
    //  We select the imported db from config, and the collection posts
    // const  coursesRef = collection(db, 'courses');

    // All firestore operations require async/await
    // const getCourse = async () => {
    //     try{
    //         const q = query(coursesRef, limit(10));
    //         const data = await getDocs(q);
    //         // Destructuring the returned data, by mapping it using id:doc.id for some reason
    //         setCourseList(data.docs.map((doc) => ({...doc.data(), id: doc.id})) as Course[]);
    //     } catch(error) {
    //         console.log(error);
    //     }
        
    // };

    // Function to handle changes in the input field
    const handleChangeKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        // Trim whitespace from input value
        let input = e.target.value.trim();

        // Regular expression to separate letters and numbers
        const results = /^([A-Z]+)(\d.*)$/i.exec(input);

        // If the regular expression matches, reformat the input
        if (results != null) {
        const [, subject, number] = results as unknown as [
            string,
            string,
            string
        ];
        input = `${subject} ${number}`; // Format input as 'ABC 1234'
        }

        // Update the keyword state with the formatted input
        setKeyword(input);
    },[]);



    //  We want to call the function everytime the page renders, so the function will be called once, when the component is mounted
    // useEffect(() => {
    //     getCourse();
    // }, [])
    return(
        <div>

            <input
                type='text'
                ref={inputRef}
                placeholder='XXX 0000'
                value={keyword  || ''} // Display the current keyword value
                onChange={handleChangeKeyword} // Handle changes in the input
                style={{ textTransform: 'uppercase' }} // CSS to display text in uppercase
            /> {keyword}


            {/* {courseList?.map((course, key) => {
                return(
                    <div key={course.id}>
                        <p>Course Title: {course.title}</p>
                        <p>Course Building: {course.building}</p>
                        <p>Course Subject: {course.subject}{course.courseNumber}</p>
                    </div>
                )
            })} */}
        </div>
    )
};