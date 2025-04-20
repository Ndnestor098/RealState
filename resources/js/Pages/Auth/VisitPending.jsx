import { React, useEffect, useState } from "react";
import { HeaderAdministrator } from "@/Components/admin/Header";
import { Alert, Button, ButtonGroup, Table } from "react-bootstrap";
import { ModalConfirmAlert } from "@/Components/admin/ModalConfirmAlert";
import { Head, Link, router } from "@inertiajs/react";

export default function VisitPending({ auth, visit }) {
    const [ alertConfirmVisited , setAlertConfirmVisited  ] = useState(false); // Estado para mostrar alerta de confirmación de pendiente.
    const [ alertVisited, setAlertVisited ] = useState(false); // Estado para mostrar alerta de pendiente.
    const [ alertConfirmDelete, setAlertConfirmDelete ] = useState(false); // Estado para mostrar alerta de confirmación de eliminación.
    const [ alertDelete, setAlertDelete ] = useState(false); // Estado para mostrar alerta de eliminación.
    const [ visit_id, setVisit_id ] = useState(); // Estado para almacenar el ID de la visita.
    let [ data, setData ] = useState(visit.data);
    

    // Maneja el cambio de estado de visitado.
    const handleChangeVisited = () => {
        setAlertConfirmVisited(false); // Cierra la confirmación de visita.
        setAlertVisited(true); // Abre la alerta de confirmación de visita.
        
        setTimeout(() => {
            setAlertVisited(false); // Cierra la alerta de confirmación de visita.
            document.getElementById("row-"+visit_id).remove();
        }, 1500);

        router.post('/dashboard/visit/visited/' + visit_id);
    };

    // Maneja la eliminación de una visita.
    const handleDeleteVisit = () => {
        setAlertConfirmDelete(false); // Cierra la alerta de confirmación de eliminación.
        setAlertDelete(true); // Abre la alerta de confirmación de visita.
        
        setTimeout(() => {
            setAlertDelete(false); // Cierra la alerta de confirmación de visita.
            document.getElementById("row-"+visit_id).remove();
        }, 1500);

        router.post('/dashboard/visit/delete/' + visit_id);
    }

    return(
        <>  
            <Head title="Visit Pending Administrator" />

            <HeaderAdministrator user={auth}/> {/* Muestra el encabezado del administrador */}
           
            <div style={{ marginTop: "30px", padding: "0 10px" }}>

                <div style={{ textAlign: "center", width: "100%" }}>
                    <h1>Pending to visit</h1> {/* Título para propiedades visitadas */}
                </div>
                
                <Table striped bordered hover> {/* Tabla para mostrar visitas */}
                    <thead>
                        <tr>
                            <th>ID</th> {/* Encabezado de ID */}
                            <th>Name</th> {/* Encabezado de Nombre */}
                            <th>Email</th> {/* Encabezado de Email */}
                            <th>phone</th> {/* Encabezado de Teléfono */}
                            <th>Employee</th> {/* Encabezado de Empleados  */}
                            <th>Scheduled Date</th> {/* Encabezado de Fecha Programada */}
                            <th>House</th> {/* Encabezado de Casa */}
                            <th>Mark</th> {/* Encabezado para marcar como visitado si se están viendo visitas programadas */}
                            <th>Delete</th> {/* Encabezado para eliminar visita */}
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
                                    
                                    <td>{item.user?.name}</td> {/* Muestra los empleados de visited y pending */}
                                    
                                    <td style={{ color:"#10B981", fontWeight:"600" }}>{item.date_visit}</td> {/* Muestra la fecha de visita, color verde si son visitas programadas */}
                                    
                                    <td style={{ width: "128px" }}>
                                        <Link href={'/property/' + item.house_id } target="_blank"> {/* Enlace para ver detalles de la casa */}
                                            <Button variant="success" style={{ whiteSpace:"nowrap" }}>View House</Button> {/* Botón para ver la casa */}
                                        </Link>
                                    </td>
                                    
                                    
                                    <td style={{ width: '50px' }}>
                                        <Button 
                                            variant="secondary" 
                                            onClick={() => {
                                                setAlertConfirmVisited(true); // Muestra la alerta de confirmación para marcar como visitado
                                                setVisit_id(item.id); // Establece el ID de la visita
                                            }}
                                        >
                                            Visited
                                        </Button> {/* Botón para marcar como pendiente */}
                                    </td>
                                            
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
                (alertConfirmDelete || alertConfirmVisited) && ( // Verifica si hay alertas de confirmación activas
                    <ModalConfirmAlert 
                        title={alertConfirmVisited ? 'You are about to mark this as visited.' :'Delete Visit.'} // Título de la alerta según la acción
                        subtitle={
                            alertConfirmVisited 
                                ? "By marking it as visited, it will be moved to the 'Visited' table. Do you want to continue?" 
                                : 'You are about to delete this visit, do you want to continue?.'
                        } 
                        button={alertConfirmVisited ? 'Mark as Visited' : 'Delete'} // Texto del botón según la acción
                        typeButton={alertConfirmVisited ? 'warning' : 'danger'} // Tipo de botón según la acción
                        buttonCancel={"Cancel"} // Texto del botón de cancelar
                        functionButtonCancel={() => {
                            alertConfirmVisited 
                                ? setAlertConfirmVisited(false) 
                                : setAlertConfirmDelete(false);
                        }}
                        functionButton={() => {
                            alertConfirmVisited   
                                ? handleChangeVisited() // Marca como visitado
                                : handleDeleteVisit() // Elimina la visita 
                        }} 
                    />
                )
            }
            {
                ( alertDelete || alertVisited) && ( // Verifica si hay alertas activas de visita o eliminación
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
                        <Alert variant={alertVisited ? 'danger' : 'warning' }> {/* Alerta de éxito */}
                            {
                                alertVisited 
                                    ? "The visit has been removed from the database." // Mensaje si se ha eliminado la visita
                                    : "It has been marked as visited and moved to the 'Mark as Visited' table." // Mensaje si se ha marcado como visitado
                            }
                        </Alert>
                    </div>
                )
            }
        </>
    )
}