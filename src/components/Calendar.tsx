// components/Calendar.tsx
import React, { useState } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

interface MyCalendarProps {
    events: Event[];
}

const MyCalendar: React.FC<MyCalendarProps> = ({ events }) => {
    const [currentEvents, setCurrentEvents] = useState<Event[]>(events);

    const handleSelect = ({ start, end }: { start: Date; end: Date }) => {
        const title = window.prompt('New Event name');
        if (title) {
            setCurrentEvents([
                ...currentEvents,
                {
                    start,
                    end,
                    title,
                },
            ]);
        }
    };

    return (
        <div className="p-4">
            <Calendar
                localizer={localizer}
                events={currentEvents}
                selectable
                onSelectSlot={handleSelect}
                defaultView="month"
                style={{ height: '80vh' }}
                className="bg-white shadow-md rounded-lg p-4"
            />
        </div>
    );
};

export default MyCalendar;
