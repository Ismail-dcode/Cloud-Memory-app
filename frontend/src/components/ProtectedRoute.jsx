import { Navigate } from "react-router-dom";
import { useAuth } from "../services/auth.jsx";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <p className="center">Loading...</p>;

    if (!user) return <Navigate to="/login" />;

    return children;
}
