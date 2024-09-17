import "./styles/general.css";
import Calendar from "./components/Calendar";
import PopUp from "./components/PopUp";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import { EventList } from "./datatypes";

function App() {
  const [addEventDay, setEventDay] = useState("");
  const [eventId, setEventId] = useState(-1);
  const [currentDay, setCurrentDay] = useState(new Date());
  const [eventItems, setEvents] = useState<EventList>({
    events: [],
  });

  useEffect(() => {
    const items = localStorage.getItem("eventData");
    if (items) {
      setEvents(JSON.parse(items));
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
          setEvents={setEvents}
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
