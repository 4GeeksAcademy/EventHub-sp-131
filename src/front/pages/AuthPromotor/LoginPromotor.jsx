import { Link, useNavigate, Navigate } from "react-router-dom";
import EventHubHeroImage from "../../assets/img/EventHubHeroImage.png";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useEffect, useState } from "react";

export const LoginPromotor = () => {
  const { store, dispatch } = useGlobalReducer()
  const urlApi = import.meta.env.VITE_BACKEND_URL
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [tokenApi, setTokenApi] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

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

  useEffect(() => {
    if (localStorage.getItem("token") != null && localStorage.getItem("token") != "") {
      setTokenApi(localStorage.getItem("token"))
      dispatch({ type: "ADD_TOKEN_PROMOTOR", payload: localStorage.getItem("token") })
    }

    if (localStorage.getItem("promotorAuth") === "true") {
      dispatch({ type: "ADD_LOGIN_STATUS_PROMOTOR", payload: localStorage.getItem("promotorAuth") })
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setErrorMsg("")
    }, 6000)
  }, [errorMsg])

  return (
    <div style={{ background: `linear-gradient(rgba(10, 10, 15, 0.75), rgba(10, 10, 15, 0.85)), url(${EventHubHeroImage}) center/cover no-repeat`}}>
      {store.promotorAuth === "true" ?
        <Navigate to="/promotor/private" />
        : null}
      <div className="container row mx-auto mt-5">
        <div className="d-flex justify-content-end mb-4">
          <Link to="/">
            <button type="button" className="btn btn-outline mt-3">Back</button>
          </Link>
        </div>
        <div className="pt-4 w-50 mx-auto forms">
          <h2 className="d-flex justify-content-center mb-5">Login</h2>
          {errorMsg &&
            errorMsg != "" ?
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
            :
            null
          }
          <form onSubmit={loginUser}>
            <div className="mb-3 m-auto" style={{ width: "500px" }}>
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)} value={email} style={errorMsg != "" ? { border: "1px red solid" } : {}} />
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3 m-auto" style={{ width: "500px" }}>
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e) => setPw(e.target.value)} value={pw} style={errorMsg != "" ? { border: "1px red solid" } : {}} />
            </div>
            <button type="submit" className="btn btn-primary d-grid gap-2 col-6 mx-auto" onClick={loginUser}>Login</button>
          </form>
          <div className="d-flex p-3 gap-4 align-items-center" style={{ justifySelf: "center" }}>
            <p className="">Not registered?</p>
            <Link to="/promotor/sign-up">
              <button className="btn btn-secondary">Sign Up Here</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};