import { Footer } from '@/Components/layout/Footer';  // Importa el componente Footer
import { Header } from '@/Components/layout/Nav';  // Importa el componente Header
import { Heading } from '@/Components/layout/Heading';  // Importa el componente Heading
import { useState, React } from "react";  // Importa useState para manejar el estado del componente
import { LinkVisit } from '@/Components/features/LinkVisit';  // Importa el componente LinkVisit para mostrar un botón de visita
import { Gallery } from '@/Components/features/Gallery';  // Importa el componente Gallery para mostrar imágenes en carrusel
import { Head, usePage } from '@inertiajs/react';

export default function Propertie({ data }) {
    const [activeCarousel, setActiveCarousel] = useState(false);  // Estado para controlar si el carrusel de imágenes está activo
    const price = Number(Math.floor(data.price)).toLocaleString("de-DE");

    // Función para activar o desactivar el carrusel de imágenes
    const handleActiveCarousel = (value) => {
        setActiveCarousel(value);  // Cambia el estado del carrusel
        if (value) {
            document.body.style.overflow = "hidden";  // Si el carrusel está activo, oculta el scroll de la página
        } else {
            document.body.style.overflow = "";  // Si no, permite el scroll normal
        }
    };

    if (!data) {
        return <div>No se encontró la propiedad.</div>;
    }

    return (
        <>
            <Head>
                <title>Propertie</title>
                <meta name="description" content={`Property located in ${data.address} with excellent features and an excellent price for $${price} come see them and make the schedule`}/>
            </Head>

            {/* ***** Header Area Start ***** */}
            <Header />
            {/* ***** Header Area End ***** */}

            {/* ***** Heading Start ***** */}
            <Heading title="Single Property" />
            {/* ***** Heading End ***** */}

            {/* ***** Content Page Start ***** */}
            <div className="single-property section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            {/* Imagen principal de la propiedad */}
                            <div className="main-image">
                                <img
                                    src={data.images[0]}  // URL de la imagen principal
                                    alt={`house principal`}  // Texto alternativo
                                    className="image-details"  // Clase CSS para los estilos
                                    style={{ cursor: "pointer" }}  // Cambia el cursor a pointer
                                    onClick={() => handleActiveCarousel(true)}  // Activa el carrusel al hacer clic
                                />
                                {/* Botón para ver más imágenes */}
                                <div style={{ marginTop: "10px" }}>
                                    <span style={{ fontWeight: "600", cursor: "pointer" }} onClick={() => handleActiveCarousel(true)}>
                                        View More Images
                                    </span>
                                </div>
                            </div>

                            {/* Renderiza el carrusel de imágenes si está activo */}
                            {activeCarousel && <Gallery house={data} handleActiveCarousel={handleActiveCarousel} />}

                            {/* Información principal de la propiedad */}
                            <div className="main-content">
                                <div className="content-info-price">
                                    <span className="category">
                                        {data.type_house.name}  {/* Tipo de casa */}
                                    </span>
                                    <p className="price">${price}</p>  {/* Precio de la propiedad */}
                                </div>
                                
                                {/* Dirección de la propiedad */}
                                <h4>
                                    {data.address}
                                    
                                    {/* Componente LinkVisit para agendar visitas */}
                                    <div className="max-w-48 mt-4 md:hidden">
                                        <LinkVisit />
                                    </div>
                                </h4>  

                                {/* Descripción de la propiedad, renderizada de forma segura */}
                                <p dangerouslySetInnerHTML={{ __html: data.description }} />
                            </div>

                            {/* Sección de características de la propiedad */}
                            <div className="accordion" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button" type="button">
                                            Features
                                        </button>
                                    </h2>
                                    <div className="accordion-collapse">
                                        <div className="accordion-body">
                                            {/* Muestra las características de la propiedad */}
                                            {
                                                data.features.map(item => (
                                                    <p key={item.id} style={{ fontWeight: "600", margin: "0", textTransform: "capitalize" }}>
                                                        &bull; {item.name}
                                                    </p>
                                                ))
                                            }
                                            {/* Más características adicionales */}
                                            <p style={{ fontWeight: "600", margin: "0" }}>
                                                &bull; Flat Space {Math.floor(data.size)}m²
                                            </p>
                                            <p style={{ fontWeight: "600", margin: "0" }}>
                                                &bull; {data.quarters} {data.quarters > 1 ? 'Rooms' : 'Room'}
                                            </p>
                                            <p style={{ fontWeight: "600", margin: "0" }}>
                                                &bull; {data.bathroom} {data.bathroom > 1 ? 'Bathrooms' : 'Bathroom'}
                                            </p>
                                            <p style={{ fontWeight: "600", margin: "0" }}>
                                                &bull; Built in {data.date_construction.split('-')[0]}  {/* Año de construcción */}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Columna derecha con información adicional */}
                        <div className="col-lg-4" style={{ padding: "0 35px" }}>
                            {/* Componente LinkVisit para agendar visitas */}
                            <div style={{ marginBottom: "20px" }}>
                                <LinkVisit id={data.id}/>
                            </div>

                            {/* Tabla con información adicional */}
                            <div className="info-table">
                                <ul style={{ paddingLeft: "0" }}>
                                    <li>
                                        <img src='/images/info-icon-01.png' alt="" style={{ width: "50px" }} />
                                        <h4>
                                            {Math.floor(data.size)}m²
                                            <br />
                                            <span>Total Flat Space</span>
                                        </h4>
                                    </li>
                                    <li>
                                        <img src='/images/room.png' alt="" style={{ width: "50px" }} />
                                        <h4>
                                            {data.quarters}
                                            <br />
                                            <span>Total {data.quarters > 1 ? 'Rooms' : 'Room'}</span>
                                        </h4>
                                    </li>
                                    <li>
                                        <img src='/images/bathroom.png' alt="" style={{ width: "50px" }} />
                                        <h4>
                                            {data.bathroom}
                                            <br />
                                            <span>Total {data.bathroom > 1 ? 'Bathrooms' : 'Bathroom'}</span>
                                        </h4>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* ***** Content Page End ***** */}

            {/* ***** Properties Section Start ***** */}
            <Footer />
            {/* ***** Properties Section End ***** */}
        </>
    );
}
