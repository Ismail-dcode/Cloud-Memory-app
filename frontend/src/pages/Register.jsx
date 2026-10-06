import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { User, Mail, Lock, KeyRound } from "lucide-react";

export default function Register() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await api.register({ name, username, email, password, confirmPassword });
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    }

    const fields = [
        { icon: User, label: "Name", value: name, set: setName, type: "text", ph: "Your name" },
        { icon: User, label: "Username", value: username, set: setUsername, type: "text", ph: "your_username" },
        { icon: Mail, label: "Email", value: email, set: setEmail, type: "email", ph: "you@example.com" },
        { icon: Lock, label: "Password", value: password, set: setPassword, type: "password", ph: "••••••••" },
        { icon: KeyRound, label: "Confirm Password", value: confirmPassword, set: setConfirmPassword, type: "password", ph: "••••••••" },
    ];

    return (
        <div className="relative min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12">
            <img src="/images/mountain.jpg" alt="Mountains at sunrise" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/45 dark:bg-black/60" />
            <div className="relative z-10 w-full max-w-md bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-3xl p-8 md:p-10 text-white">
            <h1 className="font-serif text-3xl md:text-4xl mb-2 text-white">Start your diary</h1>
            <p className="text-white/70 mb-10">A few details and your moments have a home.</p>
            {error && <p className="text-red-200 bg-red-500/20 rounded-xl px-4 py-3 mb-6 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {fields.map(({ icon: Icon, label, value, set, type, ph }) => (
                    <div key={label}>
                        <label className="text-sm font-semibold text-white/80">{label}</label>
                        <div className="mt-1.5 flex items-center gap-3 bg-white/90 rounded-full px-4">
                            <Icon size={18} className="text-[#8a8578]" />
                            <input className="flex-1 py-3.5 outline-none bg-transparent text-[#1c1c1c]" type={type} placeholder={ph} value={value} onChange={(e) => set(e.target.value)} required />
                        </div>
                    </div>
                ))}
                <button className="mt-2 w-full py-3.5 rounded-full bg-[#2f5d43] text-white font-semibold">Create Account</button>
            </form>
            <p className="mt-6 text-sm text-white/70 text-center">Already have an account? <Link to="/login" className="text-white font-semibold">Sign in</Link></p>
            </div>
        </div>
    );
}
