import React, { useEffect } from "react"
import { Link } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

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
					<Link className="p-2" to="/category-panel">
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
					<Link className="p-2" to="/saved-event">
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
				<div>
					<Link className="p-2" to="/friend">
						<button className="btn btn-primary">Friend CRUD</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/comments">
						<button className="btn btn-primary">Comments CRUD</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/user-category">
						<button className="btn btn-primary">User Category CRUD</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/group-category">
						<button className="btn btn-primary">Group-Category CRUD</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/group-event">
						<button className="btn btn-primary">Group-Event CRUD</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/event-category">
						<button className="btn btn-primary">Event Category CRUD</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/event-promotor">
						<button className="btn btn-primary">Event Promotor CRUD</button>
					</Link>
				</div>
				<div>
					<Link className="p-2" to="/event-assists">
						<button className="btn btn-primary">Event Assist CRUD</button>
					</Link>
				</div>
			</div>
		</div>
	)
}; 