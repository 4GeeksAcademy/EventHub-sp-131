import { Navigate, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useEffect, useState } from "react";

export const PrivatePromotor = () => {
  const { store, dispatch } = useGlobalReducer()
  const navigate = useNavigate()
  const [tokenApi, setTokenApi] = useState("")
  const urlApi = import.meta.env.VITE_BACKEND_URL
  const [isLogged, setIsLogged] = useState(false)


  useEffect(()=> {
    if (localStorage.getItem("promotorAuth") == true) {
      setIsLogged(localStorage.getItem("promotorAuth"))
    }
    authUser(localStorage.getItem("token"));
  },[])

  async function authUser(token) {
    try {
      const response = await fetch(`${urlApi}api/promotor/private`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      })

      if (!response.ok) {
        navigate('/promotor/login')
      }
      setIsLogged(response.ok)
      dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: response.ok })
      localStorage.setItem("promotorAuth", response.ok)
    }

    catch (error) {
      console.log("Error on fetch: ", error.message)
    }
  }


  return (
    <>
      <div className="container">
        <h1 className="text-center p-4">This page is private</h1>
      </div>

    </>
  );
};