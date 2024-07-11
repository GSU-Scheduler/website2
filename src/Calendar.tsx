import {
  Calendar as BigCalendar,
  CalendarProps,
  dayjsLocalizer,
} from "react-big-calendar";
import dayjs from "dayjs";

const localizer = dayjsLocalizer(dayjs);

export default function Calendar(props: Omit<CalendarProps, "localizer">) {
  return <BigCalendar {...props} localizer={localizer} />;
}
