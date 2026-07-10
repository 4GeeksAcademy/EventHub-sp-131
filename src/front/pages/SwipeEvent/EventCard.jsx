import PropTypes from "prop-types";

const EventCard = ({ event }) => {
  return (
    <div className="card home-visual-card">
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

EventCard.propTypes = {
  event: PropTypes.shape({
    media: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
    date_event: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  }).isRequired
};