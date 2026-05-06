import SwipeDeck from "./SwipeDeck";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";

export const Discover = () => {

  const { store, dispatch } = useGlobalReducer();
  return (
    <DashboardLayout
      role="user"
      title="Mi perfil"
      subtitle="Bienvenida a tu espacio personal en EventHub."
      userName={store.privateUser?.name}
    >
      <div className="discoverPage pt-5">
        <h1 className="discoverTitle">🔥 Match Events</h1>
        <SwipeDeck />
      </div>
    </DashboardLayout>
  );
};