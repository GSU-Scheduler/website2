import React, { useState } from "react";
import dayjs from "dayjs";
import { dayjsLocalizer, dateFnsLocalizer } from "react-big-calendar";
import Calendar from "../Calendar";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./BasicCalendar.css";
import { ReactElement, JSXElementConstructor, ReactNode } from "react";
import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useColor } from "../components/ColorContext";

// drag and drop functionality
const DnDCalendar = withDragAndDrop(Calendar);

const localizer = dayjsLocalizer(dayjs);
dayjs.extend(customParseFormat);

// To add events:
// Array of event objects with start time, end time, and title.
// Calendar receives events prop
// TODO: event state

type BasicCalendarProps = {
  calendarEvents: Array<Object>;
};

// const events = [
//   {
//     // first way of parsing times using dayjs
//     start: dayjs().day(1).hour(12).minute(15).toDate(),
//     end: dayjs().day(1).hour(14).minute(45).toDate(),
//     title: "CSC 3520",
//     data: {
//       type: "Course",
//       time: "M/W 12:15 - 2:45",
//       credit: 4,
//       instructor: "John Doe",
//       campus: "Atlanta",
//       location: "Petit Science Center",
//     },
//     isDraggable: false,
//   },
//   {
//     start: dayjs().day(3).hour(12).minute(15).toDate(),
//     end: dayjs().day(3).hour(14).minute(45).toDate(),
//     title: "CSC 3520",
//     data: {
//       type: "Course",
//       time: "M/W 12:15 - 2:45",
//       credit: 4,
//       instructor: "John Doe",
//       campus: "Atlanta",
//       location: "Petit Science Center",
//     },
//     isDraggable: false,
//   },
//   {
//     // second way of parsing times using dayjs
//     start: dayjs("9:30", "H:m").day(2).toDate(),
//     end: dayjs("12:00", "H:m").day(2).toDate(),
//     title: "Football Practice",
//     data: {
//       type: "Event",
//       time: "9:30AM - 12:00PM",
//       credit: undefined,
//     },
//     isDraggable: true,
//   },
//   {
//     start: dayjs("8:20", "H:m").day(4).toDate(),
//     end: dayjs("9:20", "H:m").day(4).toDate(),
//     title: "Guitar Lessons",
//     data: {
//       type: "Event",
//       time: "8:20AM - 9:20AM",
//       credit: undefined,
//     },
//     isDraggable: true,
//   },
// ];

// TODO later: Transfer to individual CourseEvent.tsx and UserEvent.tsx components
// separate prop types to type object
const components = {
  event: (props: {
    title:
      | string
      | number
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | null
      | undefined;
    event: {
      start: Date;
      end: Date;
    };
  }) => {
    const { color } = useColor();

    const { title, event } = props;
    const startTime = dayjs(event.start).format("h:mm A");
    const endTime = dayjs(event.end).format("h:mm A");
    const eventType = "Event";
    switch (eventType) {
      // TODO later: Transfer to individual CourseEvent.tsx and UserEvent.tsx components
      case "Event":
        return (
          <div
            className="h-full p-2 bg-purple-50 rounded-xl border-4 text-black"
            style={{
              borderColor: color, // Apply the selected color here
            }}
          >
            <h2 className="font-medium">{props.title}</h2>
            <p className="font-light text-sm">{`${startTime} - ${endTime}`}</p>
            {/* <p className="font-light text-sm">{props.event.data.time}</p> */}
          </div>
        );
      // case "Course":
      //   return (
      //     <div className="h-full p-2 bg-orange-50 rounded-xl border-4 border-orange-500 text-black">
      //       <div className="bg-orange-500 max-w-fit p-1 rounded-lg text-white">
      //         <h2 className="font-medium">{props.title}</h2>
      //       </div>
      //       {/* <div className="py-1">
      //         <p className="font-light text-sm">{props.event.data.time}</p>
      //         <p className="font-light text-xs">
      //           Credits: {props.event.data.credit}
      //         </p>
      //         <p className="font-light text-xs">
      //           Instructor: {props.event.data.instructor}
      //         </p>
      //         <p className="font-light text-xs">
      //           Campus: {props.event.data.campus}
      //         </p>
      //         <p className="font-light text-xs">
      //           Location: {props.event.data.location}
      //         </p>
      //       </div> */}
      //     </div>
      //   );
      default:
        return null;
    }
  },
};

export default function BasicCalendar({ calendarEvents }: BasicCalendarProps) {
  return (
    <section className="flex flex-col w-[1200px] h-[769px] bg-gray-100 rounded-3xl overflow-hidden">
      <div className="flex p-6 justify-center items-center relative">
        <div className="absolute hidden sm:block left-0 ml-6 py-2 px-4 rounded-2xl text-xs border-2 shadow-md bg-transparent font-semibold">
          0 Credits
        </div>
        <button className="bg-gray-300 text-gray-700 px-2 rounded">
          {"<"}
        </button>
        <h2 className="font-semibold tracking-wide mx-4">Spring Semester</h2>
        <button className="bg-gray-300 text-gray-700 px-2 rounded">
          {">"}
        </button>
      </div>
      <div className="bg-gray-100 h-[100%]">
        <DnDCalendar
          events={calendarEvents}
          defaultView={"work_week"}
          views={["work_week"]}
          toolbar={false}
          formats={{
            dayFormat: (date) => dayjs(date).format("ddd"),
          }}
          min={dayjs("07:00", "H:m").toDate()}
          max={dayjs("21:00", "H:m").toDate()}
          components={components}
          draggableAccessor={(event) => event.isDraggable}
          resizable={true}
          localizer={localizer}
        />
      </div>
    </section>
  );
}
