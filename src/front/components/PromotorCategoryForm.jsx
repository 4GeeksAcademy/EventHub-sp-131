import React, { useMemo } from "react";
import PropTypes from "prop-types";

export const PromotorCategoryForm = ({
    promotors,
    categories,
    relations,
    formData,
    handleChange,
    handleSubmit,
    submitText
}) => {
    const selectedPromotor = useMemo(() => {
        if (formData.promotor_id === "") return null;

        return promotors.find(
            (promotor) => promotor.id === parseInt(formData.promotor_id)
        ) || null;
    }, [promotors, formData.promotor_id]);

    const selectedPromotorRelations = useMemo(() => {
        if (formData.promotor_id === "") return [];

        return relations.filter(
            (relation) => relation.promotor_id === parseInt(formData.promotor_id)
        );
    }, [relations, formData.promotor_id]);

    return (
        <div className="card shadow border-0">
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Selector de promotor
                            </label>
                            <select
                                className="form-select"
                                name="promotor_id"
                                value={formData.promotor_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Selecciona un promotor --</option>
                                {promotors.map((promotor) => (
                                    <option key={promotor.id} value={promotor.id}>
                                        {promotor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                Selector de categoría
                            </label>
                            <select
                                className="form-select"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Selecciona una categoría --</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h5 className="mb-3">
                            Categorías que pertenecen al promotor seleccionado
                        </h5>

                        {!selectedPromotor ? (
                            <p className="text-muted mb-0">
                                Selecciona un promotor para ver sus categorías.
                            </p>
                        ) : selectedPromotorRelations.length > 0 ? (
                            <>
                                <p>
                                    <strong>Promotor:</strong> {selectedPromotor.name}
                                </p>
                                <ul className="list-group">
                                    {selectedPromotorRelations.map((relation) => (
                                        <li
                                            key={relation.id}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            <span>{relation.category?.name}</span>
                                            <span className="badge text-bg-secondary">
                                                Relación #{relation.id}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <>
                                <p>
                                    <strong>Promotor:</strong> {selectedPromotor.name}
                                </p>
                                <p className="text-muted mb-0">
                                    Este promotor no tiene categorías relacionadas.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-primary">
                            {submitText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

PromotorCategoryForm.propTypes = {
    promotors: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    relations: PropTypes.array,
    formData: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitText: PropTypes.string
};