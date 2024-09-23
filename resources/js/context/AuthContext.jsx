import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider ({ children }) {
    const [user, setUser ] = useState();
    const [html, setHtml ] = useState();
    const [loginSuccessful, setLoginSuccessful ] = useState(false);

    useEffect(()=>{
        fetch('/api/authorization')
        .then(res=>res.json())
        .then(res=>{
            if(res.status === 403){
                window.location.href = '/';
                return;
            }

            setUser(res.user);
            setLoginSuccessful(true)
            setHtml();
        })
        .catch(e=>{
            window.location.href = '/';
        })
    },[])


    return(
        <AuthContext.Provider value={{ user, html, loginSuccessful }}>
            { children }
        </AuthContext.Provider>
    )
}