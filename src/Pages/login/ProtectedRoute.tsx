import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export interface ProtectedRouteProps {
    children: React.ReactNode;
}
export const ProtectedRoute: React.FC<ProtectedRouteProps> = props => {

    const isLoggedIn = useSelector ((state:any)=>state.auth.isLoggedIn)
    if (!isLoggedIn) {
        // user is not authenticated
        return <Navigate to="/" />;
    }
    return <>{props.children}</>;
};