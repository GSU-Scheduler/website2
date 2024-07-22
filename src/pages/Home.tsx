import MyCalendar from '../components/Calendar';
import { CourseAdd } from "../components/CourseAdd";

// const events = [
//     {
//         start: new Date(),
//         end: new Date(),
//         title: 'Some event',
//     },
// ];

export const Home = () => {
    return(
        <div className="max-w-8xl mx-auto p-4 flex">
            <div className='w-3/5'>
                <CourseAdd />
            </div>
            {/* <div className='w-3/5'>
                <h1 className="text-2xl font-bold mb-4">My Calendar</h1>
                <MyCalendar events={events} />
            </div> */}
            
        </div>
    )
};