import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { ImagePlus, ArrowLeft } from "lucide-react";

export default function CreateMemory() {
    const [title, setTitle] = useState("");
    const [thought, setThought] = useState("");
    const [place, setPlace] = useState("");
    const [date, setDate] = useState("");
    const [photos, setPhotos] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    function handleFiles(e) {
        const files = Array.from(e.target.files || []);
        setPhotos(files);
        setPreviews(files.map((f) => URL.createObjectURL(f)));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSaving(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("thought", thought);
        formData.append("place", place);
        formData.append("date", date);
        photos.forEach((f) => formData.append("photos", f));
        try {
            await api.createMemory(formData);
            navigate("/memories");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <Link to="/memories" className="inline-flex items-center gap-1.5 text-[#8a8578] text-sm mb-6"><ArrowLeft size={16} /> Back to memories</Link>
            <h1 className="font-serif text-4xl">Create a new memory</h1>
            <p className="text-[#8a8578] mt-1 mb-10">Capture the moment before it fades.</p>

            {error && <p className="text-red-700 bg-red-50 rounded-xl px-4 py-3 mb-6">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <label className="text-sm font-semibold text-[#555]">Title</label>
                    <input className="mt-1.5 w-full bg-white border border-[#e5dfd2] rounded-full px-5 py-3.5 outline-none focus:border-[#2f5d43]" placeholder="A name for this moment" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label className="text-sm font-semibold text-[#555]">What happened?</label>
                    <textarea rows={5} className="mt-1.5 w-full bg-white border border-[#e5dfd2] rounded-3xl px-5 py-4 outline-none focus:border-[#2f5d43]" placeholder="Write it down while it's still vivid..." value={thought} onChange={(e) => setThought(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-[#555]">Where were you?</label>
                        <input className="mt-1.5 w-full bg-white border border-[#e5dfd2] rounded-full px-5 py-3.5 outline-none focus:border-[#2f5d43]" placeholder="City, place" value={place} onChange={(e) => setPlace(e.target.value)} required />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-[#555]">When?</label>
                        <input type="date" className="mt-1.5 w-full bg-white border border-[#e5dfd2] rounded-full px-5 py-3.5 outline-none focus:border-[#2f5d43]" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-semibold text-[#555]">Photos</label>
                    <label className="mt-1.5 block border-2 border-dashed border-[#d8d2c4] rounded-3xl p-10 text-center cursor-pointer hover:border-[#2f5d43] transition">
                        <div className="w-12 h-12 rounded-full bg-[#e3efe6] flex items-center justify-center mx-auto mb-3">
                            <ImagePlus size={22} className="text-[#2f5d43]" />
                        </div>
                        <p className="font-semibold">Add photos</p>
                        <p className="text-[#8a8578] text-sm">Drag & drop or click to browse</p>
                        <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleFiles} />
                    </label>
                    <div className="flex gap-3 mt-4 flex-wrap">
                        {previews.map((src, i) => <img key={i} src={src} alt="preview" className="w-20 h-20 object-cover rounded-xl" />)}
                    </div>
                </div>
                <button disabled={saving} className="self-center px-10 py-3.5 rounded-full bg-[#2f5d43] text-white font-semibold disabled:opacity-60">
                    {saving ? "Saving..." : "Save Memory"}
                </button>
            </form>
        </div>
    );
}
