import { getDocs, collection, query, where, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useState, useRef, ChangeEvent, useCallback, useEffect} from 'react';
import debounce from 'lodash.debounce'; // Add lodash.debounce for debouncing the input

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
    const [courseList, setCourseList] = useState<Course[] | null>(null);
    const [keyword, setKeyword] = useState<string>('');
    const [filteredCourses, setFilteredCourses] = useState<Course[] | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null); // Ref to access input element
    
    const coursesRef = collection(db, 'courses');

    // Fetch courses based on keyword
    const getCourses = async (subjectKeyword: string) => {
        try {
            const q = query(
                coursesRef,
                where('subject', '>=', subjectKeyword),
                where('subject', '<=', subjectKeyword + '\uf8ff'),
                limit(300) // Adjust the limit as needed
            );
            const data = await getDocs(q);
            const coursesArray = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Course[]);
            setCourseList(coursesArray);

            // Filter locally based on the full keyword
            filterCourses(coursesArray, keyword);
        } catch (error) {
            console.log(error);
        }
    };

    // Debounce function for input changes
    const debounceFetch = useCallback(
        debounce((value: string) => {
            const subjectKeyword = value.split(' ')[0]; // Extract subject part of the keyword
            getCourses(subjectKeyword);
        }, 500), []
    );

    // Function to filter courses locally based on the full keyword
    const filterCourses = (courses: Course[], keyword: string) => {
        const filtered = courses.filter((course) => {
            const courseString = `${course.subject} ${course.courseNumber}`;
            return courseString.startsWith(keyword);
        });
        setFilteredCourses(filtered);
    };

    // Function to handle changes in the input field
    const handleChangeKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value.trim();
        const results = /^([A-Z]+)(\d.*)$/i.exec(input);

        if (results != null) {
            const [, subject, number] = results as unknown as [string, string, string];
            input = `${subject} ${number}`;
        }

        const formattedInput = input.toUpperCase();
        setKeyword(formattedInput);

        // Fetch courses based on the subject part of the formatted input
        debounceFetch(formattedInput);
    }, [debounceFetch]);

    // Additional effect to filter the courses whenever keyword or courseList changes
    useEffect(() => {
        if (courseList) {
            filterCourses(courseList, keyword || '');
        }
    }, [keyword, courseList]);

    return (
        <div>
            <input
                type='text'
                ref={inputRef}
                placeholder='XXX 0000'
                value={keyword || ''} // Display the current keyword value
                onChange={handleChangeKeyword} // Handle changes in the input
                style={{ textTransform: 'uppercase' }} // CSS to display text in uppercase
            />
            {keyword}

            <div className="flex flex-col items-center space-y-4">
                {filteredCourses?.map((course) => (
                    <div key={course.id} className='bg-emerald-400 shadow-md rounded-lg w-80 p-4 flex flex-col items-start'>
                        <p className="font-semibold">{course.subject} {course.courseNumber}</p>
                        <p>{course.title}</p>
                        {/* Add additional content here */}
                    </div>
                ))}
            </div>
        </div>
    );
};
