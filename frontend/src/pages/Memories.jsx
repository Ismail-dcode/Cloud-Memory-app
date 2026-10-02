import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../services/auth.jsx";
import { Search, MapPin, CalendarDays, Plus } from "lucide-react";

export default function Memories() {
    const { user } = useAuth();
    const [memories, setMemories] = useState([]);
    const [search, setSearch] = useState("");
    const [place, setPlace] = useState("All");
    const [sort, setSort] = useState("recent");
    const [error, setError] = useState("");

    useEffect(() => {
        api.listMemories().then(setMemories).catch((e) => setError(e.message));
    }, []);

    const places = useMemo(() => ["All", ...new Set(memories.map((m) => m.place).filter(Boolean))], [memories]);

    const visible = memories
        .filter((m) => (m.title + m.thought).toLowerCase().includes(search.toLowerCase()))
        .filter((m) => place === "All" || m.place === place)
        .sort((a, b) => sort === "recent" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
            <div className="flex justify-between items-end flex-wrap gap-4">
                <div>
                    <h1 className="font-serif text-3xl md:text-4xl">{greeting}, {user.name}.</h1>
                    <p className="text-[#8a8578] mt-1">Your memories, collected in one place.</p>
                </div>
                <Link to="/memories/new" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2f5d43] text-white font-semibold">
                    <Plus size={18} /> Create Memory
                </Link>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
                <div className="flex items-center gap-2 flex-1 min-w-[240px] bg-white border border-[#e5dfd2] rounded-full px-4">
                    <Search size={18} className="text-[#8a8578]" />
                    <input className="flex-1 py-3 outline-none bg-transparent" placeholder="Search your memories..." value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <select className="bg-white border border-[#e5dfd2] rounded-full px-4 py-3 outline-none" value={place} onChange={(e) => setPlace(e.target.value)}>
                    {places.map((p) => <option key={p} value={p}>{p === "All" ? "All places" : p}</option>)}
                </select>
                <div className="flex gap-2">
                    {["recent", "oldest"].map((s) => (
                        <button key={s} onClick={() => setSort(s)} className={`px-5 py-3 rounded-full border ${sort === s ? "bg-[#e3efe6] text-[#2f5d43] border-transparent font-semibold" : "bg-white border-[#e5dfd2]"}`}>
                            {s === "recent" ? "Recent" : "Oldest"}
                        </button>
                    ))}
                </div>
            </div>

            {error && <p className="mt-6 text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
            {visible.length === 0 && !error && <p className="mt-10 text-[#8a8578]">No memories yet. Create your first one.</p>}

            <div className="grid md:grid-cols-3 gap-7 mt-10">
                {visible.map((m) => (
                    <Link key={m.memoryId} to={`/memories/${m.memoryId}`} className="bg-white rounded-3xl overflow-hidden border border-[#efe9dd] hover:-translate-y-1 hover:shadow-xl transition block">
                        {m.photos?.[0] && <img src={m.photos[0].url} alt={m.title} className="w-full h-56 object-cover" />}
                        <div className="p-5">
                            <h3 className="font-serif text-xl">{m.title}</h3>
                            <p className="text-[#8a8578] text-sm mt-1 flex gap-4">
                                <span className="inline-flex items-center gap-1"><MapPin size={14} />{m.place}</span>
                                <span className="inline-flex items-center gap-1"><CalendarDays size={14} />{m.date}</span>
                            </p>
                            <p className="text-[#555] text-sm mt-3 line-clamp-3">{m.thought}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
