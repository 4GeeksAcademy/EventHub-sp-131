const EventCard = ({ event }) => {
  return (
    <div className="card">
      {event.media && (
        <img src={event.media} alt={event.name} className="card-img" />
      )}

      <h2>{event.name}</h2>
      <p>{event.location}</p>

      <p>
        {new Date(event.date_event).toLocaleDateString()}
      </p>
    </div>
  );
};

export default EventCard;