import "../styles/calendar.css";
import { EventList, Event } from "../datatypes";

const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Props {
  setEventDay: React.Dispatch<React.SetStateAction<string>>;
  setEventId: React.Dispatch<React.SetStateAction<number>>;
  setCurrentDay: React.Dispatch<React.SetStateAction<Date>>;
  currentDay: Date;
  eventItems: { events: never[] };
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDates(
  offset: number = -1,
  today: Date = new Date()
): Array<number> {
  if (offset === -1) {
    // Find which day of the week current month starts on
    const dayOfMonth = today.getDate();
    const dayOfWeek = today.getDay();

    let offset = (dayOfWeek - ((dayOfMonth % 7) - 1)) % 7;
    if (offset < 0) offset += 7;
    return getDates(offset, today);
  } else {
    const month = today.getMonth();
    const monthLength =
      isLeapYear(today.getFullYear()) && month === 1 ? 29 : monthLengths[month];
    const datesArray = [];

    for (let i = 0; i < 42; i++) {
      if (i < offset || i > offset + monthLength - 1) {
        datesArray.push(-1);
      } else {
        datesArray.push(i - offset + 1);
      }
    }
    return datesArray;
  }
}

const Calendar = ({
  setEventDay,
  setCurrentDay,
  setEventId,
  currentDay,
  eventItems,
}: Props) => {
  const dates = getDates(-1, currentDay);

  const actualDate = new Date();
  const todayKey = new Date(
    actualDate.getFullYear() +
      "-" +
      (actualDate.getMonth() + 1) +
      "-" +
      actualDate.getDate()
  )
    .toISOString()
    .split("T")[0];

  const month = currentDay.getMonth();
  const year = currentDay.getFullYear();

  const parsedEvents = eventItems as EventList;
  console.log(parsedEvents);

  function filterEvents(date: string): Event[] {
    const events = parsedEvents.events.filter((item) => {
      const dayOfWeek = new Date(date).getDay();
      const rangeBool =
        item.date <= date && (!item.endDate || date <= item.endDate);
      const deleted = item.deleted.indexOf(date) > -1;

      return (
        (item.date == date && item.id > -2 && !deleted) ||
        (item.repeatable.indexOf(dayOfWeek) > -1 &&
          rangeBool &&
          item.id > -2 &&
          !deleted)
      );
    });

    return events;
  }

  return (
    <>
      <div className="calendar-header">{`${months[month]} ${year}`}</div>
      <div className="calendar">
        <button
          className="arrow-button"
          onClick={() => {
            if (currentDay.getDate() > 28) {
              setCurrentDay(new Date(currentDay.setDate(1))); // To avoid skipping a month
            }
            setCurrentDay(new Date(currentDay.setMonth(month - 1)));
          }}
        >
          &#8678;
        </button>
        <div className="grid-container">
          {daysOfWeek.map((item, index) => (
            <div className="grid-item day" key={index}>
              {item}
            </div>
          ))}
          {dates.map((item, index) => {
            const key = new Date(year + "-" + (month + 1) + "-" + item)
              .toISOString()
              .split("T")[0];

            return (
              <div
                className={`grid-item ${item == -1 && "inactive"} ${
                  key == todayKey && "current"
                }`}
                key={index}
                onClick={() =>
                  item !== -1 ? setEventDay(key) : setEventDay("")
                }
              >
                <div className="date-item" key={index}>
                  {item}
                </div>
                {filterEvents(key).map((event) => (
                  <div
                    key={`${event.id}-${key}`}
                    className={`event-item ${event.event.toLowerCase()}`}
                    onClick={() => {
                      setEventId(event.id);
                      setEventDay(key);
                    }}
                  >
                    <p className="event-title">
                      {event.event}
                      <span className="event-time">
                        {event.startTime && ` • ${event.startTime}`}
                        {event.endTime && ` - ${event.endTime}`}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <button
          className="arrow-button"
          onClick={() => {
            if (currentDay.getDate() > 28) {
              setCurrentDay(new Date(currentDay.setDate(1))); // To avoid skipping a month
            }
            setCurrentDay(new Date(currentDay.setMonth(month + 1)));
          }}
        >
          &#8680;
        </button>
      </div>
    </>
  );
};

export default Calendar;
