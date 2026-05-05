import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import EventHubHeroImage from "../../assets/img/EventHubHeroImage.png";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export const PromotorSignUp = () => {
  const { store, dispatch } = useGlobalReducer()
  const urlApi = import.meta.env.VITE_BACKEND_URL
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [phone, setPhone] = useState("")
  const [webPage, setWebPage] = useState("")
  const navigate = useNavigate()

  async function loginUser(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${urlApi}/api/promotor/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": email,
          "password": pw
        })
      })

      if (!response.ok) {
        const resp = await response.json()
        setErrorMsg(resp.msg)
        throw new Error("Error on post fetch, status: ", response.status)
      }
      const token = (await response.json()).access_token
      localStorage.setItem("token", token)
      dispatch({ type: "ADD_TOKEN_PROMOTOR", payload: token })
      setTimeout(() => {
        if (response.ok) {
          navigate('/promotor/private');
        }
      }, 1000);
    }

    catch (error) {
      console.log("Error on fetch: ", error.message)
    }
  }

  async function signUpPromotor(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${urlApi}/api/promotor/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "email": email,
          "password": pw,
          "name": name,
          "location": location,
          "phone": phone,
          "web_page": webPage
        })
      })
      if (!response.ok) {
        throw new Error("Error on post fetch, status: ", response.status)
      }
      loginUser(e)
      /*setTimeout(() => {
         if (response.ok) {
          navigate('/promotor/private');
        }
      }, 1000); */
    }
    catch (error) {
      console.log("Error on fetch: ", error.message)
    }
  }

  useEffect(() => {
    if (localStorage.getItem("promotorAuth") === "true") {
      dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: localStorage.getItem("promotorAuth") })
    }
  }, [])

  return (
    <div style={{ background: `linear-gradient(rgba(10, 10, 15, 0.75), rgba(10, 10, 15, 0.85)), url(${EventHubHeroImage}) center/cover no-repeat`}}>
      {store.promotorAuth === "true" ?
        <Navigate to="/promotor/private" />
        :
        null }
      <div className="container row mx-auto mt-5">
        <div className="pt-4 w-50 mx-auto forms">
          <h2 className="d-flex justify-content-center mb-5">Register to EventHub</h2>
          <form onSubmit={signUpPromotor}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="name" className="form-control" id="name" aria-describedby="name" onChange={(e) => setName(e.target.value)} value={name} required/>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)} value={email} required/>
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e) => setPw(e.target.value)} value={pw} required/>
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input type="text" className="form-control" id="location" onChange={(e) => setLocation(e.target.value)} value={location} required/>
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input type="tel" inputMode="numeric" minLength={9} maxLength={9} placeholder="912-22-33-44" className="form-control" id="phone" onChange={(e) => setPhone(e.target.value)} value={phone} required/>
            </div>
            <div className="mb-3">
              <label htmlFor="webPage" className="form-label">Your Web Page</label>
              <input type="text" className="form-control" id="webPage" onChange={(e) => setWebPage(e.target.value)} value={webPage} required/>
            </div>
            <button type="submit" className="btn btn-primary d-grid gap-2 col-6 mx-auto">Sign Up</button>
          </form>
          <div className="d-flex p-3 gap-4 align-items-center" style={{ justifySelf: "center" }}>
            <p>Already have an accout?</p>
            <Link to="/promotor/login">
              <button className="btn btn-primary">Login</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};