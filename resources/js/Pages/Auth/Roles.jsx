import React, { useState } from "react";
import { HeaderAdministrator } from "@/Components/admin/Header";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Head, Link, router, useForm } from "@inertiajs/react";
import { ApproveIcon, CancelButton, RejectIcon } from "@/Components/ui/Icon";

export default function UsersAdministrator({ auth, roles, permissions }) {
    const {data, setData, post, errors, reset} = useForm({
        permissions: [],
        role : "",
    });

    const [ isSubmit, setIsSubmit ] = useState(false);
    const [ showWindowUpdate, setShowWindowUpdate ] = useState(false);
    const [ showWindowCreate, setShowWindowCreate ] = useState(false);
    
    function handleUpdate(e) {
        e.preventDefault();

        if(data.permissions.length > 0 && data.role !== "") {
            setIsSubmit(true);
            
            post("/dashboard/role/update", {
                onSuccess : () => {
                    setIsSubmit(false);
                    setShowWindowUpdate(false);
                },
                onError : () =>{    
                    errors.role = "Error updating role";
                },
                onFinish : () =>{    
                    setIsSubmit(false);
                    setShowWindowUpdate(false);
                },
            });
        } else {
            errors.role = "Select at least one permission";
        }
    }

    function handleCreate(e) {
        e.preventDefault();

        if(data.permissions.length > 0 && data.role !== "") {
            setIsSubmit(true);
            
            post("/dashboard/role/create", {
                onSuccess : () => {
                    setIsSubmit(false);
                    setShowWindowCreate(false);
                },
                onError : () =>{    
                    errors.role = "Error updating role";
                },
                onFinish : () =>{    
                    setIsSubmit(false);
                    setShowWindowCreate(false);
                },
            });
        } else {
            errors.role = "Select at least one permission";
        }
    }

    function handleDelete(id) {
        router.delete("/dashboard/role/delete/"+id, {
            onBefore: () => confirm('Are you sure you want to delete this role?'),
        });
    }

    return (
        <>
            <Head title="Roles Administer"/>

            <HeaderAdministrator user={auth}/> {/* Componente del encabezado del administrador */}
            <article style={{ marginTop: "30px", padding: "0 10px" }}>
                <header style={{ textAlign: "center", width: "100%" }}>
                    <h1>Users</h1> {/* Título de la sección */}
                </header>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th style={{ textWrap:"nowrap" }}>Permission Users</th>
                            <th style={{ textWrap:"nowrap" }}>Permission Properties</th>
                            <th style={{ textWrap:"nowrap" }}>Permission Visits</th>
                            <th>Modify</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            roles && roles.data.map((item) => ( // Mapeamos los datos de los usuarios para mostrarlos en la tabla
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>
                                        {item.permissions_array.includes("users") 
                                                ? <ApproveIcon color={"#28a228"}/> 
                                                : <RejectIcon color={"#c23c3c"}/>}
                                    </td>
                                    <td>
                                        {item.permissions_array.includes("properties") 
                                                ? <ApproveIcon color={"#28a228"}/> 
                                                : <RejectIcon color={"#c23c3c"}/>}
                                    </td>
                                    <td>
                                        {item.permissions_array.includes("visits") 
                                                ? <ApproveIcon color={"#28a228"}/> 
                                                : <RejectIcon color={"#c23c3c"}/>}
                                    </td>
                                    <td style={{ width: '50px' }}>
                                        {
                                            item.name !== "admin" && 
                                            <Button 
                                                variant="warning" 
                                                onClick={()=>{ 
                                                    setShowWindowUpdate(true);
                                                    setData({
                                                        "role" : item.name,
                                                        "permissions": item.permissions.map((item) => item.id)
                                                    });
                                                }}
                                            >
                                                Modify
                                            </Button> //Botón para modificar el usuario
                                        }
                                    </td>
                                    <td style={{ width: '50px' }}>
                                        {
                                            item.name !== "admin" && 
                                            <Button 
                                                variant="danger" 
                                                onClick={()=>{ 
                                                    handleDelete(item.id);
                                                }}
                                            >
                                                Delete
                                            </Button> //Botón para modificar el usuario
                                        }
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

                <div style={{ display: "flex", width: "100%", justifyContent: "center", margin: "20px 0" }}>
                    <Button variant="primary" onClick={()=>{setShowWindowCreate(true); reset(); }}>Create Role</Button> {/* Botón para agregar un nuevo usuario */}
                </div>
            </article>

            {
                (showWindowUpdate || showWindowCreate) &&
                <aside className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 bg-white shadow-lg ">
                    <div>
                        <form onSubmit={showWindowCreate ? handleCreate : handleUpdate} className="form" id="form" style={{ width:"300px" }}>
                            <CancelButton style={{ position:"absolute", top:"10px", right:"10px", cursor:"pointer" }} onClick={()=>{ setShowWindowUpdate(false); setShowWindowCreate(false) }}/>
                            
                            {
                                showWindowCreate &&
                                <input
                                    style={{ fontWeight: "600", fontFamily: "Arial", marginTop:"20px" }}
                                    className="input-visit"
                                    name="role"
                                    placeholder="Role"
                                    type="text"
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    required
                                />
                            }
                            
                            <div style={{ width:"100%" }}>
                                {
                                    showWindowUpdate && 
                                    <div className="title" style={{ margin:"0", marginBottom:"15px", display:"flex", justifyContent:"center" }}>	
                                        <span style={{ fontSize:"22px" }}>Permission | {data.role}</span>  {/* Etiqueta para características */}
                                    </div>
                                }
                                
                                <div style={{ display: "flex", width: "100%", flexWrap: "wrap", gap: "20px", marginLeft: "5px" }}>
                                    {permissions.length > 0 && permissions.map((item) => (
                                        <div key={item.id} style={{ width: "100px", display: "flex", alignItems: "center" }}>
                                            <label className="container-checkbox">
                                                <input  
                                                    type="checkbox" 
                                                    name="role"            
                                                    id={`role-${item.id}`}
                                                    checked={data.permissions.includes(item.id)}
                                                    onChange={(e) => {
                                                        const selectPermissions = e.target.checked
                                                            ? [...data.permissions, item.id] // Añadir rol si se marca
                                                            : data.permissions.filter((r) => r !== item.id); // Eliminar si se desmarca

                                                        setData("permissions", selectPermissions);
                                                    }}
                                                    value={item.id}
                                                />
                                                <div className="checkmark checkmark_feature"></div> {/* Estilo para el checkbox */}
                                            </label>
                                            <span style={{ textTransform: "capitalize", marginTop: "3px" }}>
                                                {item.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {/* Mensaje de error */}
                                <div style={{ width: '100%', textAlign: 'center', }}>
                                    {
                                        errors.role 
                                        &&<span style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                                            { errors.role }  
                                        </span>
                                    }
                                </div>
                            </div>

                            {/* Botón para enviar el formulario */}
                            <button className="button-confirm" type="submit" style={{ margin: "0 auto 0 auto" }} disabled={isSubmit}>
                                {isSubmit ? 'Submitting...' : showWindowCreate ? 'Create Role→' : 'Update Role→'}  {/* Texto del botón basado en el estado */}
                            </button>
                        </form>
                    </div>
                </aside> 
            }
            
        </>
    );
}
