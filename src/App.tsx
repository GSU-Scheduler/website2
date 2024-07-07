import React from "react";
import { useState } from "react";
import Select, { MultiValue } from "react-select";
import "./index.css";
import Map from "./components/Map";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Auth";
import BasicCalendar from "./components/BasicCalendar";

interface Option {
  value: string;
  label: string;
}

interface Event {
  id: number;
  title: string;
  day: string;
  startHour: number;
  endHour: number;
}

const App: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<MultiValue<Option>>(
    []
  );
  const [showCourses, setShowCourses] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  const options: Option[] = [
    { value: "face-to-face", label: "Face to Face" },
    { value: "online-asynchronous", label: "Online Asynchronous" },
    { value: "online-synchronous", label: "Online Synchronous" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const handleChange = (selected: MultiValue<Option>) => {
    setSelectedOptions(selected);
  };

  const addEvent = (event: Event) => {
    setEvents([...events, event]);
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
    <div className="h-full bg-zinc-800">
      <div className="flex items-center min-h-[900px] justify-center h-screen">
        <BasicCalendar />
      </div>
    </div>
  );
  {
    /*  
    <div className="flex h-90 bg-background text-gray-200">
      <div className="w-1/6 bg-sidebar p-4 text-gray-200">
        <div className="mb-8">
          <div className="mb-8 logo-container">
            <img
              src={require("./logo.png")}
              alt="Logo"
              className="mb-4 small-logo"
            />
          </div>
          <ul className="flex space-x-4 mb-8">
            <li>
              <button
                className={`block p-2 rounded ${
                  showCourses ? "bg-gray-700" : "bg-gray-500"
                }`}
                onClick={() => setShowCourses(true)}
              >
                Courses
              </button>
            </li>
            <li>
              <button
                className={`block p-2 rounded ${
                  !showCourses ? "bg-gray-700" : "bg-gray-500"
                }`}
                onClick={() => setShowCourses(false)}
              >
                Events
              </button>
            </li>
          </ul>
          {!showCourses && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Add Event</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const title = formData.get("title") as string;
                  const day = formData.get("day") as string;
                  const startHour = parseInt(
                    formData.get("startHour") as string
                  );
                  const endHour = parseInt(formData.get("endHour") as string);
                  addEvent({
                    id: events.length + 1,
                    title,
                    day,
                    startHour,
                    endHour,
                  });
                  e.currentTarget.reset();
                }}
              >
                <div className="mb-4">
                  <label htmlFor="title" className="block mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full bg-gray-700 text-white p-2 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="day" className="block mb-2">
                    Day
                  </label>
                  <select
                    id="day"
                    name="day"
                    className="w-full bg-gray-700 text-white p-2 rounded"
                    required
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="startHour" className="block mb-2">
                    Start Hour
                  </label>
                  <input
                    type="number"
                    id="startHour"
                    name="startHour"
                    min="8"
                    max="19"
                    className="w-full bg-gray-700 text-white p-2 rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="endHour" className="block mb-2">
                    End Hour
                  </label>
                  <input
                    type="number"
                    id="endHour"
                    name="endHour"
                    min="9"
                    max="20"
                    className="w-full bg-gray-700 text-white p-2 rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                  Add Event
                </button>
              </form>
            </div>
          )}
          {showCourses && (
            <>
              <div className="mb-8">
                <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4">
                  Add CRN...
                </button>
                <label className="block mb-2">Delivery Mode</label>
                <Select
                  isMulti
                  value={selectedOptions}
                  onChange={handleChange}
                  options={options}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      backgroundColor: "#4A4A4A",
                      borderColor: "#4A4A4A",
                      color: "#fff",
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? "#6B7280" : "#4A4A4A",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#6B7280",
                      },
                    }),
                    multiValue: (provided) => ({
                      ...provided,
                      backgroundColor: "#6B7280",
                      color: "#fff",
                    }),
                    multiValueLabel: (provided) => ({
                      ...provided,
                      color: "#fff",
                    }),
                    multiValueRemove: (provided) => ({
                      ...provided,
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#FF0000",
                        color: "#fff",
                      },
                    }),
                  }}
                />
                <label className="block mt-4 mb-2">Campus</label>
                <select className="block w-full bg-gray-700 p-2 rounded">
                  <option>Atlanta</option>
                  <option>Alpharetta</option>
                  <option>Clarkston</option>
                  <option>Decatur</option>
                  <option>Dunwoody</option>
                  <option>Newton</option>
                </select>
              </div>
              <div className="mt-8 space-y-4">
                <button className="block p-2 bg-gray-700 rounded w-full">
                  Send Feedback
                </button>
                <button className="block p-2 bg-gray-700 rounded w-full">
                  GitHub
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <button className="bg-blue-500 text-white px-3 py-2 rounded">
              Share Schedule
            </button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded">
              Export
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <select className="bg-gray-700 text-white px-4 py-2 rounded">
              <option value="spring2024">Spring 2024</option>
            </select>
            <select className="bg-gray-700 text-white px-4 py-2 rounded">
              <option value="primary">Primary</option>
            </select>
            <button className="bg-gray-700 text-white px-4 py-2 rounded">
              ?
            </button>
          </div>
        </header>
        <div className="flex">
          <div className="w-3/4 bg-white text-black p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">0 Credits</h2>
              <div className="flex items-center flex-grow space-x-2 justify-center">
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                  {"<"}
                </button>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                  Spring Semester
                </button>
                <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                  {">"}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-4 justify-items-center">
              <div className="col-span-1"></div>
              <div className="col-span-1 text-center font-bold">Monday</div>
              <div className="col-span-1 text-center font-bold">Tuesday</div>
              <div className="col-span-1 text-center font-bold">Wednesday</div>
              <div className="col-span-1 text-center font-bold">Thursday</div>
              <div className="col-span-1 text-center font-bold">Friday</div>
              {Array.from({ length: 12 }, (_, hour) => (
                <React.Fragment key={hour}>
                  <div className="col-span-1 border border-gray-300 h-16">
                    <div className="flex justify-center items-center h-full">
                      {formatTime(hour + 8)}
                    </div>
                  </div>
                  <div className="col-span-1 border border-gray-300 h-16">
                    {events.map((event) =>
                      event.day === "Monday" && event.startHour === hour + 8 ? (
                        <div
                          key={event.id}
                          className="h-full bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          {event.title}
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className="col-span-1 border border-gray-300 h-16">
                    {events.map((event) =>
                      event.day === "Tuesday" &&
                      event.startHour === hour + 8 ? (
                        <div
                          key={event.id}
                          className="h-full bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          {event.title}
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className="col-span-1 border border-gray-300 h-16">
                    {events.map((event) =>
                      event.day === "Wednesday" &&
                      event.startHour === hour + 8 ? (
                        <div
                          key={event.id}
                          className="h-full bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          {event.title}
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className="col-span-1 border border-gray-300 h-16">
                    {events.map((event) =>
                      event.day === "Thursday" &&
                      event.startHour === hour + 8 ? (
                        <div
                          key={event.id}
                          className="h-full bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          {event.title}
                        </div>
                      ) : null
                    )}
                  </div>
                  <div className="col-span-1 border border-gray-300 h-16">
                    {events.map((event) =>
                      event.day === "Friday" && event.startHour === hour + 8 ? (
                        <div
                          key={event.id}
                          className="h-full bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          {event.title}
                        </div>
                      ) : null
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="w-1/4 bg-gray-300 p-4 rounded-lg shadow-lg ml-4">
            <Map />
          </div>
        </div>
      </div>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
    */
  }
};

export default App;
