import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import Loader from "../components/Loader.jsx";

export default function Timeline() {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.listMemories().then(setMemories).catch((e) => setError(e.message)).finally(() => setLoading(false));
    }, []);

    const sorted = [...memories].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    const groups = {};
    sorted.forEach((m) => {
        const d = new Date(m.date);
        const valid = !isNaN(d.getTime());
        const year = valid ? String(d.getFullYear()) : "No Date";
        const month = valid ? d.toLocaleString("default", { month: "long" }).toUpperCase() : "UNDATED";
        groups[year] = groups[year] || {};
        groups[year][month] = groups[year][month] || [];
        groups[year][month].push(m);
    });

    return (
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
            <h1 className="font-serif text-3xl md:text-4xl">Timeline</h1>
            <p className="text-[#8a8578] dark:text-[#9a9486] mt-1">Leaf back through your days.</p>
            {error && <p className="mt-6 text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
            {loading && <Loader label="Loading your timeline..." />}
            {!loading && sorted.length === 0 && !error && <p className="mt-10 text-[#8a8578] dark:text-[#9a9486]">No memories yet.</p>}

            {Object.entries(groups).map(([year, months]) => (
                <div key={year}>
                    <p className="font-serif text-5xl text-[#e0d8c8] mt-10">{year}</p>
                    {Object.entries(months).map(([month, items]) => (
                        <div key={month}>
                            <p className="text-[11px] tracking-[0.25em] text-[#2f5d43] font-semibold mt-6 mb-4">{month}</p>
                            <div className="border-l-2 border-[#e5dfd2] ml-1 pl-6 flex flex-col gap-4">
                                {items.map((m) => (
                                    <Link to={`/memories/${m.memoryId}`} key={m.memoryId} className="relative rounded-2xl overflow-hidden hover:shadow-md transition block">
                                        <span className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#2f5d43] z-10" />
                                        {m.photos?.[0] ? (
                                            <>
                                                <img src={m.photos[0].url} alt={m.title} className="w-full h-40 object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                                <div className="absolute inset-x-0 bottom-0 p-4 bg-black/30 backdrop-blur-sm">
                                                    <h3 className="font-serif text-lg text-white">{m.title}</h3>
                                                    <p className="text-white/80 text-xs">{m.place} · {m.date}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="bg-white dark:bg-[#1e1a15] border border-[#efe9dd] dark:border-[#2a251e] rounded-2xl p-4">
                                                <h3 className="font-serif text-lg">{m.title}</h3>
                                                <p className="text-[#8a8578] dark:text-[#9a9486] text-xs">{m.place} · {m.date}</p>
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
