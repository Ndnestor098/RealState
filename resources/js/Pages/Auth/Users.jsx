import React from "react";
import { HeaderAdministrator } from "@/Components/admin/Header";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Head, Link } from "@inertiajs/react";
import { Online } from "@/Components/ui/Icon";

export default function UsersAdministrator({ auth, users }) {
    
    return (
        <>
            <Head title="Users Administer"/>

            <HeaderAdministrator user={auth}/> {/* Componente del encabezado del administrador */}
            <div style={{ marginTop: "30px", padding: "0 10px" }}>
                <div style={{ textAlign: "center", width: "100%" }}>
                    <h1>Users</h1> {/* Título de la sección */}
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th className="text-center">Online</th>
                            <th className="text-center">ID</th>
                            <th className="text-center">Name</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Role</th>
                            <th className="text-center">Modify</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users && users.data.map((item) => ( // Mapeamos los datos de los usuarios para mostrarlos en la tabla
                                
                                <tr key={item.id}>
                                    <td style={{width:"50px"}}>
                                        <Online color={item.active ? "#26d762" : "#f55151"}/>
                                        </td>
                                    <td style={{ textAlign: "center", width: "10px" }}>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        {item.roles.length > 0 
                                        ? item.roles.map((role, index)=>{
                                            if(index === 0){
                                                return role.name;
                                            }

                                            return " | " + role.name;
                                        }) 
                                        : "none"
                                        }
                                    </td>
                                    <td style={{ width: '50px' }}>
                                        <Link href={'/dashboard/users/update/' + item.id} style={{ width: "min-content" }}>
                                            <Button variant="warning">Modify</Button> {/* Botón para modificar el usuario */}
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>

                <div className="justify-center pagination">
                    {users.links.map((link, index) => {
                        link.url = link.url ? link.url.replace('http://', 'https://').replace('/dashboard/dashboard', '/dashboard') : "#";
                        return <Link
                            key={index}
                            href={link.url || "#"}
                            className={`px-3 py-1 mx-1 border font-medium border-2 ${link.active ? "bg-[#1e1e1e] text-white" : "bg-[#fafafa] border-[#1e1e1e] text-[#1e1e1e] hover:bg-[#f35525] transition-all duration-300"}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    })}
                </div>

                <div style={{ display: "flex", width: "100%", justifyContent: "center", margin: "20px 0" }}>
                    <Link href={'/dashboard/users/create'}>
                        <Button variant="primary">Add User</Button> {/* Botón para agregar un nuevo usuario */}
                    </Link>
                </div>
            </div>
        </>
    );
}
