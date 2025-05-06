import React, { use, useEffect, useState } from 'react';
import { CancelButton, FilterButton, TrashIcon } from "../ui/Icon";
import { usePage } from '@inertiajs/react';

export function Filter({features, typeHouse}) {
    const [ showFilter, setShowFilter ] = useState(true);
    const [url, setUrl] = useState(usePage().url)
    const searchParams = new URLSearchParams(window.location.search);
    
    const handleUrl = (e) => {
        let value = e.target.value; // Valor del checkbox (ej: feature-garden)
        let isChecked = e.target.checked; // Estado del checkbox
        let paramMap = {
            "room-": "quarter",
            "bath-": "bathroom",
            "minPrice-": "minPrice",
            "maxPrice-": "maxPrice",
            "minSize-": "minSize",
            "maxSize-": "maxSize",
            "typeHouse-" : "type_house",
            "feature-" : "features"
        };
    
        // Eliminamos el parámetro page si existe
        let query = url.replace(/([?&])page=\d+(&?)/, (match, p1, p2) => {
            return p1 === '?' ? '?' : p2 ? p1 : '';
        }).replace(/\?$/, '');
    
        // Si no hay parámetros, inicializamos un objeto vacío
        let params = new URLSearchParams(query.includes('?') ? query.split("?")[1] : "");
    
        // Recorremos los posibles parámetros a modificar
        for (let prefix in paramMap) {
            if (value.includes(prefix)) {
                let paramName = paramMap[prefix];
                let newValue = value.replace(prefix, "");

                if (paramName === "features") {
                    let currentFeatures = params.get("features") ? params.get("features").split(",") : [];
    
                    if (isChecked) {
                        if (!currentFeatures.includes(newValue)) {
                            currentFeatures.push(newValue);
                        }
                    } else {
                        currentFeatures = currentFeatures.filter(f => f !== newValue);
                    }
    
                    if (currentFeatures.length > 0) {
                        params.set("features", currentFeatures.join(",")); 
                    } else {
                        params.delete("features");
                    }
                } else {
                    if (isChecked) {
                        params.set(paramName, newValue);
                    } else {
                        if(paramName === 'features' || paramName === "bathroom"){
                            params.delete(paramName);
                        } else {
                            params.set(paramName, newValue)
                        }
                    }
                }
            }
        }
        
        // Reconstruimos la URL con los parámetros actualizados
        query = url.split("?")[0] + "?" + params.toString();
        
        // Enviamos la URL actualizada
        sendUrl(query);
    };
    
    const sendUrl = (url) => {
        window.location.href = url;
    }

    // Renderiza el componente de filtros y pasa las funciones de manejo de eventos como props
    return (
        <>
        {/* Botón para mostrar el menú de filtros */}
        <div className="properties-filter">
            <div className="container-icon-filter">
                {/* Filtros */}
                <div onClick={()=>(setShowFilter(!showFilter))}>
                    <button title="filter" className="filter-button">
                        <FilterButton />
                    </button>
                    <span className='text-[12px] font-semibold cursor-pointer'>
                        Filter
                    </span>
                </div>

                {/* Limpiar Filtros */}
                <div 
                    className='flex items-center justify-around flex-column'
                    onClick={()=>(sendUrl("/properties"))}
                >
                    <button className="bin-button">
                        <TrashIcon />
                    </button>
                    <span style={{ fontSize:"12px", fontWeight:"500" }}>
                        Clear Filter
                    </span>
                </div>
            </div>
            

            {/* Busqueda */}
            <div className="group-search" >
                <input 
                    placeholder="Search Houses" 
                    type="text"
                    className="search__input" 
                    id="searchHouse"
                />
                <button className="search__button">
                    <svg
                    viewBox="0 0 16 16"
                    className="bi bi-search"
                    fill="currentColor"
                    height="16"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                    ></path>
                    </svg>
                </button>
            </div>
        </div>

        {/* Menú de filtros */}
        <aside className={`Menu-Filter ${showFilter && 'hidden'}`}>
            <header>
                {/* Botón para cerrar el menú de filtros */}
                <CancelButton 
                    style={{width:"25px",position:"absolute", top:"10px", right:"10px", cursor:"pointer", color:"#f35525"}}
                    onClick={()=>(setShowFilter(!showFilter))}
                />

                <h2 className='text-[#1e1e1e] text-center font-bold text-[22px] uppercase'>Search Filter</h2>
            </header>

            {/* Formulario de filtros */}
            <form>
                {/* Filtro de Precio */}
                <div className="container-form">
                    <h6 className='text-base font-bold'>Price</h6>
                    <div>
                        <select name="minPrice" id="minPrice" value={searchParams.get("minPrice") ? `minPrice-${searchParams.get("minPrice")}`: "0"} onChange={handleUrl}>
                            <option value="0" disabled>Min. Price</option>
                            <option value="minPrice-all">All</option>
                            <option value="minPrice-50000">$50.000</option>
                            <option value="minPrice-70000">$70.000</option>
                            <option value="minPrice-100000">$100.000</option>
                            <option value="minPrice-150000">$150.000</option>
                            <option value="minPrice-200000">$200.000</option>
                            <option value="minPrice-270000">$270.000</option>
                            <option value="minPrice-300000">$300.000</option>
                        </select>
                        <select name="maxPrice" id="maxPrice" value={searchParams.get("maxPrice") ? `maxPrice-${searchParams.get("maxPrice")}`: "0"} onChange={handleUrl}>
                            <option value="0" disabled>Max. Price</option>
                            <option value="maxPrice-all">All</option>
                            <option value="maxPrice-1000000">$1.000.000</option>
                            <option value="maxPrice-700000">$700.000</option>
                            <option value="maxPrice-600000">$600.000</option>
                            <option value="maxPrice-400000">$400.000</option>
                            <option value="maxPrice-300000">$300.000</option>
                            <option value="maxPrice-200000">$200.000</option>
                            <option value="maxPrice-150000">$150.000</option>
                            <option value="maxPrice-100000">$100.000</option>
                        </select>
                    </div>
                </div>

                {/* Filtro de Dimensión */}
                <div className="container-form">
                    <h6 className='text-base font-bold'>Dimension</h6>
                    <div>
                        <select name="minSize" id="minSize" value={searchParams.get("minSize") ? `minSize-${searchParams.get("minSize")}`: "0"} onChange={handleUrl}>
                            <option value="0" disabled>Min. Size</option>
                            <option value="minSize-all">All</option>
                            <option value="minSize-40">40m²</option>
                            <option value="minSize-50">50m²</option>
                            <option value="minSize-60">60m²</option>
                            <option value="minSize-70">70m²</option>
                            <option value="minSize-90">90m²</option>
                            <option value="minSize-100">100m²</option>
                            <option value="minSize-120">120m²</option>
                            <option value="minSize-150">150m²</option>
                            <option value="minSize-200">200m²</option>
                        </select>
                        <select name="maxSize" id="maxSize" value={searchParams.get("maxSize") ? `maxSize-${searchParams.get("maxSize")}`: "0"} onChange={handleUrl}>
                            <option value="0" disabled>Max. Size</option>
                            <option value="maxSize-all">All</option>
                            <option value="maxSize-400">400m²</option>
                            <option value="maxSize-350">350m²</option>
                            <option value="maxSize-300">300m²</option>
                            <option value="maxSize-250">250m²</option>
                            <option value="maxSize-200">200m²</option>
                            <option value="maxSize-170">170m²</option>
                            <option value="maxSize-140">140m²</option>
                            <option value="maxSize-110">110m²</option>
                            <option value="maxSize-100">100m²</option>
                        </select>
                    </div>
                </div>

                {/* Filtro de Tipo de Casa */}
                <div className="container-form">
                    <h6 className='text-base font-bold'>Type of House</h6>
                    <div>
                        <select
                            name="typeHouse"
                            id="typeHouse"
                            value={searchParams.get("type_house") ? `typeHouse-${searchParams.get("type_house")}`: "0"}
                            onChange={handleUrl}
                        >
                            <option value="0" disabled>Select House</option>
                            {
                                typeHouse.length > 0 ? typeHouse.map(item => {
                                    return (
                                        <option key={item.id} value={"typeHouse-"+item.name}>
                                            {item.name}
                                        </option>
                                    )
                                })
                                : ""
                            }
                        </select>
                    </div>
                </div>
                
                {/* Filtro de Habitaciones */}
                <div className="radio-input">
                    <h6 className='text-base font-bold'>Bedrooms</h6>
                    <label className="label">
                        <input type="radio" name="room" id="room-1" defaultChecked={searchParams.get("quarter") === "1"} value="room-1" onChange={handleUrl} />
                        <p className="text">1 Bedroom</p>
                    </label>
                    <label className="label">
                        <input type="radio" name="room" id="room-2" defaultChecked={searchParams.get("quarter") === "2"} value="room-2" onChange={handleUrl} />
                        <p className="text">2 Bedrooms</p>
                    </label>
                    <label className="label">
                        <input type="radio" name="room" id="room-3" defaultChecked={searchParams.get("quarter") === "3"} value="room-3" onChange={handleUrl} />
                        <p className="text">3 Bedrooms</p>
                    </label>
                    <label className="label">
                        <input type="radio" name="room" id="room-4" defaultChecked={searchParams.get("quarter") === "4"} value="room-4" onChange={handleUrl} />
                        <p className="text">4 or more Bedrooms</p>
                    </label>
                </div>

                {/* Filtro de Baños */}
                <div className="radio-input">
                    <h6 className='text-base font-bold'>Bathrooms</h6>
                    <label className="label">
                        <input type="radio" name="bath" id="bath-1" defaultChecked={searchParams.get("bathroom") === "1"} value="bath-1" onChange={handleUrl}/>
                        <p className="text">1 bathroom</p>
                    </label>
                    <label className="label">
                        <input type="radio" name="bath" id="bath-2" defaultChecked={searchParams.get("bathroom") === "2"} value="bath-2" onChange={handleUrl}/>
                        <p className="text">2 bathrooms</p>
                    </label>
                    <label className="label">
                        <input type="radio" name="bath" id="bath-3" defaultChecked={searchParams.get("bathroom") === "3"} value="bath-3" onChange={handleUrl}/>
                        <p className="text">3 or more bathrooms</p>
                    </label>
                </div>

                {/* Filtro de Características */}
                <div className="radio-input">
                    <h6 className='text-base font-bold'>Features</h6>
                    {features.length > 0 && features.map((item, index) => (
                        <label className="label" key={item.id}>
                            <input 
                                type="checkbox" 
                                name="features" 
                                id={`feature-${index}`} 
                                value={`feature-${item.name}`} 
                                onChange={handleUrl}
                                defaultChecked={(searchParams.get("features") || "").includes(item.name)}
                            />
                            {item.name}
                        </label>
                    ))}
                </div>
            </form>
        </aside>
    </>
    )
}
