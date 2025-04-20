import { React, useEffect, useState } from "react";
import { HeaderAdministrator } from "@/Components/admin/Header";
import { Alert, Button, ButtonGroup, Table } from "react-bootstrap";
import { ModalConfirmAlert } from "@/Components/admin/ModalConfirmAlert";
import { Head, Link, router } from "@inertiajs/react";


export default function VisitAdministrator({ auth, visit, users }) {
    const [ alertConfirmPending, setAlertConfirmPending ] = useState(false); // Estado para mostrar alerta de confirmación de pendiente.
    const [ alertPending, setAlertPending ] = useState(false); // Estado para mostrar alerta de pendiente.
    const [ alertConfirmDelete, setAlertConfirmDelete ] = useState(false); // Estado para mostrar alerta de confirmación de eliminación.
    const [ alertDelete, setAlertDelete ] = useState(false); // Estado para mostrar alerta de eliminación.
    const [ visit_id, setVisit_id ] = useState(); // Estado para almacenar el ID de la visita.
    let [ employee, setEmployee ] = useState(visit.data);
    
    // Maneja el cambio de estado de pendiente.
    const handleChangePending = () => {
        setAlertConfirmPending(false); // Cierra la alerta de confirmación de pendiente.
        setAlertPending(true); // Abre la alerta de confirmación de visita.

        setTimeout(() => {
            setAlertPending(false); // Cierra la alerta de confirmación de visita.
            document.getElementById("row-"+visit_id).remove();
        }, 1500);

        // Realiza la solicitud fetch para marcar la visita como pendiente.
        router.post('/dashboard/visit/pending/' + visit_id + '/' + employee)
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
            <Head title="Visit Administrator" />

            <HeaderAdministrator user={auth}/> {/* Muestra el encabezado del administrador */}
           
            <div style={{ marginTop: "30px", padding: "0 10px" }}>
                <div style={{ textAlign: "center", width: "100%" }}>
                    <h1>Waiting for confirmation</h1> 
                </div>
                
                <Table striped bordered hover> {/* Tabla para mostrar visitas */}
                    <thead>
                        <tr>
                            <th>ID</th> {/* Encabezado de ID */}
                            <th>Name</th> {/* Encabezado de Nombre */}
                            <th>Email</th> {/* Encabezado de Email */}
                            <th>phone</th> {/* Encabezado de Teléfono */}
                            <th>Scheduled Date</th> {/* Encabezado de Fecha Programada */}
                            <th>House</th> {/* Encabezado de Casa */}
                            <th>Mark</th> {/* Encabezado para marcar como visitado si se están viendo visitas programadas  */}
                            <th>Delete</th> {/* Encabezado para eliminar visita */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            visit.data && visit.data.map((item) => ( // Mapea los datos de las visitas para mostrarlos en la tabla
                                
                                <tr key={item.id} id={"row-"+item.id}>
                                    <td style={{ textAlign: "center", width: "10px" }}>{item.id}</td> {/* Muestra el ID de la visita */}
                                    
                                    <td>{item.name + " " + item.lastname}</td> {/* Muestra el nombre completo */}
                                    
                                    <td>{item.email}</td> {/* Muestra el email */}
                                    
                                    <td>{item.phone}</td> {/* Muestra el teléfono */}
                                    
                                    <td>{item.date_visit}</td> {/* Muestra la fecha de visita, color verde si son visitas programadas */}
                                    
                                    <td style={{ width: "128px" }}>
                                        <Link href={'/property/' + item.house_id } target="_blank"> {/* Enlace para ver detalles de la casa */}
                                            <Button variant="success" style={{ whiteSpace:"nowrap" }}>View House</Button> {/* Botón para ver la casa */}
                                        </Link>
                                    </td>
                                    
                                    <td style={{ width: '50px' }}>
                                        <Button 
                                            variant="secondary" 
                                            onClick={() => {
                                                setAlertConfirmPending(true); // Muestra la alerta de confirmación para marcar como visitado
                                                setVisit_id(item.id); // Establece el ID de la visita
                                            }}
                                        >
                                            Pending
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
                (alertConfirmPending || alertConfirmDelete) && ( // Verifica si hay alertas de confirmación activas
                    <ModalConfirmAlert 
                        data = {users}
                        setEmployee={setEmployee}
                        title={alertConfirmPending ? 'You are about to mark this as pending.' :'Delete Visit.'} // Título de la alerta según la acción
                        subtitle={alertConfirmPending // Subtítulo de la alerta
                            ? "By marking it as pending, it will be moved to the 'Pending' table. Do you want to continue?" 
                            : 'You are about to delete this visit, do you want to continue?.'
                        } 
                        button={alertConfirmPending ? 'Mark as Pending' : 'Delete'} // Texto del botón según la acción
                        typeButton={alertConfirmPending ? 'warning' : 'danger'} // Tipo de botón según la acción
                        buttonCancel={"Cancel"} // Texto del botón de cancelar
                        selection={alertConfirmPending} //Vista solo para pendiente
                        functionButtonCancel={() => {
                            alertConfirmPending // Función para cerrar la alerta de confirmación
                            ? setAlertConfirmPending(false)
                            : setAlertConfirmDelete(false);
                        }}
                        functionButton={() => {
                            alertConfirmPending // Función para ejecutar la acción según la alerta
                            ? handleChangePending() // Marca como Pendiente
                            : handleDeleteVisit() // Elimina la visita 
                        }} 
                    />
                )
            }
            {
                (alertPending || alertDelete) && ( // Verifica si hay alertas activas de visita o eliminación
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
                        <Alert variant={alertPending ? 'success' : 'warning' }> {/* Alerta de éxito */}
                            {
                                alertPending 
                                ? "It has been marked as visited and moved to the 'Pending Visits' table." // Mensaje si se ha marcado como pendiente
                                : "The visit has been removed from the database." // Mensaje si se ha eliminado la visita
                            }
                        </Alert>
                    </div>
                )
            }
        </>
    )
}