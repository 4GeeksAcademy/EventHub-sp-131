import { useParams } from "react-router-dom";
import { addFriend } from "../../services/userService";

export const UserProfile = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleAdd = () => {
    addFriend({
      user_id: user.id,
      friend_id: Number(id)
    });
  };

  return (
    <div className="container py-5">
      <h2>Perfil de usuario</h2>

      <button onClick={handleAdd} className="btn btn-primary">
        Agregar amigo
      </button>
    </div>
  );
};
