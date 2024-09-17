/* eslint-disable @typescript-eslint/no-unused-vars */
import "../styles/popup.css";
import { useState } from "react";
import { Event, EventList } from "../datatypes";

const daysOfWeek = ["M", "T", "W", "Th", "F", "Sa", "Su"];
const eventOptions = [
  "Work",
  "Meeting",
  "Exercise",
  "Party",
  "Movie",
  "TV",
  "Reading",
];

interface Props {
  day: string;
  setEventDay: React.Dispatch<React.SetStateAction<string>>;
  id: number;
  setEventId: React.Dispatch<React.SetStateAction<number>>;
  eventItems: EventList;
  setEvents: React.Dispatch<React.SetStateAction<EventList>>;
}

const PopUp = ({
  setEventDay,
  day,
  id,
  setEventId,
  eventItems,
  setEvents,
}: Props) => {
  const [data, setData] = useState({
    date: day,
    endDate: "",
    repeatable: [-1],
    event: "",
    note: "",
    endTime: "",
    startTime: "",
    id: -1,
  });

  if (id > -1 && data.id == -1) {
    const idx = eventItems.events.findIndex((item) => item.id == id);
    if (idx > -1) setData(eventItems.events[idx]);
  }

  console.log(data);

  function saveToStorage(events: EventList): void {
    const json = JSON.stringify(events, null, 2);
    localStorage.setItem("eventData", json);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Parse data
    const event = data as Event;
    event.id = eventItems.events.length + 1;
    event.deleted = [];
    let updatedEvents: EventList;
    if (id > -1) {
      event.id = id;
      const idx = eventItems.events.findIndex((item) => item.id == id);
      updatedEvents = eventItems;
      updatedEvents.events[idx] = event;
      setEvents(updatedEvents);
      setEventId(-1);
    } else {
      updatedEvents = { events: [...eventItems.events, event] };
      setEvents(updatedEvents);
    }

    // Save to local storage
    saveToStorage(updatedEvents);

    // Close the Popup
    setEventDay("");
  }

  function handleDelete(): void {
    const idx = eventItems.events.findIndex((item) => item.id == id);
    const updatedEvents = eventItems;

    if (eventItems.events[idx].repeatable.length == 1) {
      updatedEvents.events[idx].id = -2; // Safe way to 'delete' item
    }

    updatedEvents.events[idx].deleted.push(day);
    saveToStorage(updatedEvents);
    setEvents(updatedEvents);
    setEventDay("");
    setEventId(-1);
  }

  function handleDeleteAll(): void {
    const idx = eventItems.events.findIndex((item) => item.id == id);
    const updatedEvents = eventItems;
    updatedEvents.events[idx].id = -2; // Safe way to 'delete' item

    saveToStorage(updatedEvents);
    setEvents(updatedEvents);
    setEventDay("");
    setEventId(-1);
  }

  return (
    <div className={`popup ${data.repeatable.length > 1 && "long"}`}>
      <form method="post" onSubmit={handleSubmit}>
        <button className="close-button" onClick={() => setEventDay("")}>
          X
        </button>
        <div className="date-row">
          <div className="date">
            <p className="date-text">{`Selected date: ${data.date}`}</p>
            <input
              type="date"
              name="date"
              defaultValue={day}
              onChange={(e) => {
                const { date, ...rest } = data;
                setData({ date: e.target.value, ...rest });
              }}
              className="date-picker"
            ></input>
          </div>
          <div className="repeatable">
            <p className="repeatable-text">
              Select repeatability of event, if applicable:
            </p>
            {daysOfWeek.map((item, index) => (
              <div className="checkbox" key={item}>
                <input
                  type="checkbox"
                  key={index}
                  name={`repeatable-${item}`}
                  className="repeatable-picker"
                  onChange={() => {
                    const { repeatable, ...rest } = data;
                    const search = repeatable.indexOf(index);
                    if (search > -1) {
                      repeatable.splice(search, 1);
                    } else {
                      repeatable.push(index);
                    }
                    setData({ repeatable: repeatable, ...rest });
                  }}
                  checked={data.repeatable.indexOf(index) > -1}
                ></input>
                <label htmlFor={`repeatable-${item}`}>{item}</label>
              </div>
            ))}
          </div>
          {data.repeatable.length > 1 && (
            <div className="date end">
              <p className="date-text">{`Selected end date: ${data.endDate}`}</p>
              <input
                type="date"
                name="date"
                defaultValue={day}
                onChange={(e) => {
                  const { endDate, ...rest } = data;
                  setData({ endDate: e.target.value, ...rest });
                }}
                className="date-picker"
              ></input>
            </div>
          )}
        </div>
        <div className="event-row">
          <div className="dropdown">
            <div className="drop-select">{`Event Type: ${
              data.event || "Select Event"
            }`}</div>
            <div className="dropdown-content">
              {eventOptions.map((item) => (
                <div
                  className="event-option"
                  key={item}
                  onClick={() => {
                    const { event, ...rest } = data;
                    setData({ event: item, ...rest });
                  }}
                >
                  {item}
                </div>
              ))}
              <input
                type="text"
                className="event-option"
                placeholder="Custom event"
                onChange={(e) => {
                  const { event, ...rest } = data;
                  setData({ event: e.target.value, ...rest });
                }}
              ></input>
            </div>
          </div>
          <input
            type="text"
            className="note-input"
            placeholder="Note:"
            defaultValue={data.note}
            onChange={(e) => {
              const { note, ...rest } = data;
              setData({ note: e.target.value, ...rest });
            }}
          ></input>
        </div>
        <div className="date-row time">
          <p>Enter a time range &#40;optional&#41;:</p>
          <input
            type="text"
            className="time-input"
            placeholder="Start"
            defaultValue={data.startTime}
            onChange={(e) => {
              const { startTime, ...rest } = data;
              setData({ startTime: e.target.value, ...rest });
            }}
          ></input>
          <input
            type="text"
            className="time-input"
            placeholder="End"
            defaultValue={data.endTime}
            onChange={(e) => {
              const { endTime, ...rest } = data;
              setData({ endTime: e.target.value, ...rest });
            }}
          ></input>
        </div>
        <button type="submit" className="submit-button">
          {id > -1 ? "Update Event" : "Add Event"}
        </button>
      </form>
      {id > -1 && (
        <>
          <button className="submit-button delete" onClick={handleDelete}>
            Delete Event
          </button>
          <button
            className="submit-button delete all"
            onClick={handleDeleteAll}
          >
            Delete All
          </button>
        </>
      )}
    </div>
  );
};

export default PopUp;
