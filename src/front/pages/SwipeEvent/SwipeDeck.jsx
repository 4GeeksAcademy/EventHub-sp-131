import { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import EventCard from "./EventCard";

const  SwipeDeck = () => {
  const [events, setEvents] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("tokenUser");

  useEffect(() => {
    if (!token) {
      console.error("No token found");
      return;
    }

    fetch(`${backendUrl}/api/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, [backendUrl, token]);

  // 👉 swipe handler
  const handleSwipe = async (direction, event) => {
    const liked = direction === "right";

    try {
      const res = await fetch(`${backendUrl}/api/swipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event_id: event.id,
          liked: liked,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error backend:", errorText);
        return;
      }

      // 🧠 quitar carta
      setEvents((prev) => prev.filter((e) => e.id !== event.id));

    } catch (error) {
      console.error("Error swipe:", error);
    }
  };

  return (
    <div className="tinderContainer">
      {events.length === 0 ? (
        <p>No hay más eventos 🎉</p>
      ) : (
        events.map((event) => (
          <TinderCard
            key={event.id}
            onSwipe={(dir) => handleSwipe(dir, event)}
            preventSwipe={["up", "down"]}
          >
            <EventCard event={event} />
          </TinderCard>
        ))
      )}
    </div>
  );
};

export default SwipeDeck;