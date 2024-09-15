import "./styles/general.css";
import Calendar from "./components/Calendar";
import PopUp from "./components/PopUp";
import Header from "./components/Header";
import { useState, useEffect } from "react";

function App() {
  const [addEventDay, setEventDay] = useState("");
  const [eventId, setEventId] = useState(-1);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [eventItems, setEvents] = useState({ events: [] });

  useEffect(() => {
    const items = localStorage.getItem("eventData");
    if (items) {
      setEvents(JSON.parse(items));
    } else {
      setEvents({ events: [] });
    }
  }, []);

  return (
    <>
      <Header setCurrentDay={setCurrentDay} setEventDay={setEventDay}></Header>
      {addEventDay !== "" && (
        <PopUp
          setEventDay={setEventDay}
          day={addEventDay}
          id={eventId}
          setEventId={setEventId}
          eventItems={eventItems}
        ></PopUp>
      )}
      <Calendar
        setEventDay={setEventDay}
        setCurrentDay={setCurrentDay}
        setEventId={setEventId}
        currentDay={currentDay}
        eventItems={eventItems}
      ></Calendar>
    </>
  );
}

export default App;
