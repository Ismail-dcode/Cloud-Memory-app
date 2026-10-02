import { Link } from "react-router-dom";
import { useAuth } from "../services/auth.jsx";
import { Camera, PenLine, MapPin, CalendarDays } from "lucide-react";

const features = [
    { icon: Camera, title: "Photos", text: "The picture that brings it all back." },
    { icon: PenLine, title: "Thoughts", text: "What you felt, in your own words." },
    { icon: MapPin, title: "Places", text: "Where it happened, never forgotten." },
    { icon: CalendarDays, title: "Dates", text: "Every moment, kept in its time." },
];

export default function Home() {
    const { user } = useAuth();

    return (
        <div>
            <section className="text-center px-6 pt-24 pb-20">
                <p className="text-xs tracking-[0.3em] text-[#2f5d43] font-semibold mb-6">YOUR MOMENTS. YOUR THOUGHTS. YOUR MEMORIES.</p>
                <h1 className="font-serif text-5xl md:text-6xl leading-tight">
                    Keep the moments <em className="text-[#2f5d43] italic">that<br />matter.</em>
                </h1>
                <p className="max-w-xl mx-auto text-[#7a7466] mt-6 leading-relaxed">
                    Your personal digital memory diary for photos, thoughts, places and dates.
                </p>
                <div className="flex gap-3 justify-center mt-8">
                    <Link to={user ? "/memories/new" : "/register"} className="px-7 py-3.5 rounded-full bg-[#2f5d43] text-white font-semibold">Create a Memory</Link>
                    <Link to={user ? "/memories" : "/login"} className="px-7 py-3.5 rounded-full bg-white border border-[#e5dfd2] font-semibold">Explore Memories</Link>
                </div>
            </section>

            <section className="px-6 pb-16">
                <div className="flex gap-8 justify-center items-center flex-wrap">
                    {[
                        { title: "Weekend in the Vineyards", place: "Nashik", date: "18 Aug 2026", rotate: "-rotate-3", img: "/images/Weekend in the Vineyards.jpg" },
                        { title: "My First College Trip", place: "Pune", date: "20 September 2026", rotate: "", img: "/images/collage-trip.jpg" },
                        { title: "Birthday Night", place: "Mumbai", date: "12 Sept 2026", rotate: "rotate-3", img: "/images/birthday.jpg" },
                    ].map((m, i) => (
                        <div key={i} className={`bg-white rounded-3xl p-3 border border-[#efe9dd] shadow-lg w-64 ${m.rotate}`}>
                            <img src={m.img} alt={m.title} className="h-64 w-full object-cover rounded-2xl" />
                            <div className="p-3">
                                <h3 className="font-serif text-lg">{m.title}</h3>
                                <p className="text-[#8a8578] text-xs mt-1">{m.place} · {m.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white border-y border-[#efe9dd] py-20 px-6 text-center">
                <h2 className="font-serif text-3xl mb-14">More than just photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    {features.map(({ icon: Icon, title, text }) => (
                        <div key={title}>
                            <div className="w-14 h-14 rounded-full bg-[#e3efe6] flex items-center justify-center mx-auto mb-4">
                                <Icon size={24} className="text-[#2f5d43]" />
                            </div>
                            <h3 className="font-serif text-lg mb-1">{title}</h3>
                            <p className="text-[#8a8578] text-sm">{text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
