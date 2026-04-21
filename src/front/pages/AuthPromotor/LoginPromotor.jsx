import { Link, useNavigate, Navigate } from "react-router-dom";
import rigoImageUrl from "../../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { useEffect, useState } from "react";

export const LoginPromotor = () => {
  const { store, dispatch } = useGlobalReducer()
  const urlApi = import.meta.env.VITE_BACKEND_URL
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [tokenApi, setTokenApi] = useState("")

  const navigate = useNavigate()


  async function loginUser(e) {
    e.preventDefault();
    console.log(email);
    console.log(pw);
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
        throw new Error("Error on post fetch, status: ", response.status)
      }
      const token = (await response.json()).access_token
      setTokenApi(token)
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

  return (
    <>
      {store.userAuth === "true" ?
        <Navigate to="/privatePage" />
        : null}
      <div className="container row mx-auto mt-5">
        <div className="col-8 pt-4 w-50">
          <h2 className="d-flex justify-content-center mb-5">Login to MyApp</h2>
          <form onSubmit={loginUser}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => setEmail(e.target.value)} value={email} />
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
              <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e) => setPw(e.target.value)} value={pw} />
            </div>
            <button type="submit" className="btn btn-primary d-grid gap-2 col-6 mx-auto" onClick={loginUser}>Login</button>
          </form>
{/*           <div className="d-flex p-3 gap-4 align-items-center">
            <p>Not registered?</p>
            <Link to="/signup">
              <button className="btn btn-primary">Sign Up Here</button>
            </Link>
          </div> */}
        </div>
        <div className="col-4 ms-5">
          <img src={rigoImageUrl} alt="" />
        </div>
      </div>
    </>
  );
};