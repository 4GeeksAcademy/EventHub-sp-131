import { useEffect, useState } from "react";
import { getEventAssists, getEvents } from "../../services/userService";

export const UserMyEvents = () => {
  const [future, setFuture] = useState([]);
  const [past, setPast] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getEvents().then(eventsData => {
      const events = eventsData.results;

      getEventAssists().then(assistData => {
        const myAssists = assistData.filter(a => a.user_id === user.id);

        const f = [];
        const p = [];

        myAssists.forEach(a => {
          const ev = events.find(e => e.id === a.event_id);

          if (new Date(ev.date_event) >= new Date()) f.push(ev);
          else p.push(ev);
        });

        setFuture(f);
        setPast(p);
      });
    });
  }, []);

  return (
    <div className="container py-5">
      <h2>Mis eventos</h2>

      <h4>Voy a asistir</h4>
      {future.map(e => <p key={e.id}>{e.name}</p>)}

      <h4 className="mt-4">He asistido</h4>
      {past.map(e => <p key={e.id}>{e.name}</p>)}
    </div>
  );
};