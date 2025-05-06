import React from "react";
import { HeaderAdministrator } from "@/Components/admin/Header"; // Componente del encabezado del administrador
import Table from 'react-bootstrap/Table'; // Componente Table de react-bootstrap
import Button from 'react-bootstrap/Button'; // Componente Button de react-bootstrap
import { Head, Link, useForm } from "@inertiajs/react"; // Para navegación entre rutas
import { GlassIcon, TrashIcon } from "@/Components/ui/Icon";


export default function PropertiesAdministrator({auth, house }) {
    const urlParams = new URLSearchParams(window.location.search);
    
    const { data, setData , get } = useForm({
        'address' : urlParams.get("address") ?? ""
    });
    
    const handleSearch = ()=>{
        get("/dashboard/properties")
    }

    return (  
        <>
            <Head title="Properties Administer" />

            <HeaderAdministrator user={auth}/> {/* Encabezado del administrador */}
            <div style={{ marginTop: "30px", padding: "0 10px" }}>
                <div style={{ textAlign: "center", width: "100%" }}>
                    <h1>Properties</h1> {/* Título de la sección */}
                </div>

                <div style={{ display: "flex", width: "100%", justifyContent: "space-around", margin: "20px 0", gap:"10px", alignItems:"center" }}>
                    <Link href={'/dashboard/property/create'}>  
                        <Button variant="primary" style={{ padding:"2px 5px" }}>Add Property</Button> {/* Botón para agregar una nueva propiedad */}
                    </Link>

                    {/* Busqueda */}
                    <div className="container-icon-filter" style={{ display:"flex", alignItems:"center", flexDirection:"row", maxWidth:"500px", width:"100%"  }} >
                    
                        <div className="group-search">
                            <input 
                                placeholder="Search Houses" 
                                type="text" 
                                value={data.address} 
                                className="search__input" 
                                id="address" 
                                onChange={(e)=>(setData({
                                    "address" : e.target.value
                                }))}
                                onKeyDown={(e)=>{
                                    if(e.key === 'Enter'){
                                        handleSearch();
                                    }
                                }}
                            />
                            <button 
                                className="search__button" 
                                onClick={handleSearch}
                            >
                                <GlassIcon />
                            </button>
                        </div>

                        {/* Limpiar Filtros */}
                        <div onClick={()=>{ 
                            setData({ address : "" }); 
                            window.location.href = "/dashboard/properties"
                            }}
                            title="Delete search"
                        >
                            <button className="bin-button" style={{ height:"30px", width:"30px" }}>
                                <TrashIcon/>
                            </button>
                        </div>
                    </div>         
                </div>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Photo</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Modify</th>
                        </tr>
                    </thead>
                    <tbody>
                        {house.data && house.data.map((item) => (
                            <tr key={item.id}>
                                <td style={{ textAlign: "center", width: "10px" }}>{item.id}</td>
                                <td style={{ width: "50px", height:"70px" }}>
                                    <img src={item.images[0]} alt={"house" + item.id} style={{ width: "70px" }} />
                                </td>
                                <td>{item.address}</td>
                                <td><span style={item.published ? {color:"green"} : {color:"red"} }>{item.published ? 'Published' : 'Unpublished'}</span></td>
                                <td style={{ width: '50px' }}>
                                    <Link href={'/dashboard/property/update/' + item.id} style={{ width: "min-content" }}>
                                        <Button variant="warning">Modify</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <div style={{ display: "flex", width: "100%", justifyContent: "center", margin: "20px 0" }}>
                    {house.links.map((link, index) => {
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
        </>
    );
}
