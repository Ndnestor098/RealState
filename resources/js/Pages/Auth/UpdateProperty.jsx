import React, { useEffect, useRef, useState } from "react";
import { HeaderAdministrator } from "@/Components/admin/Header"; // Componente de encabezado
import SunEditor from 'suneditor'; // Editor de texto enriquecido
import 'suneditor/dist/css/suneditor.min.css'; // Estilos del editor
import plugins from 'suneditor/src/plugins'; // Plugins para el editor
import { Head, router, useForm } from "@inertiajs/react";
import { CancelButton } from "@/Components/ui/Icon";

export default function CreateProperties({ auth, house, typeHouse, feature }) {
    const [isSubmittingDelete, setIsSubmittingDelete] = useState(false); // Estado para controlar la eliminacion del producto
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el envío del formulario

    const editorRef = useRef(null); // Referencia al editor de texto

    const { data, setData, post, errors } = useForm({
        address : house.address ?? "",
        images_old : house.images ?? "",
        images : "",
        description : house.description ?? "",
        price : house.price ?? "",
        size : house.size ?? "",
        bathroom : house.bathroom ?? "",
        date_construction : house.date_construction ?? "",
        floor : house.floor ?? "",
        features : house.features ?? [],
        quarters : house.quarters ?? "",
        type_house : house.typeHouse ?? "",
        published : house.published ?? "",
    });
    
    const handleChange = (e) => {
        const key = e.target.name;
        const value = e.target.value;
        
        if (key === "images") {
            // Convertir el FileList a un array
            const filesArray = Array.from(e.target.files);
            setData(values => ({
                ...values,
                [key]: filesArray 
            }));
            return;
        }

        if (key === "feature") {
            let newFeatures = Array.isArray(data.features) ? [...data.features] : [];
            
            if (e.target.checked) {
                if (!newFeatures.includes(value)) {
                    newFeatures.push(Number(value));
                } 
            } else {
                newFeatures = newFeatures.filter(item => item !== Number(value));
            }

            setData(values => ({
                ...values,
                features: newFeatures 
            }));
            
            return;
        }

        if (key === "published") {
            setData(values => ({
                ...values,
                [key]: e.target.checked ? true : false 
            }));
            return;
        }
        
        setData(values => ({
            ...values,
            [key]: value,
            description: editorRef.current.getContents(), 
        }));
    }

    // Efecto para inicializar el editor de texto enriquecido
    useEffect(() => { 
        editorRef.current = SunEditor.create(document.getElementById('description'), { // Inicializa el editor
            plugins: plugins, // Agregar plugins
            buttonList: [ // Lista de botones para el editor
                ['undo', 'redo'],
                ['bold', 'italic', 'underline', 'fontColor', 'fontSize', 'align', 'list'],
                ['align', 'horizontalRule', 'list', 'lineHeight'],
                ['fullScreen', 'showBlocks', 'codeView'],
            ],
            height: '300px', // Altura del editor
            width: '100%'
        });
        
    }, []); // Dependencia del efecto: se ejecuta al cargar datos
   
    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        setIsSubmitting(true);


        post("/dashboard/property/update/"+house.id, {
            onSuccess : ()=>{
                setIsSubmitting(false);
            },
            onFinish : ()=>{
                setIsSubmitting(false);
            },
        })

    };

    const handleDelete = () => {
        if(confirm("Do you want to continue?")){
            setIsSubmittingDelete(true);

            router.delete('/dashboard/property/delete/' + house.id, {
                onSuccess : () => {
                    setIsSubmittingDelete(false);
                },
                onError : () =>{    
                    setIsSubmittingDelete(false);
                },
                onFinish : () =>{    
                    setIsSubmittingDelete(false);
                },
            });
        }
    }

    console.log(typeHouse);

    return (
        <>
            <Head title="Create Properties" />

            <HeaderAdministrator user={auth}/>

            {/* Contenedor principal con estilos para centrar el formulario */}
            <div style={{ width: "100%", padding: "100px 0", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <form 
                    className="form" 
                    id="form" 
                    style={{ maxWidth: "600px", width: "100%" }}  // Estilos del formulario
                    onSubmit={handleSubmit}  // Función que maneja el envío del formulario
                >
                    {/* Titulo de Update */}
                    <div className="title" style={{ margin:"0" }}>
                        Update Propertie,
                        <br />
                        <span>
                            Update the info to continue.
                        </span>
                    </div>

                    {/* Campo para la dirección */}
                    <div style={{ width:"100%" }}>
                        <div className="title" style={{ margin:"0", marginBottom:"5px"}}>
                            <span>Address *</span>  {/* Etiqueta para el campo de dirección */}
                        </div>
                        <input
                            style={{ fontWeight: "600", fontFamily: "Arial" }}
                            className="input-visit"
                            name="address"  // Nombre del campo
                            placeholder="Address"
                            id="address"
                            onChange={handleChange}
                            value={data.address}
                            type="text"
                            required  // Campo obligatorio
                        />
                        <p style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                            {errors.address}  
                        </p>
                    </div>

                    {/* Sección de imágenes */}
                    <div style={{ width:"100%" }}>
                        <div className="title" style={{ margin:"0", marginBottom:"5px"}}>
                            <span>Images *</span>  {/* Etiqueta para las imágenes */}
                        </div>

                        {/* Campo para subir nuevas imágenes */}
                        <input
                            style={{ fontWeight: "600", fontFamily: "Arial" }}
                            className="input-visit"
                            name="images"  // Nombre del campo para las nuevas imágenes
                            placeholder="Images"
                            type="file"
                            id="images"
                            onChange={handleChange}
                            multiple  // Permite subir múltiples imágenes
                            accept="image/*"  // Acepta solo archivos de imagen
                        />
                        <div style={{ display:"flex", gap:"5px", marginTop:"15px", flexWrap:"wrap" }}>
                            {
                                data.images_old && data.images_old.map((item)=>(
                                    <div key={item} style={{ position:"relative" }}>
                                        <img src={"http://127.0.0.1:8000/storage/"+item} alt={"Image " + item} style={{ width:"100px" }} />
                                        <span 
                                            style={{ position:"absolute", top:"1px", right:"1px", cursor:"pointer" }}
                                            onClick={()=>{
                                                setData(values => ({
                                                    ...values,
                                                    images_old : data.images_old.filter(array => array !== item)
                                                }));
                                            }}
                                        >
                                            <CancelButton style={{ color:"red" }}/>
                                        </span>
                                    </div>
                                ))
                            }
                        </div>

                        <p style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                            {errors.images}  
                        </p>
                    </div>

                    {/* Campo para la descripción */}
                    <div style={{ width:"100%" }}>
                        <div className="title" style={{ margin:"0", textAlign:"center", marginBottom:"5px" }}>
                            <span>Modify Properties *</span>  {/* Etiqueta para la descripción */}
                        </div>
                        <textarea id="description" name="description">{data.description}</textarea>  {/* Campo de descripción */}
                        <p style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                            {errors.description}  
                        </p>
                    </div>
                    
                    {/* Sección para precio y tamaño */}
                    <div style={{ width:"100%", display:"flex", gap:"10px", justifyContent:"space-between" }}>
                        <div>
                            <div className="title" style={{ margin:"0", marginBottom:"5px" }}>
                                <span>Price *</span>  {/* Etiqueta para el precio */}
                            </div>
                            <input
                                style={{ fontWeight: "600", fontFamily: "Arial" }}
                                className="input-visit"
                                name="price"  // Nombre del campo para precio
                                placeholder="Price"
                                id="price"
                                onChange={handleChange}
                                value={data.price}
                                type="number"
                                step="0.01"  // Permite decimales
                                required  // Campo obligatorio
                            />
                            <p style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                                {errors.price}  
                            </p>
                        </div>
                        <div>
                            <div className="title" style={{ margin:"0", marginBottom:"5px" }}>
                                <span>Size (mt2) *</span>  {/* Etiqueta para el tamaño */}
                            </div>
                            <input
                                style={{ fontWeight: "600", fontFamily: "Arial"}}
                                className="input-visit"
                                name="size"  // Nombre del campo para tamaño
                                placeholder="Size"
                                value={data.size}
                                onChange={handleChange}
                                id="size"
                                type="number"
                                required  // Campo obligatorio
                            />
                            <p style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                                {errors.size}  
                            </p>
                        </div>
                    </div>

                    {/* Sección para baños y habitaciones */}
                    <div style={{ width:"100%", display:"flex", gap:"10px", justifyContent:"space-between" }}>
                        <div>
                            <div className="title" style={{ margin:"0", marginBottom:"5px" }}>
                                <span>Bathroom *</span>  {/* Etiqueta para baños */}
                            </div>
                            <input
                                style={{ fontWeight: "600", fontFamily: "Arial"}}
                                className="input-visit"
                                name="bathroom"  // Nombre del campo para baños
                                placeholder="Bathroom"
                                type="number"
                                onChange={handleChange}
                                id="bathroom"
                                value={data.bathroom}
                                required  // Campo obligatorio
                            />
                            <p style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                                {errors.bathroom}  
                            </p>
                        </div>
                        <div>
                            <div className="title" style={{ margin:"0", marginBottom:"5px" }}>
                                <span>Room *</span>  {/* Etiqueta para habitaciones */}
                            </div>
                            <input
                                style={{ fontWeight: "600", fontFamily: "Arial"}}
                                className="input-visit"
                                name="quarters"  // Nombre del campo para habitaciones
                                placeholder="Room"
                                onChange={handleChange}
                                value={data.quarters}
                                id="quarters"
                                type="number"
                                required  // Campo obligatorio
                            />
                            <p style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                                {errors.quarters}  
                            </p>
                        </div>
                    </div>

                    {/* Sección para piso y fecha de construcción */}
                    <div style={{ width:"100%", display:"flex", gap:"10px", justifyContent:"space-between" }}>
                        <div>
                            <div className="title" style={{ margin:"0", marginBottom:"5px" }}>
                                <span>Floor</span>  {/* Etiqueta para piso */}
                            </div>
                            <input
                                style={{ fontWeight: "600", fontFamily: "Arial"}}
                                className="input-visit"
                                name="floor"  // Nombre del campo para piso
                                placeholder="Floor"
                                onChange={handleChange}
                                id="floor"
                                value={data.floor}
                                type="number"
                            />
                            <p style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                                {errors.floor}  
                            </p>
                        </div>
                        <div style={{  width:"100%", maxWidth:"243px" }}>
                            <div className="title" style={{ margin:"0", marginBottom:"5px" }}>
                                <span>Date of Construction *</span>  {/* Etiqueta para fecha de construcción */}
                            </div>
                            <input
                                style={{ fontWeight: "600", fontFamily: "Arial" }}
                                className="input-visit"
                                name="date_construction"  // Nombre del campo para fecha de construcción
                                placeholder="Date of Construction"
                                type="date"
                                value={data.date_construction}
                                onChange={handleChange}
                                id="date_construction"
                                required  // Campo obligatorio
                            />
                            <p style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                                {errors.date_construction}  
                            </p>
                        </div>
                    </div>

                    {/* Tipo de casa */}
                    <div style={{ width:"100%" }}>
                        <div className="title" style={{ margin:"0", marginBottom:"5px" }}>
                            <span>House Type</span>  {/* Etiqueta para tipo de casa */}
                        </div>
                        <select 
                            name="type_house" 
                            id="type_house" 
                            onChange={handleChange}
                            className="input-visit"
                            style={{ fontWeight: "600", fontFamily: "Arial" }}
                            defaultValue={ house.typeHouse ?? ""}
                        >
                            <option value="" disabled>Select the type of house</option>  {/* Opción por defecto */}
                            {
                                typeHouse && typeHouse.map(item => {
                                    return (
                                        <option 
                                        key={item.id}   
                                        value={item.id} 
                                        style={{ textTransform:"capitalize" }}  // Estilo para capitalizar el texto
                                        >
                                            {item.name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                        <p style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                            {errors.type_house}  
                        </p>
                    </div>
                    
                    {/* Características de la casa */}
                    <div style={{ width:"100%" }}>
                        <div className="title" style={{ margin:"0", marginBottom:"5px" }}>
                            <span>Features</span>  {/* Etiqueta para características */}
                        </div>
                        <div style={{ display: "flex", width: "100%", flexWrap: "wrap", gap: "20px", marginLeft: "5px" }}>
                            {feature.length > 0 && feature.map((item) => (
                                <div key={item.id} style={{ width: "100px", display: "flex", alignItems: "center" }}>
                                    <label className="container-checkbox">
                                        <input  
                                            type="checkbox" 
                                            name="feature"            
                                            id={`feature-${item.id}`}
                                            onChange={handleChange} 
                                            value={item.id}     
                                            checked={data.features.includes(item.id)}
                                        />
                                        <div className="checkmark checkmark_feature"></div> {/* Estilo para el checkbox */}
                                    </label>
                                    <span style={{ textTransform: "capitalize", marginTop: "3px" }}>
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                            {errors.features}  
                        </p>
                    </div>

                    {/* Publicación de la propiedad */}
                    <div style={{ width:"100%" }}>
                        <div className="title" style={{ margin:"0", marginBottom:"5px" }}>
                            <span>Public</span>  {/* Etiqueta para publicación */}
                        </div>
                        <div style={{ display:"flex", width:"100%", alignItems:"center", marginLeft:"5px" }}>
                            <label className="container-checkbox">
                                <input  
                                    type="checkbox" 
                                    name='published'  // Nombre del campo para publicación
                                    id='published' 
                                    onChange={handleChange} 
                                    checked={data.published ?? false}

                                />
                                <div className="checkmark checkmark_feature"></div>  {/* Estilo para el checkbox */}
                            </label>
                            <span style={{ textTransform:"capitalize", marginTop:"3px" }}>
                                Published 
                            </span>
                        </div>
                        <p style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                            {errors.published}
                        </p>
                    </div>
                 
                    {/* Botones de acción */}
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                        <span 
                            className="button-confirm" 
                            style={{ margin: "0", paddingTop: "5px", textAlign: "center", width:"180px" }} 
                            disabled={isSubmittingDelete} 
                            onClick={handleDelete}
                        >
                            {isSubmittingDelete ? 'Deleting...' : 'Delete Property→'}  {/* Botón para eliminar la propiedad */}
                        </span>
                        
                        <button className="button-confirm" type="submit" style={{ margin: "0", width:"180px" }} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Update Property→'}  {/* Botón para modificar la propiedad */}
                        </button>
                    </div>
                </form>

            </div>
        </>
    );
}