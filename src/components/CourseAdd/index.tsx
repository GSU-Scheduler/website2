import { getDocs, collection, query, where, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useState, useRef, ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { Course } from '../../types/types';


export const CourseAdd = () => {
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const coursesRef = collection(db, 'courses');

    const getCourses = async (subjectKeyword: string) => {
        console.log('getCourses called with:', subjectKeyword);
        setLoading(true);
        setError(null);

        try {
            if (subjectKeyword === '') {
                console.log('Empty subjectKeyword, clearing lists');
                setCourseList([]);
                setFilteredCourses([]);
                setLoading(false);
                return;
            }

            const q = query(
                coursesRef,
                where('subject', '>=', subjectKeyword),
                where('subject', '<=', subjectKeyword + '\uf8ff'),
                limit(300)
            );
            const data = await getDocs(q);
            const coursesArray = data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Course[];
            setCourseList(coursesArray);
            filterCourses(coursesArray, keyword);

        } catch (error) {
            console.error(error);
            setError('Failed to fetch courses. Please try again.');

        } finally {
            setLoading(false);
        }
    };

    const debounceFetch = useCallback(
        debounce((value: string) => {
            if (value.trim()) {
                console.log('debounceFetch called with:', value);
                const subjectKeyword = value.split(' ')[0];
                getCourses(subjectKeyword);
            }
        }, 500),
        []
    );

    const debounceFilter = useCallback(
        debounce((courses: Course[], keyword: string) => {
            console.log('debounceFilter called with:', keyword);
            const filtered = courses.filter((course) => {
                const courseString = `${course.subject} ${course.courseNumber}`;
                return courseString.startsWith(keyword);
            });
            setFilteredCourses(filtered);
        }, 500),
        []
    );
    const filterCourses = (courses: Course[], keyword: string) => {
        console.log('filterCourses called with:', keyword);
        const filtered = courses.filter((course) => {
            const courseString = `${course.subject} ${course.courseNumber}`;
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
            setCourseList([]);
            setFilteredCourses([]);
        } else {
            debounceFetch(formattedInput);
        }
    }, [debounceFetch]);

    useEffect(() => {
        if (courseList.length > 0) {
            debounceFilter(courseList, keyword || '');
        }
    }, [keyword, courseList]);

    const memoizedCourses = useMemo(() => filteredCourses, [filteredCourses]);

    console.log(courseList);

    return (
        <div className='w-2/5'>
            <div className='flex border-black h-16 m-4 flex-col'>
                <input
                    type='text'
                    ref={inputRef}
                    placeholder='+ XXX 0000'
                    value={keyword || ''}
                    onChange={handleChangeKeyword}
                    style={{ textTransform: 'uppercase' }}
                    className='w-1/2 bg-gray-500 h-full rounded'
                />
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {!loading && memoizedCourses.length === 0 && keyword && !error && (
                    <p>No courses found matching '{keyword}'</p>
                )}
            </div>


            <div className='flex flex-col items-start m-4'>
                <div>
                    <label htmlFor="deliveryMode">Delivery Mode: </label>
                    <select id="deliveryMode">
                        <option>Asynchronous Online Instruct</option>
                        <option>Face to Face - Instruction</option>
                        <option>Hybird/Partially Online</option>
                        <option>Synchronous Online</option>

                    </select>               
                </div>

                <div>
                    <label htmlFor="campus">Campus: </label>
                    <select name="" id="">
                        <option>Alpharetta</option>
                        <option>Clarkston</option>
                        <option>Decatur</option>
                        <option>Dunwoody</option>
                        <option>Newton</option>
                        <option>Atlanta</option>
                    </select>
                </div>

            </div>

            

            <div className="flex flex-col items-start space-y-4 m-4">
                {memoizedCourses.map((course) => (
                    <div key={course.id} className='bg-emerald-400 shadow-md rounded-lg w-120 p-4 flex flex-col items-start'>
                        <p className="font-semibold">{course.subject} {course.courseNumber}</p>
                        <p>{course.title}</p>
                        <p>Class Type: {course.classType}</p>
                        <p>Time: {course.time}</p>
                        <p>Location: {course.building}, Room: {course.room}</p>
                        <p>Campus: {course.campus}</p>
                        <p>Instructor: {course.instructor ? course.instructor: 'TBA'}</p>
                        <p>Lab Time: {course.labDay ? course.labDay : 'N/A'}</p>
                    </div>
                ))}
            </div>

            
        </div>
    );
};
