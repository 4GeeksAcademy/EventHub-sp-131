import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import { PromotorCategoryForm } from "../../components/PromotorCategoryForm";

const API_URL = import.meta.env.VITE_BACKEND_URL || "/api";

export const EditPromotorCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const [promotors, setPromotors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [relations, setRelations] = useState([]);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        promotor_id: "",
        category_id: ""
    });

    const loadData = () => {
        Promise.all([
            fetch(`${API_URL}/promotors`).then((resp) => resp.json()),
            fetch(`${API_URL}/categories`).then((resp) => resp.json()),
            fetch(`${API_URL}/promotor-categories`).then((resp) => resp.json()),
            fetch(`${API_URL}/promotor-categories/${id}`).then((resp) => resp.json())
        ])
            .then(([promotorsData, categoriesData, relationsData, singleRelation]) => {
                setPromotors(Array.isArray(promotorsData) ? promotorsData : []);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
                setRelations(Array.isArray(relationsData) ? relationsData : []);

                if (singleRelation.id) {
                    setFormData({
                        promotor_id: String(singleRelation.promotor_id),
                        category_id: String(singleRelation.category_id)
                    });
                } else if (singleRelation.msg) {
                    setMessage(singleRelation.msg);
                }
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");

        const payload = {
            promotor_id: parseInt(formData.promotor_id),
            category_id: parseInt(formData.category_id)
        };

        fetch(`${API_URL}/promotor-categories/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.msg && !data.id) {
                    setMessage(data.msg);
                    return;
                }

                navigate("/promotor-category/list");
            })
            .catch((error) => {
                console.log(error);
                setMessage("Hubo un error actualizando la relación.");
            });
    };

    if (!store.adminAuth) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Editar relación Promotor - Categoría</h2>

            {message && <div className="alert alert-info">{message}</div>}

            <PromotorCategoryForm
                promotors={promotors}
                categories={categories}
                relations={relations}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                submitText="Actualizar relación"
            />
        </div>
    );
};