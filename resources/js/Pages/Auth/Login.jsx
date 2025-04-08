import {React, useState } from "react";
import { CancelButton } from "@/Components/ui/Icon";
import { useForm, Link, Head } from "@inertiajs/react";

export default function Login() {
    // Estado para manejar el error, el token CSRF y el estado de envío
    const { data, setData, post, errors} = useForm({
        email : "",
        password : ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // Función para manejar el inicio de sesión
    const handleSubmit = (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        setIsSubmitting(true);

        post(import.meta.env.APP_URL + '/login', {
            onError : ()=>{
                setIsSubmitting(false);
            },
            onSuccess : (page) => {
                setIsSubmitting(false);
                if(page.props.status === 200){
                    window.location.href = "/dashboard"; 
                }else{
                    alert("Error en el inicio de sesión");
                }
            }
        }) 
    };

    return (
        <>
            <Head title="Login"/>
            <Link href={'/'} style={{ position: "absolute", top: "5px", left: "5px", cursor: "pointer", color: "#000" }}>
                <CancelButton style={{ width: "30px" }} /> {/* Botón para cancelar */}
            </Link>

            <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ maxHeight: "400px" }}>
                    <form method="post" className="form" id="form" onSubmit={handleSubmit}>
                        <div className="title">
                            Welcome,
                            <br />
                            <span>
                                sign up to continue
                            </span>
                        </div>
                        {/* Campo para el email */}
                        <input
                            style={{ fontWeight: "600", fontFamily: "Arial" }}
                            className="input-visit"
                            name="email"
                            placeholder="Email"
                            value={data.email}
                            type="email"
                            onChange={(e)=>{setData('email', e.target.value)}}
                            required
                        />
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            {/* Mensaje de error */}
                            <span style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                                {errors.email}
                            </span>
                        </div>
                        {/* Campo para la contraseña */}
                        <input
                            style={{ fontWeight: "600", fontFamily: "Arial" }}
                            className="input-visit"
                            name="password"
                            value={data.password}
                            placeholder="Password"
                            type="password"
                            onChange={(e)=>{setData('password', e.target.value)}}
                            required
                        />
                        <div style={{ width: '100%', textAlign: 'center' }}>
                            {/* Mensaje de error */}
                            <span style={{ textAlign: "center", fontSize: "13px", color: "red", fontWeight: "600", width: "100%" }}>
                                {errors.password}
                            </span>
                        </div>
                        {/* Botón para enviar el formulario */}
                        <button className="button-confirm" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Let’s go →'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
