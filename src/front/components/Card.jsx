export const Card = (props) => {

    console.log(props.data);


    return (
        <>
            <div className="row row-cols-1 row-cols-md-4 g-4">
                {props.data ?
                    props.data.map((prom) => {
                        return (
                            <div className="col-sm-6 mb-3 mb-sm-0">
                                <div className="card my-3" style={{ "width": "18rem" }}>
                                    <button type="button" className="btn btn-primary">Create promotor</button>
                                    <button type="button" className="btn btn-primary">Create promotor</button>
                                    <div className="card-body">
                                        <h5 className="card-title">{prom.name}</h5>
                                        <p className="card-text">email: {prom.email}</p>
                                        <p className="card-text">location {prom.location}</p>
                                        <p className="card-text">Tel: {prom.phone}</p>
                                        <p className="card-text">{prom.webPage}</p>
                                        <p className="card-text">{prom.verifiedOrg === true ? "Active" : "Inactive"}</p>
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