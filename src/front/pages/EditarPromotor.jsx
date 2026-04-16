export const EditarPromotor = () => {
    

        async function editPromotor() {
        try {
            const response = await fetch(`${urlAPI}/api/promotor`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "name": name,
                    "email": email,
                    "password": password,
                    "phone": phone,
                    "location": location,
                    "web_page": webPage
                })
            })
            if (!response.ok) {
                throw new Error("Error on post fetch, status: ", response.status)
            }
        }
        catch (error) {
            console.log("Error on fetch: ", error.message)
        }
    }
    return (
        <h1>Editar Promotor</h1>
    );
}