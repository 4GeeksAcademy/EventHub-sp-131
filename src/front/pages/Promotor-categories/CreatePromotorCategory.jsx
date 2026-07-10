import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import devLog from "../../utils/devLogger";
import { PromotorCategoryForm } from "../../components/PromotorCategoryForm";

const API_URL = import.meta.env.VITE_BACKEND_URL || "/api";

export const CreatePromotorCategory = () => {
    const [promotors, setPromotors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [relations, setRelations] = useState([]);
    const [message, setMessage] = useState("");
    const { store } = useGlobalReducer();

    const [formData, setFormData] = useState({
        promotor_id: "",
        category_id: ""
    });

    const loadData = () => {
        Promise.all([
            fetch(`${API_URL}/api/promotors`).then((resp) => resp.json()),
            fetch(`${API_URL}/api/categories`).then((resp) => resp.json()),
            fetch(`${API_URL}/api/promotor-categories`).then((resp) => resp.json())
        ])
            .then(([promotorsData, categoriesData, relationsData]) => {
                setPromotors(Array.isArray(promotorsData) ? promotorsData : []);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
                setRelations(Array.isArray(relationsData) ? relationsData : []);
            })
            .catch((error) => devLog.error(error));
    };

    useEffect(() => {
        loadData();
    }, []);

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

        fetch(`${API_URL}/promotor-categories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.msg) {
                    setMessage(data.msg);
                    return;
                }

                setMessage("Relación creada correctamente.");
                setFormData({
                    promotor_id: "",
                    category_id: ""
                });
                loadData();
            })
            .catch((error) => {
                devLog.error(error);
                setMessage("Hubo un error creando la relación.");
            });
    };

    if (!store.adminAuth) {
    return <Navigate to="/admin/login" />;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Crear relación Promotor - Categoría</h2>

            {message && <div className="alert alert-info">{message}</div>}

            <PromotorCategoryForm
                promotors={promotors}
                categories={categories}
                relations={relations}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                submitText="Guardar relación"
            />
        </div>
    );
};