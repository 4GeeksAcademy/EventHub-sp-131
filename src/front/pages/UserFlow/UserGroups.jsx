import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGroups, createGroup } from "../../services/userService";

export const UserGroups = () => {
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    media: "",
    description: ""
  });

  const loadGroups = () => {
    getGroups().then((data) => {
      setGroups(data || []);
    });
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createGroup(formData).then(() => {
      setFormData({
        name: "",
        location: "",
        media: "",
        description: ""
      });

      loadGroups();
    });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Grupos</h2>
      </div>

      <div className="card shadow-sm border-0 rounded-4 p-4 mb-5">
        <h4 className="fw-bold mb-3">Crear grupo</h4>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            name="name"
            placeholder="Nombre del grupo"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            name="location"
            placeholder="Localidad"
            value={formData.location}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            name="media"
            placeholder="URL de imagen"
            value={formData.media}
            onChange={handleChange}
          />

          <textarea
            className="form-control mb-3"
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={handleChange}
          />

          <button className="btn btn-primary">
            Crear grupo
          </button>
        </form>
      </div>

      <h4 className="fw-bold mb-3">Grupos disponibles</h4>

      <div className="row g-4">
        {groups.map((group) => (
          <div className="col-md-4" key={group.id}>
            <div className="card border-0 shadow-sm rounded-4 h-100">
              {group.media && (
                <img
                  src={group.media}
                  alt={group.name}
                  className="card-img-top"
                  style={{ height: "160px", objectFit: "cover" }}
                />
              )}

              <div className="card-body">
                <h5 className="fw-bold">{group.name}</h5>
                <p className="text-muted">{group.location}</p>
                <p>{group.description}</p>

                <Link
                  to={`/user-flow/groups/${group.id}`}
                  className="btn btn-outline-primary w-100"
                >
                  Ver grupo
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <p className="text-muted">Todavía no hay grupos creados.</p>
      )}
    </div>
  );
};