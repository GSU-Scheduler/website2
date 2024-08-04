import { getDocs, collection, query, where, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useState, useRef, ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { Course } from '../../types';
import styles from './CourseAdd.module.css';
import { CAMPUSES, DELIVERY_MODES } from '../../constants';
import { CourseFilter } from '../CourseFilter/CourseFilter';

export const CourseAdd = () => {
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const coursesRef = collection(db, 'subjects2024');

    const getCourses = async (subjectKeyword: string) => {
        try {
            // Check if the input is empty, clear the lists
            if (subjectKeyword === '') {
                console.log('Empty subjectKeyword, clearing lists');
                setCourseList([]);
                setFilteredCourses([]);
                return;
            }

            const q = query(
                coursesRef,
                where('subject_course', '>=', subjectKeyword),
                where('subject_course', '<=', subjectKeyword + '\uf8ff'),
                limit(300)
            );
            const data = await getDocs(q);
            const coursesArray = data.docs.map((doc) => ({ ...doc.data(), ids: doc.id })) as Course[];
            setCourseList(coursesArray);
            filterCourses(coursesArray, keyword);
        } catch (error) {
            console.error(error);
        }
    };

    const debounceFetch = useCallback(
        debounce((value: string) => {
            if (value.trim()) {
                console.log('debounceFetch called with:', value);
                const subjectKeyword = value.split(' ')[0];
                getCourses(subjectKeyword);
            } else {
                // Clear courses when the input is empty
                console.log('Input is empty in debounceFetch, clearing lists');
                setCourseList([]);
                setFilteredCourses([]);
            }
        }, 500),
        []
    );

    const debounceFilter = useCallback(
        debounce((courses: Course[], keyword: string) => {
            console.log('debounceFilter called with:', keyword);
            const filtered = courses.filter((course) => {
                const courseString = `${course.subject_course}`;
                return courseString.startsWith(keyword);
            });
            setFilteredCourses(filtered);
        }, 500),
        []
    );

    const filterCourses = (courses: Course[], keyword: string) => {
        console.log('filterCourses called with:', keyword);
        const filtered = courses.filter((course) => {
            const courseString = `${course.subject_course}`;
            return courseString.startsWith(keyword);
        });
        setFilteredCourses(filtered);
    };

    const handleChangeKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value.trim();
        console.log('handleChangeKeyword called with:', input);
        const results = /^([A-Z]+)(\d.*)$/i.exec(input);
    
        if (results != null) {
            const [, subject, number] = results as unknown as [string, string, string];
            input = `${subject} ${number}`;
        }
    
        const formattedInput = input.toUpperCase();
        setKeyword(formattedInput);
        console.log('Formatted input:', formattedInput);
    
        if (formattedInput === '') {
            console.log('Input is empty, clearing lists');
            setCourseList([]); // Make sure this state is cleared
            setFilteredCourses([]); // Make sure this state is cleared
        } else {
            debounceFetch(formattedInput);
        }
    }, [debounceFetch]);
    
    useEffect(() => {
        // Debugging the states
        console.log('Current keyword:', keyword);
        console.log('Current course list:', courseList);
    
        if (keyword !== '' && courseList.length > 0) {
            debounceFilter(courseList, keyword);
        } else {
            console.log('No keyword or no courses, clearing filtered courses');
            setFilteredCourses([]); // Ensure the filtered list is cleared when keyword is empty
        }
    }, [keyword, courseList]);
    

    const memoizedCourses = useMemo(() => filteredCourses, [filteredCourses]);

    console.log(courseList);

    return (
        <div className={styles.container}>
            <div>
                <div className='flex border-black h-16 m-4 flex-col '>
                    <input
                        type='text'
                        ref={inputRef}
                        placeholder='+ XXX 0000'
                        value={keyword || ''}
                        onChange={handleChangeKeyword}
                        style={{ textTransform: 'uppercase' }}
                        className='w-1/2 bg-gray-500 h-full rounded'
                    />
                </div>

                {[
                    ['Delivery Mode', 'deliveryMode', DELIVERY_MODES] as const,
                    ['Campus', 'campus', CAMPUSES] as const,
                ].map(([name, property, labels]) => (
                    <CourseFilter
                        key={property}
                        // Uncomment and implement the following props as needed:
                        // name={name}
                        // labels={labels}
                        // selectedTags={filter[property]}
                        // onReset={(): void => handleResetFilter(property)}
                        // onToggle={(tag): void => handleToggleFilter(property, tag)}
                    />
                ))}
            </div>

            <div className="flex flex-col items-start space-y-4 m-4">
                {memoizedCourses.map((course) => (
                    <div key={course.ids} className='bg-emerald-400 shadow-md rounded-lg w-120 p-4 flex flex-col items-start'>
                        <p className="font-semibold">{course.subject_course}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
