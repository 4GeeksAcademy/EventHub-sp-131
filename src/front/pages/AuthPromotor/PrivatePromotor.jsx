import { Navigate, useNavigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useEffect, useState } from "react";
//import { CreateEventForm } from "../../components/Event/CreateEventForm";
//import { EventList } from "../../components/Event/EventList"

export const PrivatePromotor = () => {
  const { store, dispatch } = useGlobalReducer()
  const navigate = useNavigate()
  const urlApi = import.meta.env.VITE_BACKEND_URL
  const [profileInfo, setProfileInfo] = useState()

  useEffect(() => {
    if (localStorage.getItem("promotorAuth") == true) {
      setIsLogged(localStorage.getItem("promotorAuth"))
    }
    authUser(localStorage.getItem("token"));
  }, [])

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
      dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: response.ok })
      localStorage.setItem("promotorAuth", response.ok)
      const data = await response.json()
      setProfileInfo(data.promotor)
    }

    catch (error) {
      console.log("Error on fetch: ", error.message)
    }
  }

  return (
    <>
      <div className="container">
        {profileInfo &&
          <h1 className="text-center p-4">Welcome {profileInfo.name} to your profile</h1>
        }
        <p className="d-inline-flex gap-1">
          <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
            Create new event
          </button>
        </p>
        {profileInfo &&
          <div className="collapse border" id="collapseExample">
            <CreateEventForm id={profileInfo.id} type={"promotor"} />
          </div>
        }
        {profileInfo &&
          <div>
            <EventList profile={profileInfo} type={"promotor"}/>
          </div>
        }
      </div>

    </>
  );
};