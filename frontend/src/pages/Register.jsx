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
        <div className="max-w-md mx-auto px-6 py-10 md:py-16">
            <h1 className="font-serif text-3xl md:text-3xl md:text-4xl mb-2">Start your diary</h1>
            <p className="text-[#8a8578] mb-10">A few details and your moments have a home.</p>
            {error && <p className="text-red-700 bg-red-50 rounded-xl px-4 py-3 mb-6 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {fields.map(({ icon: Icon, label, value, set, type, ph }) => (
                    <div key={label}>
                        <label className="text-sm font-semibold text-[#555]">{label}</label>
                        <div className="mt-1.5 flex items-center gap-3 bg-white border border-[#e5dfd2] rounded-full px-4">
                            <Icon size={18} className="text-[#8a8578]" />
                            <input className="flex-1 py-3.5 outline-none bg-transparent" type={type} placeholder={ph} value={value} onChange={(e) => set(e.target.value)} required />
                        </div>
                    </div>
                ))}
                <button className="mt-2 w-full py-3.5 rounded-full bg-[#2f5d43] text-white font-semibold">Create Account</button>
            </form>
            <p className="mt-6 text-sm text-[#8a8578] text-center">Already have an account? <Link to="/login" className="text-[#2f5d43] font-semibold">Sign in</Link></p>
        </div>
    );
}
