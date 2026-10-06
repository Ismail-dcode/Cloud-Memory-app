import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./services/auth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Memories from "./pages/Memories.jsx";
import Timeline from "./pages/Timeline.jsx";
import Profile from "./pages/Profile.jsx";
import CreateMemory from "./pages/CreateMemory.jsx";
import MemoryDetails from "./pages/MemoryDetails.jsx";
import EditMemory from "./pages/EditMemory.jsx";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-[#faf7f0] text-[#1c1c1c] dark:bg-[#16130f] dark:text-[#ece7dd] font-sans flex flex-col">
                    <Navbar />
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/memories" element={<ProtectedRoute><Memories /></ProtectedRoute>} />
                            <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/memories/new" element={<ProtectedRoute><CreateMemory /></ProtectedRoute>} />
                            <Route path="/memories/:id" element={<ProtectedRoute><MemoryDetails /></ProtectedRoute>} />
                            <Route path="/memories/:id/edit" element={<ProtectedRoute><EditMemory /></ProtectedRoute>} />
                            <Route path="/dashboard" element={<Navigate to="/memories" />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}
