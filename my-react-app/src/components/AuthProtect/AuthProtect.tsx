import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";


export default function AuthProtect({ children }: { children: React.ReactNode }) {
    
    const { userToken } = useContext(AuthContext);
    if (userToken) {
        return <Navigate to="/feed" />;
    }
    return <>{children}</>;
}
