import { getDocs, collection, query, where, limit } from "firebase/firestore";
import { db } from "../../config/firebase";
import {
  useState,
  useRef,
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import debounce from "lodash.debounce";

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
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const coursesRef = collection(db, "courses");

  const getCourses = async (subjectKeyword: string) => {
    console.log("getCourses called with:", subjectKeyword);
    setLoading(true);
    setError(null);

    try {
      if (subjectKeyword === "") {
        console.log("Empty subjectKeyword, clearing lists");
        setCourseList([]);
        setFilteredCourses([]);
        setLoading(false);
        return;
      }

      const q = query(
        coursesRef,
        where("subject", ">=", subjectKeyword),
        where("subject", "<=", subjectKeyword + "\uf8ff"),
        limit(300)
      );
      const data = await getDocs(q);
      const coursesArray = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Course[];
      setCourseList(coursesArray);
      filterCourses(coursesArray, keyword);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const debounceFetch = useCallback(
    debounce((value: string) => {
      if (value.trim()) {
        console.log("debounceFetch called with:", value);
        const subjectKeyword = value.split(" ")[0];
        getCourses(subjectKeyword);
      }
    }, 500),
    []
  );

  const debounceFilter = useCallback(
    debounce((courses: Course[], keyword: string) => {
      console.log("debounceFilter called with:", keyword);
      const filtered = courses.filter((course) => {
        const courseString = `${course.subject} ${course.courseNumber}`;
        return courseString.startsWith(keyword);
      });
      setFilteredCourses(filtered);
    }, 500),
    []
  );
  const filterCourses = (courses: Course[], keyword: string) => {
    console.log("filterCourses called with:", keyword);
    const filtered = courses.filter((course) => {
      const courseString = `${course.subject} ${course.courseNumber}`;
      return courseString.startsWith(keyword);
    });
    setFilteredCourses(filtered);
  };
  const handleChangeKeyword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let input = e.target.value.trim();
      console.log("handleChangeKeyword called with:", input);
      const results = /^([A-Z]+)(\d.*)$/i.exec(input);

      if (results != null) {
        const [, subject, number] = results as unknown as [
          string,
          string,
          string
        ];
        input = `${subject} ${number}`;
      }

      const formattedInput = input.toUpperCase();
      setKeyword(formattedInput);
      console.log("Formatted input:", formattedInput);

      if (formattedInput === "") {
        console.log("Input is empty, clearing lists");
        setCourseList([]);
        setFilteredCourses([]);
      } else {
        debounceFetch(formattedInput);
      }
    },
    [debounceFetch]
  );

  useEffect(() => {
    if (courseList.length > 0) {
      debounceFilter(courseList, keyword || "");
    }
  }, [keyword, courseList]);

  const memoizedCourses = useMemo(() => filteredCourses, [filteredCourses]);

  return (
    <div className="bg-blue-200 w-2/5">
      <div className="border-black">
        <input
          type="text"
          ref={inputRef}
          placeholder="+ XXX 0000"
          value={keyword || ""}
          onChange={handleChangeKeyword}
          style={{ textTransform: "uppercase" }}
          className="w-full bg-gray-500"
        />
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && memoizedCourses.length === 0 && keyword && !error && (
          <p>No courses found matching '{keyword}'</p>
        )}
      </div>

      <div className="flex flex-col items-center space-y-4">
        {memoizedCourses.map((course) => (
          <div
            key={course.id}
            className="bg-emerald-400 shadow-md rounded-lg w-80 p-4 flex flex-col items-start"
          >
            <p className="font-semibold">
              {course.subject} {course.courseNumber}
            </p>
            <p>{course.title}</p>
            <p>{course.time}</p>
            <p>{course.building}</p>
            <p>Campus: {course.campus}</p>
            <p>{course.instructor}</p>
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="deliveryMode">Delivery Mode</label>
        <select id="deliveryMode">
          <option>Art Signature Experience</option>
          <option>Asynchronous Online Instruct</option>
          <option>City Signature Experience</option>
          <option>Critical Thinking Through Writing</option>
          <option>EPIC Interdisciplinary Program</option>
          <option>Face to Face - Instruction</option>
          <option>Global Scholar</option>
          <option>FLC Bench Course</option>
          <option>Global Signature Experience</option>
          <option>Honors College</option>
          <option>Hybird/Partially Online</option>
          <option>Low Cost:$40 or under req cost</option>
          <option>No-cost $0 required costs</option>
          <option>Non-Freshman Learning Comm</option>
          <option>Panther Gateway Course</option>
          <option>PC Global Scholar</option>
          <option>Professional Signature Exp</option>
          <option>Research Signature Experience</option>
          <option>Service Signature Experience</option>
          <option>Synchronous Online</option>
          <option>Virtual Exchange Course</option>
          <option>Women Lead Program</option>
        </select>
      </div>

      <div>
        <p>Campus</p>
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
  );
};
