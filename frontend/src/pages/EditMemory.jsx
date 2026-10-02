import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { ArrowLeft, ImagePlus } from "lucide-react";

export default function EditMemory() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [thought, setThought] = useState("");
    const [place, setPlace] = useState("");
    const [date, setDate] = useState("");
    const [existingPhotos, setExistingPhotos] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        api.getMemory(id).then((m) => {
            setTitle(m.title); setThought(m.thought); setPlace(m.place); setDate(m.date);
            setExistingPhotos(m.photos || []);
        }).catch((e) => setError(e.message));
    }, [id]);

    function handleFiles(e) {
        const files = Array.from(e.target.files || []);
        setPhotos(files);
        setPreviews(files.map((f) => URL.createObjectURL(f)));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        const formData = new FormData();
        formData.append("title", title);
        formData.append("thought", thought);
        formData.append("place", place);
        formData.append("date", date);
        photos.forEach((f) => formData.append("photos", f));
        try {
            await api.updateMemory(id, formData);
            navigate(`/memories/${id}`);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 md:px-6 py-10">
            <Link to={`/memories/${id}`} className="inline-flex items-center gap-1.5 text-[#8a8578] text-sm mb-6"><ArrowLeft size={16} /> Back to memory</Link>
            <h1 className="font-serif text-3xl md:text-4xl mb-8">Edit memory</h1>
            {error && <p className="text-red-700 bg-red-50 rounded-xl px-4 py-3 mb-6">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <label className="text-sm font-semibold text-[#555]">Title</label>
                    <input className="mt-1.5 w-full bg-white border border-[#e5dfd2] rounded-full px-5 py-3.5 outline-none focus:border-[#2f5d43]" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label className="text-sm font-semibold text-[#555]">What happened?</label>
                    <textarea rows={5} className="mt-1.5 w-full bg-white border border-[#e5dfd2] rounded-3xl px-5 py-4 outline-none focus:border-[#2f5d43]" value={thought} onChange={(e) => setThought(e.target.value)} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-[#555]">Where were you?</label>
                        <input className="mt-1.5 w-full bg-white border border-[#e5dfd2] rounded-full px-5 py-3.5 outline-none focus:border-[#2f5d43]" value={place} onChange={(e) => setPlace(e.target.value)} required />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-[#555]">When?</label>
                        <input type="date" className="mt-1.5 w-full bg-white border border-[#e5dfd2] rounded-full px-5 py-3.5 outline-none focus:border-[#2f5d43]" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-[#555]">Existing photos</label>
                    <div className="flex gap-3 mt-2 flex-wrap">
                        {existingPhotos.map((p) => <img key={p.key} src={p.url} alt="existing" className="w-20 h-20 object-cover rounded-xl" />)}
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-[#555]">Add photos</label>
                    <label className="mt-1.5 block border-2 border-dashed border-[#d8d2c4] rounded-3xl p-10 text-center cursor-pointer hover:border-[#2f5d43] transition">
                        <div className="w-12 h-12 rounded-full bg-[#e3efe6] flex items-center justify-center mx-auto mb-3">
                            <ImagePlus size={22} className="text-[#2f5d43]" />
                        </div>
                        <p className="font-semibold">Add photos</p>
                        <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleFiles} />
                    </label>
                    <div className="flex gap-3 mt-4 flex-wrap">
                        {previews.map((src, i) => <img key={i} src={src} alt="preview" className="w-20 h-20 object-cover rounded-xl" />)}
                    </div>
                </div>

                <button className="self-center px-10 py-3.5 rounded-full bg-[#2f5d43] text-white font-semibold">Save Changes</button>
            </form>
        </div>
    );
}
