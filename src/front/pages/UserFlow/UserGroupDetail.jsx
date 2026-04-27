import { useParams } from "react-router-dom";
import { joinGroup } from "../../services/userService";

export const UserGroupDetail = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleJoin = () => {
    if (!user) {
      alert("Debes iniciar sesión primero");
      return;
    }

    joinGroup({
      user_id: user.id,
      group_id: Number(id)
    }).then(() => {
      alert("Te uniste al grupo");
    });
  };

  return (
    <div className="container py-5">
      <h2>Detalle grupo</h2>

      <button onClick={handleJoin} className="btn btn-success">
        Unirme al grupo
      </button>
    </div>
  );
};