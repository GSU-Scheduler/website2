import React, { useState } from "react";
import Select, { MultiValue } from "react-select";
import "../index.css";
import Map from "../components/Map";
import BasicCalendar from "../components/BasicCalendar";
import ColorSelector from "../components/ColorSelector";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CourseAdd } from "../components/CourseAdd";
import { getDocs, collection, query, where, limit } from "firebase/firestore";
import { db } from "../config/firebase";
import { useRef, ChangeEvent, useCallback, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import TimeInput from "../TimeInput";
import dayjs from "dayjs";
import { useColor } from "../components/ColorContext";

export interface Course {
  building: string;
  campus: string;
  classType: string;
  courseNumber: number;
  days: string;
  endingTime: string;
  hours: number;
  id: string;
  primaryInstructor: string;
  room: number;
  startingTime: string;
  subject: string;
  time: string;
  title: string;
}

interface Option {
  value: string;
  label: string;
}

// interface Event {
//   id: number;
//   title: string;
//   days: Option[];
//   startTime: string;
//   endTime: string;
// }
interface Event {
  id: number;
  title: string;
  days: Option[];
  start: Object;
  end: Object;
}

const Home: React.FC = () => {
  const { color, setColor } = useColor();

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const [showColorSelector, setShowColorSelector] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#9b59b6");
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState({
    hour: "",
    minute: "",
    period: "AM",
  });
  const [endTime, setEndTime] = useState({
    hour: "",
    minute: "",
    period: "AM",
  });

  const handleSelectColor = (color: string) => {
    console.log("Selected color:", color);
    // Add logic to update the course color or perform other actions
  };

  const handlePresetColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  // Function to handle color selection from the color wheel
  const handleColorWheelChange = (color: any) => {
    setSelectedColor(color.hex);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !title ||
      !days_events.length ||
      !startTime.hour ||
      !startTime.minute ||
      !startTime.period ||
      !endTime.hour ||
      !endTime.minute ||
      !endTime.period
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // Convert 12-hour time to 24-hour time
    const convertTo24Hour = (time: {
      hour: string;
      minute: string;
      period: string;
    }) => {
      let hour = parseInt(time.hour, 10);
      const minute = time.minute;

      if (time.period === "PM" && hour !== 12) {
        hour += 12;
      } else if (time.period === "AM" && hour === 12) {
        hour = 0;
      }

      return { hour: hour.toString().padStart(2, "0"), minute };
    };

    const start24HourTime = convertTo24Hour(startTime);
    const end24HourTime = convertTo24Hour(endTime);

    // Log the title and selected days
    console.log("Title:", title);
    console.log("Days:", days_events);

    // Convert day string to day number
    const getDayNumber = (day: string) => {
      switch (day) {
        case "Monday":
          return 1;
        case "Tuesday":
          return 2;
        case "Wednesday":
          return 3;
        case "Thursday":
          return 4;
        case "Friday":
          return 5;
        default:
          return 1;
      }
    };

    // Create an event for each selected day
    const newEvents = days_events.map((day) => {
      return {
        id: events.length + 1,
        title: title,
        days: [day], // Each event will have one day
        start: dayjs(
          `${start24HourTime.hour}:${start24HourTime.minute}`,
          "HH:mm"
        )
          .day(getDayNumber(day.value))
          .toDate(),
        end: dayjs(`${end24HourTime.hour}:${end24HourTime.minute}`, "HH:mm")
          .day(getDayNumber(day.value))
          .toDate(),
        isDraggable: true,
      };
    });

    console.log("New Events:", newEvents); // Log the new events array

    setEvents([...events, ...newEvents]);

    // Reset form fields after submission
    setTitle("");
    setDaysEvents([]);
    setStartTime({ hour: "", minute: "", period: "AM" });
    setEndTime({ hour: "", minute: "", period: "AM" });
  };

  const handleCourseClick = (course: Course) => {
    console.log("Course clicked:", course);
    setSelectedCourse(course);
    setShowColorSelector(true);

    if (course.time === "N/A - N/A") {
      alert("There isn't a time period yet for this course.");
      return; // Exit the function if time is not available
    }

    const getDayNumber = (day: string) => {
      switch (day) {
        case "Monday":
          return 1;
        case "Tuesday":
          return 2;
        case "Wednesday":
          return 3;
        case "Thursday":
          return 4;
        case "Friday":
          return 5;
        default:
          return 1;
      }
    };

    const findOption = (day: string): Option | undefined => {
      return dayOptions.find((option) => option.value === day);
    };

    const daysArray = course.days.split(",").map((day) => day.trim());

    const newEvents = daysArray
      .map((day) => {
        const dayOption = findOption(day);
        if (!dayOption) {
          console.warn(`Day ${day} not found in dayOptions`);
          return null;
        }

        const newEvent = {
          id: events.length + 1, // Generate a unique ID for new events
          title: course.title,
          days: [dayOption], // Each event will have one day as an Option
          start: dayjs(course.startingTime, "HH:mm") // Use the existing time format
            .day(getDayNumber(day))
            .toDate(),
          end: dayjs(course.endingTime, "HH:mm") // Use the existing time format
            .day(getDayNumber(day))
            .toDate(),
          isDraggable: false,
        };

        // Check for time overlap with existing events
        const isOverlapping = events.some((existingEvent) => {
          return (
            existingEvent.days.some(
              (existingDay) => existingDay.value === day
            ) &&
            ((newEvent.start >= existingEvent.start &&
              newEvent.start < existingEvent.end) ||
              (newEvent.end > existingEvent.start &&
                newEvent.end <= existingEvent.end))
          );
        });

        if (isOverlapping) {
          alert(
            `The course "${course.title}" overlaps with an existing course.`
          );
          return null; // Cancel adding this event
        }

        return newEvent;
      })
      .filter((event) => event !== null) as Event[]; // Filter out null values and assert type

    console.log("New Events:", newEvents);

    setEvents([...events, ...newEvents]);
  };

  const coursesRef = collection(db, "course2024");

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
      filterCourses(coursesArray, subjectKeyword);
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
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>(
    []
  );
  const [showCourses, setShowCourses] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [CRN, setCRN] = useState<string[]>([""]);
  const [selectedDeliveryModes, setSelectedDeliveryModes] = useState<
    MultiValue<Option>
  >([]);
  const [selectedCampus, setSelectedCampus] = useState<string>("");

  const [days_events, setDaysEvents] = useState<MultiValue<Option>>([]);

  const options: Option[] = [
    { value: "face-to-face", label: "Face to Face" },
    { value: "online-asynchronous", label: "Online Asynchronous" },
    { value: "online-synchronous", label: "Online Synchronous" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const dayOptions: Option[] = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
  ];

  const handleDaysChange = (selected: MultiValue<Option>) => {
    setDaysEvents(selected);
  };

  const handleChange = (selected: MultiValue<Option>) => {
    setSelectedOptions(selected);
  };

  const handleCRNChange = (index: number, value: string) => {
    const newCRN = [...CRN];
    newCRN[index] = value;
    setCRN(newCRN);
  };

  const addCRNField = () => {
    if (CRN.length < 6) {
      setCRN([...CRN, ""]);
    }
  };

  const removeCRNField = (index: number) => {
    const newCRN = CRN.filter((_, i) => i !== index);
    setCRN(newCRN);
  };

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
  };

  const handleDeliveryModeChange = (selected: MultiValue<Option>) => {
    setSelectedDeliveryModes(selected);
  };

  const handleCampusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCampus(e.target.value);
  };

  const formatTime = (hour: number): string => {
    if (hour === 12) {
      return "12 PM";
    } else if (hour === 24 || (hour >= 13 && hour <= 23)) {
      return `${hour - 12} PM`;
    } else {
      return `${hour} AM`;
    }
  };

  return (
    <main className="flex bg-zinc-800 text-zinc-50 min-h-[85dvh]">
      <div className="w-1/6 flex flex-col py-1">
        <div className="overflow-y-auto">
          <div className="">
            <div className="flex justify-center w-full mb-4 shadow-lg rounded-lg text-xs">
              <button
                className={`px-2 py-3 w-1/2 rounded-l-lg border-y border-l ${
                  showCourses
                    ? "bg-zinc-50 text-zinc-900 font-medium"
                    : "bg-zinc-200 text-zinc-400 shadow-inner"
                }`}
                onClick={() => setShowCourses(true)}
              >
                Courses
              </button>
              <button
                className={`px-2 py-3 w-1/2 rounded-r-lg border-y border-r ${
                  !showCourses
                    ? "bg-zinc-50 text-zinc-900 font-medium"
                    : "bg-zinc-200 text-zinc-400 shadow-inner"
                }`}
                onClick={() => setShowCourses(false)}
              >
                Events
              </button>
            </div>
            {!showCourses && (
              <div className="mb-8">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="title" className="block mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="ex. Piano Lessons"
                      className="w-full bg-transparent outline-none text-zinc-50 p-2 border-b shadow"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div> 
                  <div className="mb-4">
                    <label htmlFor="days_events" className="block mb-2">
                      Days
                    </label>
                    <Select
                      isMulti
                      value={days_events}
                      onChange={handleDaysChange}
                      options={dayOptions}
                      className=""
                      classNamePrefix="select"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          backgroundColor: "",
                          borderColor: "",
                          color: "#",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          backgroundColor: state.isSelected
                            ? ""
                            : "",
                          color: "#18181b",
                          "&:hover": {
                            backgroundColor: "#d4d4d8",
                          },
                        }),
                        multiValue: (provided) => ({
                          ...provided,
                          backgroundColor: "#fafafa",
                          color: "#18181b",
                        }),
                        multiValueLabel: (provided) => ({
                          ...provided,
                          color: "#18181b",
                        }),
                        multiValueRemove: (provided) => ({
                          ...provided,
                          color: "#18181b",
                          "&:hover": {
                            backgroundColor: "#FF0000",
                            color: "#fff",
                          },
                        }),
                      }}
                    />
                  </div>
                  <div className="mb-8">
                    <TimeInput
                      label="Start Time"
                      time={startTime}
                      setTime={setStartTime}
                    />
                    <TimeInput
                      label="End Time"
                      time={endTime}
                      setTime={setEndTime}
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow w-full transition-colors duration-300"
                  >
                    Add Event
                  </button>
                </form>
              </div>
            )}
            {showCourses && (
              <>
                <div>
                  <input
                    type="text"
                    ref={inputRef}
                    placeholder="+ XXX 0000"
                    value={keyword || ""}
                    onChange={handleChangeKeyword}
                    style={{ textTransform: "uppercase" }}
                    className="outline-none w-full bg-transparent border-b p-2 placeholder-zinc-500"
                  ></input>
                  {loading && <p>Loading...</p>}
                  {error && <p>{error}</p>}
                  {!loading &&
                    memoizedCourses.length === 0 &&
                    keyword &&
                    !error && <p>No courses found matching '{keyword}'</p>}
                </div>

                <div
                  className="flex flex-col items-center space-y-4 overflow-y-auto mt-2"
                  style={{ maxHeight: "400px" }}
                >
                  {memoizedCourses.slice(0, 10).map((course) => (
                    <div
                      key={course.id}
                      className="bg-zinc-50 text-zinc-900 shadow rounded-lg text-sm w-full p-1"
                      style={{
                        width: "", // Set the width in pixels as needed
                        padding: "", // Optional, padding is already set by p-4, but you can adjust as needed
                        margin: "",
                        cursor: "pointer", // Change cursor to indicate it's clickable
                      }}
                      onClick={() => handleCourseClick(course)} // Add onClick handler here
                    >
                      <p className="font-medium">
                        {course.subject} {course.courseNumber} - {course.hours}{" "}
                        credits
                      </p>
                      <p className="text-xs">{course.title}</p>
                      <p className="text-xs">
                        {course.days}- {course.time}
                      </p>
                      <p className="text-xs">Building: {course.building}</p>
                      <p className="text-xs">Campus: {course.campus}</p>
                      <p className="text-xs">
                        Instructor: {course.primaryInstructor}
                      </p>
                    </div>
                  ))}
                </div>

                {showColorSelector && (
                  <div className="mt-4 items-center justify-center">
                    <ColorSelector />
                  </div>
                )}

                <div className="">
                  <label htmlFor="deliveryMode" className="block mt-2 mb-2">
                    Delivery Mode
                  </label>
                  <Select
                    isMulti
                    value={selectedDeliveryModes}
                    onChange={handleDeliveryModeChange}
                    options={options}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        backgroundColor: "",
                        color: "",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                          ? ""
                          : "",
                        color: "#18181b",
                        "&:hover": {
                          backgroundColor: "#d4d4d8",
                        },
                      }),
                      multiValue: (provided) => ({
                        ...provided,
                        backgroundColor: "#fafafa",
                        color: "#18181b",
                      }),
                      multiValueLabel: (provided) => ({
                        ...provided,
                        color: "#18181b",
                      }),
                      multiValueRemove: (provided) => ({
                        ...provided,
                        color: "#18181b",
                        "&:hover": {
                          backgroundColor: "#FF0000",
                          color: "#fff",
                        },
                      }),
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className="block mt-4 mb-2">Campus</label>
                  <select
                    value={selectedCampus}
                    onChange={handleCampusChange}
                    className="outline-none block w-full bg-zinc-800 text-zinc-50 p-2 rounded border"
                  >
                    <option value="Atlanta">Atlanta</option>
                    <option value="Alpharetta">Alpharetta</option>
                    <option value="Clarkston">Clarkston</option>
                    <option value="Decatur">Decatur</option>
                    <option value="Dunwoody">Dunwoody</option>
                    <option value="Newton">Newton</option>
                  </select>
                </div>

                <div className="">
                  {CRN.map((crn, index) => (
                    <div key={index} className="flex mb-4">
                      <input
                        type="text"
                        value={crn}
                        onChange={(e) => handleCRNChange(index, e.target.value)}
                        className="w-full bg-transparent border-b text-zinc-50 placeholder-zinc-500 outline-none p-2 flex-grow justify-center items-center"
                        placeholder="+ CRN"
                      />
                      {CRN.length > 1 && (
                        <button
                          onClick={() => removeCRNField(index)}
                          className="bg-red-500 text-zinc-900 px-4 py-2 rounded-lg"
                        >
                          -
                        </button>
                      )}
                    </div>
                  ))}
                  {CRN.length < 6 && (
                    <button
                      onClick={addCRNField}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow w-full transition-colors duration-300"
                    >
                      Add Another CRN
                    </button>
                  )}
                </div>

                <div className="">
                  <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg shadow mt-2 w-full transition-colors duration-300">
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-y-auto">
        <div className="flex">
          <div className="w-3/4 text-black mx-4">
            <div className="flex justify-center">
              <BasicCalendar calendarEvents={events} />
            </div>
            <div className="grid grid-cols-6 gap-4 justify-items-center"></div>
          </div>
          <div className="w-1/4 rounded-3xl shadow">
            <Map />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
