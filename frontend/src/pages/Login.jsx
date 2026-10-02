import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth.jsx";
import { Mail, Lock } from "lucide-react";

export default function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await login(identifier, password);
            navigate("/memories");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="grid md:grid-cols-2 min-h-[calc(100vh-73px)]">
            <div className="flex flex-col justify-center px-8 md:px-6 md:px-20 py-12">
                <h1 className="font-serif text-3xl md:text-3xl md:text-4xl mb-2">Welcome back</h1>
                <p className="text-[#8a8578] mb-10">Your memories are waiting for you.</p>
                {error && <p className="text-red-700 bg-red-50 rounded-xl px-4 py-3 mb-6 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-sm">
                    <label className="text-sm font-semibold text-[#555] -mb-3">Username or Email</label>
                    <div className="flex items-center gap-3 bg-white border border-[#e5dfd2] rounded-full px-4">
                        <Mail size={18} className="text-[#8a8578]" />
                        <input className="flex-1 py-3.5 outline-none bg-transparent" type="text" placeholder="username or you@example.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
                    </div>
                    <label className="text-sm font-semibold text-[#555] -mb-3">Password</label>
                    <div className="flex items-center gap-3 bg-white border border-[#e5dfd2] rounded-full px-4">
                        <Lock size={18} className="text-[#8a8578]" />
                        <input className="flex-1 py-3.5 outline-none bg-transparent" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button className="mt-2 self-start px-10 py-3.5 rounded-full bg-[#2f5d43] text-white font-semibold">Sign In</button>
                </form>
                <p className="mt-6 text-sm text-[#8a8578]">Don't have an account? <Link to="/register" className="text-[#2f5d43] font-semibold">Sign up</Link></p>
            </div>
            <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-[#2f5d43] via-[#4a7a5e] to-[#7fa88c] p-12">
                <blockquote className="font-serif text-3xl text-white leading-relaxed max-w-md">
                    “We travel not to escape life, but for life not to escape us.”
                    <cite className="block mt-4 font-sans not-italic text-sm text-[#cfe3d3]">— Memory Diary</cite>
                </blockquote>
            </div>
        </div>
    );
}
