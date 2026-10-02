import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth.jsx";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const tab = ({ isActive }) =>
        `px-4 py-1.5 rounded-full text-sm transition ${isActive ? "bg-[#e3efe6] text-[#2f5d43] font-semibold" : "text-[#666] hover:text-[#1c1c1c]"}`;

    return (
        <nav className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[#efe9dd] flex items-center justify-between px-6 md:px-10 py-4">
            <Link to="/" className="font-serif text-xl font-bold">
                Memory <em className="text-[#2f5d43] italic">Diary</em>
            </Link>

            <div className="flex gap-1">
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

            <div className="flex gap-2 items-center">
                {user ? (
                    <button onClick={() => { logout(); navigate("/login"); }} className="px-4 py-2 rounded-full border border-[#e5dfd2] text-sm bg-white hover:bg-gray-50">Log out</button>
                ) : (
                    <>
                        <Link to="/login" className="px-4 py-2 text-sm text-[#555]">Sign in</Link>
                        <Link to="/register" className="px-5 py-2.5 rounded-full bg-[#2f5d43] text-white text-sm font-semibold">Start your diary</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
