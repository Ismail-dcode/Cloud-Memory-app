import { Navigate } from "react-router-dom";
import { useAuth } from "../services/auth.jsx";
import Loader from "./Loader.jsx";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <Loader label="Opening your diary..." />;

    if (!user) return <Navigate to="/login" />;

    return children;
}
