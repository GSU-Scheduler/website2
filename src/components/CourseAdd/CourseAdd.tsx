import { getDocs, collection, query, where, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useState, useRef, ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { Course } from '../../types';
import styles from './CourseAdd.module.css';
import { CAMPUSES, DELIVERY_MODES } from '../../constants';
import {CourseFilter} from '../CourseFilter/CourseFilter';

export const CourseAdd = () => {
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const coursesRef = collection(db, 'subjects2024');

    const getCourses = async (subjectKeyword: string) => {
        try {
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
        <div className={styles.container}>
            <div className=''>
                <div>
                    <input
                        type='text'
                        ref={inputRef}
                        placeholder='+ XXX 0000'
                        value={keyword || ''}
                        onChange={handleChangeKeyword}
                        style={{ textTransform: 'uppercase' }}
                        className=''
                    />

                </div>

                {[
                    ['Delivery Mode', 'deliveryMode', DELIVERY_MODES] as const,
                    ['Campus', 'campus', CAMPUSES] as const,
                    ].map(([name, property, labels]) => (
                    <CourseFilter
                        key={property}
                        // name={name}
                        // labels={labels}
                        // selectedTags={filter[property]}
                        // onReset={(): void => handleResetFilter(property)}
                        // onToggle={(tag): void => handleToggleFilter(property, tag)}
                    />
                    ))}
               
            </div>

            {/* <div className=''>
                <div>
                    <label htmlFor="deliveryMode">Delivery Mode: </label>
                    <select id="deliveryMode">
                        <option>Asynchronous Online Instruct</option>
                        <option>Face to Face - Instruction</option>
                        <option>Hybrid/Partially Online</option>
                        <option>Synchronous Online</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="campus">Campus: </label>
                    <select id="campus">
                        <option>Alpharetta</option>
                        <option>Clarkston</option>
                        <option>Decatur</option>
                        <option>Dunwoody</option>
                        <option>Newton</option>
                        <option>Atlanta</option>
                    </select>
                </div>
            </div> */}


            <div className="">
                {memoizedCourses.map((course) => (
                    <div key={course.ids} className='bg-emerald-400 shadow-md rounded-lg w-120 p-4 flex flex-col items-start'>
                        <p className="font-semibold">{course.subject_course}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
