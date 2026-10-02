import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth.jsx";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const close = () => setOpen(false);

    const tab = ({ isActive }) =>
        `px-3 py-1.5 md:px-4 rounded-full text-sm whitespace-nowrap transition ${isActive ? "bg-[#e3efe6] text-[#2f5d43] font-semibold" : "text-[#666] hover:text-[#1c1c1c]"}`;

    return (
        <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[#efe9dd] flex flex-wrap items-center justify-between gap-2 px-4 md:px-10 py-3 md:py-4">
            <Link to="/" className="font-serif text-xl font-bold">
                Memory <em className="text-[#2f5d43] italic">Diary</em>
            </Link>

            <div className="hidden md:flex gap-1">
                {user ? (
                    <>
                        <NavLink to="/memories" className={tab}>Memories</NavLink>
                        <NavLink to="/timeline" className={tab}>Timeline</NavLink>
                        <NavLink to="/memories/new" className={tab}>New Memory</NavLink>
                        <NavLink to="/profile" className={tab}>Profile</NavLink>
                    </>
                ) : (
                    <NavLink to="/" end className={tab}>Home</NavLink>
                )}
            </div>

            {open && (
                <div className="md:hidden w-full flex flex-col gap-1 pb-2">
                    {user ? (
                        <>
                            <NavLink to="/memories" onClick={close} className={tab}>Memories</NavLink>
                            <NavLink to="/timeline" onClick={close} className={tab}>Timeline</NavLink>
                            <NavLink to="/memories/new" onClick={close} className={tab}>New Memory</NavLink>
                            <NavLink to="/profile" onClick={close} className={tab}>Profile</NavLink>
                        </>
                    ) : (
                        <NavLink to="/" end onClick={close} className={tab}>Home</NavLink>
                    )}
                </div>
            )}

            <div className="flex gap-2 items-center order-2">
                <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
                {user ? (
                    <button onClick={() => { logout(); navigate("/login"); }} className="px-4 py-2 rounded-full border border-[#e5dfd2] text-sm bg-white hover:bg-gray-50">Log out</button>
                ) : (
                    <>
                        <Link to="/login" className="px-4 py-2 text-sm text-[#555]">Sign in</Link>
                        <Link to="/register" className="px-4 py-2 rounded-full bg-[#2f5d43] text-white text-sm font-semibold whitespace-nowrap">Start your diary</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
