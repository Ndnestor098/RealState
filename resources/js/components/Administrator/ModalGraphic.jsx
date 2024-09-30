import React, { PureComponent, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export function ModalGraphic() {
   // Inicializa el estado para las casas más visitadas y más vistas
    const [ houseMoreVisit, setHouseMoreVisit ] = useState([]); // Estado para almacenar casas más visitadas
    const [ houseMoreViewed, setHouseMoreViewed ] = useState([]); // Estado para almacenar casas más vistas
    const navigate = useNavigate(); // Hook para navegar entre rutas

    // useEffect se ejecuta una vez al montar el componente
    useEffect(() => {
        // Realiza una solicitud para obtener las visitas de casas con limitación de resultados y opción gráfica
        fetch('/api/visit/?graphic=true&limit=4')
            .then(res => res.json()) // Convierte la respuesta a formato JSON
            .then(res => {
                // Verifica si la respuesta es exitosa
                if(res.status === 200){
                    // Transforma los datos recibidos en un nuevo formato
                    const transformedData = res.data.map(item => ({
                        name: 'Property-' + item.house_id, // Crea un nombre para la propiedad
                        visited: item.visit_count // Establece el conteo de visitas
                    }));

                    // Actualiza el estado con los datos transformados
                    setHouseMoreVisit(transformedData);
                }
            });
            
        // Realiza otra solicitud para obtener las casas más vistas, ordenadas de manera descendente y con limitación de resultados
        fetch('/api/houses/?orderByViewed=DESC&limit=4')
            .then(res => res.json()) // Convierte la respuesta a formato JSON
            .then(res => {
                // Verifica si la respuesta es exitosa
                if(res.status === 200){
                    // Transforma los datos recibidos en un nuevo formato
                    const transformedData = res.data.map(item => ({
                        name: 'Property-' + item.id, // Crea un nombre para la propiedad
                        view: item.viewed // Establece el número de veces que se ha visto
                    }));

                    // Actualiza el estado con los datos transformados
                    setHouseMoreViewed(transformedData);
                }
            });
    }, []);

    // handleBarClick se ejecuta cuando se da click a algunas celdas de la grafica redireccionando a su pagina de modificacion
    const handleBarClick = (id) => {
        navigate('/dashboard/properties/modify/'+id);
    }
    
    return (
        <div className="content-graphic">
            {/* Contenedor para el gráfico de las propiedades más visitadas */}
            <div style={{ height: "280px", maxWidth: "600px", width: "100%", paddingTop: "5px" }}>
                <h6 style={{ width: "100%", textAlign: "center" }}>Most Visited Property Chart</h6>
                
                {/* Verifica si hay datos disponibles para mostrar */}
                { houseMoreVisit.length !== 0
                    ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={300}
                                height={300}
                                data={houseMoreVisit} 
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                {/* Grilla del gráfico */}
                                <CartesianGrid strokeDasharray="3 3" />
                                {/* Eje X con el nombre de la propiedad */}
                                <XAxis dataKey="name" />
                                {/* Eje Y */}
                                <YAxis />
                                {/* Tooltip para mostrar información al pasar el mouse */}
                                <Tooltip />
                                
                                {/* Leyenda del gráfico */}
                                <Legend />
                                {/* Barra del gráfico, mostrando el conteo de vistas */}
                                <Bar 
                                    dataKey="visited" 
                                    fill="#82ca9d" 
                                    activeBar={<Rectangle fill="#619675" stroke="grey" />} 
                                    onClick={(e)=>{
                                        handleBarClick(e.name.replace('Property-', ''));
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )
                    : (
                        // Spinner que se muestra mientras no hay datos
                        <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Spinner animation="border" />
                        </div>
                    )
                }
            </div>

            {/* Contenedor para el gráfico de las casas más vistas */}
            <div style={{ height: "280px", maxWidth: "600px", width: "100%", paddingTop: "5px" }}>
                <h6 style={{ width: "100%", textAlign: "center" }}>Most viewed property graph</h6>

                {/* Verifica si hay datos disponibles para mostrar */}
                { houseMoreViewed.length !== 0
                    ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={300}
                                height={300}
                                data={houseMoreViewed} // Utiliza los datos de casas más visitadas
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                {/* Grilla del gráfico */}
                                <CartesianGrid strokeDasharray="3 3" />
                                {/* Eje X con el nombre de la propiedad */}
                                <XAxis dataKey="name" />
                                {/* Eje Y */}
                                <YAxis />
                                {/* Tooltip para mostrar información al pasar el mouse */}
                                <Tooltip />
                                {/* Leyenda del gráfico */}
                                <Legend />
                                {/* Barra del gráfico, mostrando el conteo de vistas */}
                                <Bar 
                                    dataKey="view" 
                                    fill="#4291ff" 
                                    activeBar={<Rectangle fill="#487bc2" stroke="grey" />}
                                    onClick={(e)=>{
                                        handleBarClick(e.name.replace('Property-', ''));
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )
                    : (
                        // Spinner que se muestra mientras no hay datos
                        <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Spinner animation="border" />
                        </div>
                    )
                }
            </div>
        </div>
    );
}