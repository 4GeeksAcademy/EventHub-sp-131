import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data

		} catch (error) {
			if (error.message) throw new Error(
				`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`
			);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>
			<p className="lead">
				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
			</p>
			<div className="alert alert-info">
				{store.message ? (
					<span>{store.message}</span>
				) : (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				)}
			</div>
			<div className="row row-cols-1 row-cols-sm-6 g-3">
				<div>
					<Link className="p-2" to="/admin" >
						<button className="btn btn-primary">Admin CRUD</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/promotor">
						<button className="btn btn-primary">Promotor CRUD</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/user">
						<button className="btn btn-primary">User CRUD</button>
					</Link>
				</div>
				<div>
					<Link to="/category-panel">
						<button className="btn btn-primary">Category CRUD</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/events">
						<button className="btn btn-primary">Ir a CRUD Events</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/group">
						<button className="btn btn-primary">Group CRUD</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/promotor-category/list">
						<button className="btn btn-primary">Promotor-Category CRUD</button>
					</Link>
				</div>
				<div>
					<Link to="/saved_event">
						<button className="btn btn-primary">
							Saved Event CRUD
						</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/discussion">
						<button className="btn btn-primary">Discussion CRUD</button>
					</Link>
				</div>
			</div>
		</div>
	);
}; 