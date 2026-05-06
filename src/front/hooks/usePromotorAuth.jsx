import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "./useGlobalReducer";

const urlApi = import.meta.env.VITE_BACKEND_URL;

export function usePromotorAuth() {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [profileInfo, setProfileInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/promotor/login");
            return;
        }
        authUser(token);
    }, []);

    async function authUser(token) {
        try {
            const response = await fetch(`${urlApi}/api/promotor/private`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: false });
                localStorage.removeItem("promotorAuth");
                navigate("/promotor/login");
                return;
            }

            dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: true });
            localStorage.setItem("promotorAuth", "true");

            const data = await response.json();
            setProfileInfo(data.promotor);
        } catch (error) {
            console.error("Error on auth:", error.message);
            dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: false });
            navigate("/promotor/login");
        } finally {
            setLoading(false);
        }
    }

    return { profileInfo, loading };
}