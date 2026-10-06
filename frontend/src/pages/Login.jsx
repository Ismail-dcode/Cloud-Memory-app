import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth.jsx";
import { Mail, Lock } from "lucide-react";

export default function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await login(identifier, password);
            navigate("/memories");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="relative min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12">
            <img src="/images/mountain.jpg" alt="Mountains at sunrise" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/45 dark:bg-black/60" />
            <div className="relative z-10 w-full max-w-md bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-3xl p-8 md:p-10 text-white">
                <h1 className="font-serif text-3xl md:text-4xl mb-2 text-white">Welcome back</h1>
                <p className="text-white/70 mb-10">Your memories are waiting for you.</p>
                {error && <p className="text-red-200 bg-red-500/20 rounded-xl px-4 py-3 mb-6 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <label className="text-sm font-semibold text-white/80 -mb-3">Username or Email</label>
                    <div className="flex items-center gap-3 bg-white/90 rounded-full px-4">
                        <Mail size={18} className="text-[#8a8578]" />
                        <input className="flex-1 py-3.5 outline-none bg-transparent text-[#1c1c1c]" type="text" placeholder="username or you@example.com" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
                    </div>
                    <label className="text-sm font-semibold text-white/80 -mb-3">Password</label>
                    <div className="flex items-center gap-3 bg-white/90 rounded-full px-4">
                        <Lock size={18} className="text-[#8a8578]" />
                        <input className="flex-1 py-3.5 outline-none bg-transparent text-[#1c1c1c]" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button disabled={submitting} className="mt-2 self-start px-10 py-3.5 rounded-full bg-[#2f5d43] text-white font-semibold disabled:opacity-60 inline-flex items-center gap-2">
                        {submitting && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-90" d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>}
                        {submitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <p className="mt-6 text-sm text-white/70">Don't have an account? <Link to="/register" className="text-white font-semibold">Sign up</Link></p>
            </div>
        </div>
    );
}
