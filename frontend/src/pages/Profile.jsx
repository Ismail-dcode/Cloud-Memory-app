import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../services/auth.jsx";
import { LogOut, MapPin } from "lucide-react";

export default function Profile() {
    const { user, logout, refreshUser } = useAuth();
    const [memories, setMemories] = useState([]);
    const [bio, setBio] = useState(user.bio || "");
    const [editingBio, setEditingBio] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.listMemories().then(setMemories).catch((e) => setError(e.message));
    }, []);

    const places = new Set(memories.map((m) => m.place).filter(Boolean));

    async function saveBio() {
        try {
            await api.updateProfile({ bio });
            await refreshUser();
            setEditingBio(false);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="max-w-xl mx-auto px-6 py-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#e3efe6] text-[#2f5d43] font-serif text-4xl flex items-center justify-center">
                {user.name?.[0]?.toUpperCase()}
            </div>
            <h1 className="font-serif text-3xl mt-4">{user.name}</h1>
            <p className="text-[#8a8578] text-sm mt-1">{user.email}</p>

            <div className="mt-4 w-full">
                {editingBio ? (
                    <div className="flex flex-col gap-2">
                        <textarea rows={3} className="border border-[#e5dfd2] rounded-2xl p-3 w-full outline-none" value={bio} onChange={(e) => setBio(e.target.value)} />
                        <button onClick={saveBio} className="self-center px-6 py-2 rounded-full bg-[#2f5d43] text-white">Save</button>
                    </div>
                ) : (
                    <p className="text-[#555] cursor-pointer" onClick={() => setEditingBio(true)} title="Click to edit">
                        {user.bio || "Click here to add a bio..."}
                    </p>
                )}
            </div>

            {error && <p className="mt-4 text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

            <div className="bg-white border border-[#efe9dd] rounded-2xl flex gap-12 px-12 py-5 mt-8">
                <div><p className="font-serif text-3xl">{memories.length}</p><p className="text-[10px] tracking-[0.2em] text-[#8a8578]">MEMORIES</p></div>
                <div><p className="font-serif text-3xl">{places.size}</p><p className="text-[10px] tracking-[0.2em] text-[#8a8578]">PLACES</p></div>
            </div>

            <div className="bg-white border border-[#efe9dd] rounded-2xl w-full mt-6 text-left divide-y divide-[#f2ede3]">
                <div className="flex justify-between px-5 py-4 text-sm"><span className="text-[#8a8578]">Name</span><span>{user.name}</span></div>
                <div className="flex justify-between px-5 py-4 text-sm"><span className="text-[#8a8578]">Username</span><span>{user.username}</span></div>
                <div className="flex justify-between px-5 py-4 text-sm"><span className="text-[#8a8578]">Email</span><span>{user.email}</span></div>
                <div className="flex justify-between px-5 py-4 text-sm"><span className="text-[#8a8578]">Member since</span><span>October 2026</span></div>
            </div>

            <button onClick={() => { logout(); navigate("/login"); }} className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#e5dfd2] bg-white text-sm">
                <LogOut size={16} /> Log out
            </button>
        </div>
    );
}
