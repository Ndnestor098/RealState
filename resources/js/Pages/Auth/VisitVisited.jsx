import { React, useEffect, useState } from "react";
import { HeaderAdministrator } from "@/Components/admin/Header";
import { Alert, Button, ButtonGroup, Table } from "react-bootstrap";
import { ModalConfirmAlert } from "@/Components/admin/ModalConfirmAlert";
import { Head, Link, router } from "@inertiajs/react";


export default function VisitAdministrator({ auth, visit }) {
    const [ alertConfirmDelete, setAlertConfirmDelete ] = useState(false); // Estado para mostrar alerta de confirmación de eliminación.
    const [ alertDelete, setAlertDelete ] = useState(false); // Estado para mostrar alerta de eliminación.
    const [ visit_id, setVisit_id ] = useState(); // Estado para almacenar el ID de la visita.
    let [ data, setData ] = useState(visit.data);

    // Maneja la eliminación de una visita.
    const handleDeleteVisit = () => {
        setAlertConfirmDelete(false); // Cierra la alerta de confirmación de eliminación.
        setAlertDelete(true); // Abre la alerta de confirmación de visita.
        
        setTimeout(() => {
            setAlertDelete(false); // Cierra la alerta de confirmación de visita.
            document.getElementById("row-"+visit_id).remove(); // Elimina la fila de la tabla de visitas.
        }, 1500);

        router.post('/dashboard/visit/delete/' + visit_id);
    }

    return(
        <>  
            <Head title="Visited Administrator" />

            <HeaderAdministrator user={auth}/> {/* Muestra el encabezado del administrador */}
           
            <div style={{ marginTop: "30px", padding: "0 10px" }}>

                <div style={{ textAlign: "center", width: "100%" }}>
                    <h1>Properties Visited</h1> {/* Título para propiedades visitadas */}
                    
                </div>
                
                <Table striped bordered hover> {/* Tabla para mostrar visitas */}
                    <thead>
                        <tr>
                            <th className="text-center">ID</th> {/* Encabezado de ID */}
                            <th className="text-center">Name</th> {/* Encabezado de Nombre */}
                            <th className="text-center">Email</th> {/* Encabezado de Email */}
                            <th className="text-center">phone</th> {/* Encabezado de Teléfono */}
                            <th className="text-center">Employee</th> {/* Encabezado de Empleados */}
                            <th className="text-center">Scheduled Date</th> {/* Encabezado de Fecha Programada */}
                            <th className="text-center">House</th> {/* Encabezado de Casa */}
                            <th className="text-center">Visited</th> {/* // Encabezado para visitas si se han visto las propiedades visitadas */}
                            <th className="text-center">Delete</th> {/* Encabezado para eliminar visita */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.map((item) => ( // Mapea los datos de las visitas para mostrarlos en la tabla
                                
                                <tr key={item.id} id={"row-"+item.id}>
                                    <td style={{ textAlign: "center", width: "10px" }}>{item.id}</td> {/* Muestra el ID de la visita */}
                                    
                                    <td>{item.name + " " + item.lastname}</td> {/* Muestra el nombre completo */}
                                    
                                    <td>{item.email}</td> {/* Muestra el email */}
                                    
                                    <td>{item.phone}</td> {/* Muestra el teléfono */}
                                    
                                    <td>{item.user?.name}</td> {/* Muestra los empleados de visited */}

                                    <td style={{ color: "green", fontWeight: "600"  }}>{item.date_visit}</td> {/* Muestra la fecha de visita, color verde si son visitas programadas */}
                                    
                                    <td style={{ width: "128px" }}>
                                        <Link href={'/property/' + item.house_id } target="_blank"> {/* Enlace para ver detalles de la casa */}
                                            <Button variant="success" style={{ whiteSpace:"nowrap" }}>View House</Button> {/* Botón para ver la casa */}
                                        </Link>
                                    </td>
                                    
                                    <th style={{ color: "#F59E0B", fontWeight: "600" }}>{item.visited_date}</th> {/* Muestra la fecha de visita si ya se ha visitado */}
                                    
                                    <td style={{ width: '50px' }}>
                                        <Button 
                                            variant="danger" 
                                            onClick={() => {
                                                setAlertConfirmDelete(true); // Muestra la alerta de confirmación para eliminar visita
                                                setVisit_id(item.id); // Establece el ID de la visita
                                            }}
                                        >
                                            Delete
                                        </Button> {/* Botón para eliminar visita */}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>

                <div className="justify-center pagination">
                    {visit.links.map((link, index) => {
                        link.url = link.url ? link.url.replace('http://', 'https://').replace('/dashboard/dashboard', '/dashboard') : "#";

                        return <Link
                            key={index}
                            href={link.url || "#"}
                            className={`px-3 py-1 mx-1 border font-medium border-2 ${link.active ? "bg-[#1e1e1e] text-white" : "bg-[#fafafa] border-[#1e1e1e] text-[#1e1e1e] hover:bg-[#f35525] transition-all duration-300"}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    })}
                </div>
            </div>
               

            {
                (alertConfirmDelete) && ( // Verifica si hay alertas de confirmación activas
                    <ModalConfirmAlert
                        title={'Delete Visit.'}
                        subtitle={'You are about to delete this visit, do you want to continue?.'} 
                        button={'Delete'} // Texto del botón según la acción
                        typeButton={'danger'} // Tipo de botón según la acción
                        buttonCancel={"Cancel"} // Texto del botón de cancelar
                        functionButtonCancel={() => {setAlertConfirmDelete(false);}}
                        functionButton={() => {handleDeleteVisit()}} 
                    />
                )
            }
            {
                (alertDelete ) && ( // Verifica si hay alertas activas de visita o eliminación
                    <div style={{
                        width: "100%",
                        position: "fixed",
                        top: 0,
                        left: 0, 
                        display: "flex", 
                        justifyContent: "center",
                        margin: "10px 0",
                        zIndex: 9999
                    }}>
                        <Alert variant={'danger'}> {/* Alerta de éxito */}
                            {
                                "The visit has been removed from the database." // Mensaje si se ha eliminado la visita"It has been marked as visited and moved to the 'Mark as Visited' table." // Mensaje si se ha marcado como visitado
                            }
                        </Alert>
                    </div>
                )
            }
        </>
    )
}