import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

export default function Timeline() {
    const [memories, setMemories] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        api.listMemories().then(setMemories).catch((e) => setError(e.message));
    }, []);

    const sorted = [...memories].sort((a, b) => b.date.localeCompare(a.date));
    const groups = {};
    sorted.forEach((m) => {
        const d = new Date(m.date);
        const year = String(d.getFullYear());
        const month = d.toLocaleString("default", { month: "long" }).toUpperCase();
        groups[year] = groups[year] || {};
        groups[year][month] = groups[year][month] || [];
        groups[year][month].push(m);
    });

    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="font-serif text-4xl">Timeline</h1>
            <p className="text-[#8a8578] mt-1">Leaf back through your days.</p>
            {error && <p className="mt-6 text-red-700 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
            {sorted.length === 0 && !error && <p className="mt-10 text-[#8a8578]">No memories yet.</p>}

            {Object.entries(groups).map(([year, months]) => (
                <div key={year}>
                    <p className="font-serif text-5xl text-[#e0d8c8] mt-10">{year}</p>
                    {Object.entries(months).map(([month, items]) => (
                        <div key={month}>
                            <p className="text-[11px] tracking-[0.25em] text-[#2f5d43] font-semibold mt-6 mb-4">{month}</p>
                            <div className="border-l-2 border-[#e5dfd2] ml-1 pl-6 flex flex-col gap-4">
                                {items.map((m) => (
                                    <Link to={`/memories/${m.memoryId}`} key={m.memoryId} className="relative bg-white border border-[#efe9dd] rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition">
                                        <span className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#2f5d43]" />
                                        {m.photos?.[0] && <img src={m.photos[0].url} alt={m.title} className="w-14 h-14 rounded-xl object-cover" />}
                                        <div>
                                            <h3 className="font-serif text-lg">{m.title}</h3>
                                            <p className="text-[#8a8578] text-xs">{m.place} · {m.date}</p>
                                        </div>
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
