import { Link } from "react-router-dom";

export const Card = (props) => {

    return (
        <>
            <div className="row row-cols-1 row-cols-md-4 g-4">
                {props.data ?
                    props.data.map((promot) => {
                        return (
                            <div className="col-sm-6 mb-3 mb-sm-0" key={promot.id}>
                                <div className="card my-3" style={{ "width": "18rem" }}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h5 className="card-title">{promot.name}</h5>
                                            <div className="d-flex gap-1">
                                                <Link to={`/promotor-edit/${promot.id}`}>
                                                    <button type="button" className="btn btn-outline-dark">
                                                        <i className="fa-regular fa-pen-to-square"></i>
                                                    </button>
                                                </Link>
                                                <Link to={`/promotor-delete/${promot.id}`}>
                                                    <button type="button" className="btn btn-outline-dark">
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                        <p className="card-text">email: {promot.email}</p>
                                        <p className="card-text">location {promot.location}</p>
                                        <p className="card-text">Tel: {promot.phone}</p>
                                        <p className="card-text">{promot.webPage}</p>
                                        <p className="card-text">{promot.verifiedOrg === true ? "Active" : "Inactive"}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    : null}
            </div>
        </>
    );
}