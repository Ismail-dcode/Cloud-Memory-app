import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { ArrowLeft, Pencil, Trash2, MapPin, CalendarDays } from "lucide-react";
import Loader from "../components/Loader.jsx";

export default function MemoryDetails() {
    const { id } = useParams();
    const [memory, setMemory] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.getMemory(id).then(setMemory).catch((e) => setError(e.message));
    }, [id]);
    // Loading placeholder handled below

    async function handleDelete() {
        if (!window.confirm("Delete this memory? Its photos will also be removed.")) return;
        try {
            await api.deleteMemory(id);
            navigate("/memories");
        } catch (err) {
            setError(err.message);
        }
    }

    if (error) return <p className="max-w-3xl mx-auto px-4 md:px-6 py-10 text-red-700">{error}</p>;
    if (!memory) return <div className="max-w-3xl mx-auto px-4 md:px-6 py-10"><Loader label="Opening your memory..." /></div>;

    return (
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-10">
            <Link to="/memories" className="inline-flex items-center gap-1.5 text-[#8a8578] text-sm mb-6"><ArrowLeft size={16} /> Back to memories</Link>
            <h1 className="font-serif text-3xl md:text-4xl">{memory.title}</h1>
            <p className="text-[#8a8578] mt-2 flex gap-5 text-sm">
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} />{memory.date}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin size={15} />{memory.place}</span>
            </p>

            <div className="flex flex-col gap-5 my-10">
                {(memory.photos || []).map((p) => <img key={p.key} src={p.url} alt={memory.title} className="w-full rounded-3xl" />)}
            </div>

            <p className="text-[#333] leading-8 text-lg whitespace-pre-wrap">{memory.thought}</p>

            <div className="flex gap-3 mt-10">
                <Link to={`/memories/${id}/edit`} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2f5d43] text-white text-sm font-semibold"><Pencil size={16} /> Edit</Link>
                <button onClick={handleDelete} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-red-200 text-red-700 text-sm font-semibold"><Trash2 size={16} /> Delete</button>
            </div>
        </div>
    );
}
