import SwipeDeck from "./SwipeDeck";
import "./Discover.css";

export const Discover = () => {
  return (
    <div className="discoverPage">
      <h1 className="discoverTitle">🔥 Match Events</h1>
      <SwipeDeck />
    </div>
  );
};