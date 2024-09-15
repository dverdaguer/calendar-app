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
  id: number;
  setEventDay: React.Dispatch<React.SetStateAction<string>>;
  setEventId: React.Dispatch<React.SetStateAction<number>>;
  eventItems: { events: never[] };
}

const PopUp = ({ setEventDay, day, id, setEventId, eventItems }: Props) => {
  const [data, setData] = useState({
    date: day,
    endDate: "",
    repeatable: [-1],
    event: "",
    note: "",
    endTime: "",
    startTime: "",
  });

  const parsedEvents = eventItems as EventList;

  if (id > -1 && !data.event) {
    const idx = parsedEvents.events.findIndex((item) => item.id == id);
    if (idx > -1) setData(parsedEvents.events[idx]);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Parse data
    const event = data as Event;
    event.id = parsedEvents.events.length + 1;
    event.deleted = [];
    if (id > -1) {
      event.id = id;
      const idx = parsedEvents.events.findIndex((item) => item.id == id);
      parsedEvents.events[idx] = event;
      setEventId(-1);
    } else {
      parsedEvents.events.push(event);
    }
    const json = JSON.stringify(parsedEvents, null, 2);

    // Save to local storage
    localStorage.setItem("eventData", json);

    // Close the Popup
    setEventDay("");
  }

  function handleDelete(): void {
    const idx = parsedEvents.events.findIndex((item) => item.id == id);
    if (parsedEvents.events[idx].repeatable.length == 1) {
      parsedEvents.events[idx].id = -2; // Safe way to 'delete' item
    }
    parsedEvents.events[idx].deleted.push(day);
    setEventDay("");
    setEventId(-1);
  }

  function handleDeleteAll(): void {
    const idx = parsedEvents.events.findIndex((item) => item.id == id);
    parsedEvents.events[idx].id = -2; // Safe way to 'delete' item
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
                  onClick={() => {
                    const { repeatable, ...rest } = data;
                    const search = repeatable.indexOf(index);
                    if (search > -1) {
                      repeatable.splice(search, 1);
                    } else {
                      repeatable.push(index);
                    }
                    setData({ repeatable: repeatable, ...rest });
                  }}
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
