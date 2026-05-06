import { Link } from "react-router-dom";

export const DashboardCard = ({ title, text, to, icon, variant = "primary" }) => {
  return (
    <div className="eventhub-card">
      
      <div className={`eventhub-card-icon ${variant}`}>
        <i className={icon}></i>
      </div>

      <h5>{title}</h5>
      <p>{text}</p>

      {to && (
        <Link to={to} className="eventhub-card-btn">
          Entrar
        </Link>
      )}
      
    </div>
  );
};