import { useContext } from "react";
import { Filter } from "./Filter";
import { Navigate } from "./Navigate"; 
import { RenderHouses } from "./RenderHouses"; 
import { Loader } from "../General/Loader";
import usePagination from "../../hooks/Navigate"
import { HouseContext } from "../../context/houseContext"; 
import React from 'react';

export function Houses() {
    // Obtiene el contexto de las casas
    const { currentItems, pageCount, handlePageClick } = usePagination();
    const { houses } = useContext(HouseContext);

    // Renderiza el componente
    if (houses.status === 200) {
        return (
            <div className="section properties">
                <div className="container">
                    {/* Componente de filtrado de casas */}
                    <Filter />

                    {/* Componente para mostrar las casas actuales */}
                    <div className="row properties-box">
                        {
                            houses.data.length != 0 
                            ? <RenderHouses currentItems={currentItems} />
                            : (
                                <h2 style={{ textAlign:"center" }}>
                                    No results found matching your search criteria.
                                </h2>
                            )
                        }
                    </div>

                    {/* Componente de navegación para la paginación */}
                    <Navigate pageCount={pageCount} handlePageClick={handlePageClick} />
                </div>
            </div>
        );
    } else {
        // Renderiza un cargador mientras se obtienen los datos de las casas
        return (
            <div className="section properties">
                <div className="container">
                    {/* Componente de filtrado de casas */}
                    <Filter />

                    {/* Componente para mostrar las casas actuales */}
                    <Loader />
                </div>
            </div>
        ); 
    }
}
