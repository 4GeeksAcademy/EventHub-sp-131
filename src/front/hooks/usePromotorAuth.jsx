import { useEffect, useState } from "react";
import useGlobalReducer from "./useGlobalReducer";
import devLog from "../utils/devLogger";

const urlApi = import.meta.env.VITE_BACKEND_URL;

export function usePromotorAuth() {
    const { dispatch } = useGlobalReducer();
    const [profileInfo, setProfileInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuthorized(false);
            setLoading(false);
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
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: false });
                localStorage.removeItem("promotorAuth");
                setIsAuthorized(false);
                return;
            }

            dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: true });
            localStorage.setItem("promotorAuth", "true");
            const data = await response.json();
            setProfileInfo(data.promotor);
            setIsAuthorized(true);
        } catch (error) {
            devLog.error("Error on auth:", error.message);
            dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: false });
            setIsAuthorized(false);
        } finally {
            setLoading(false);
        }
    }

    return { profileInfo, loading, isAuthorized };
}