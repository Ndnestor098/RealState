import React from "react";

// Componente Previewhouse que recibe un objeto house como prop
export function Previewhouse({ house }) {
    return (
        <>
            <div className="previewHouses">
                <div>
                    {/* Muestra la imagen de la casa, verifica si house y house.images existen */}
                    <img src={'/storage/' + house.images[0]} alt="Image House" />
                    
                    <div className="content-info">
                        {/* Muestra el tipo de casa, verifica si house y house.type_house existen */}
                        <h1>
                            { house.type_house.name }
                        </h1>
                        {/* Muestra la descripción de la casa */}
                        <span>
                            Are you looking for the perfect place for your family? A home that makes you feel comfortable, safe, and happy. Look no further! We have amazing options that fit your lifestyle
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
