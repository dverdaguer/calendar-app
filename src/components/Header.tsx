import "../styles/header.css";
import "../styles/popup.css";

interface Props {
  setCurrentDay: React.Dispatch<React.SetStateAction<Date>>;
  setEventDay: React.Dispatch<React.SetStateAction<string>>;
}

const Header = ({ setCurrentDay, setEventDay }: Props) => {
  return (
    <div className="header">
      <input
        type="date"
        name="date"
        onChange={(e) => {
          setCurrentDay(new Date(e.target.value));
        }}
        className="date-picker"
      ></input>
      <button
        className="header-button"
        onClick={() => setCurrentDay(new Date())}
      >
        Go to today
      </button>
      <button className="header-button" onClick={() => setEventDay(" ")}>
        Add event
      </button>
      <button
        className="header-button"
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Clear events
      </button>
    </div>
  );
};

export default Header;
