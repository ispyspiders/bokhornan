import { Navigate, useLocation } from "react-router-dom";
import React, { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";


interface ProtectedAdminRouteProps {
    children: ReactNode
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    
    if (!user || (user.is_admin === 0)) {
        if(!user) return <Navigate to={'/login'} replace />
        return <Navigate to={location.pathname} replace />
    }

    return (
        <>
            {children}
        </>
    )
}
export default ProtectedAdminRoute