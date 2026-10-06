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
            <section className="relative min-h-[calc(100vh-73px)] flex flex-col justify-center px-8 md:px-16">
                <img src="/images/mountain.jpg" alt="Mountains at sunrise" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="relative z-10 max-w-xl">
                    <h1 className="font-serif text-3xl md:text-5xl text-white leading-tight">
                        Your moments.<br />Your memories.
                    </h1>
                    <p className="text-white/80 mt-4 leading-relaxed">
                        A personal diary to capture what matters.
                    </p>
                    <div className="flex gap-3 flex-wrap mt-6">
                        <Link to={user ? "/memories/new" : "/register"} className="inline-block px-7 py-3.5 rounded-full bg-[#2f5d43] text-white font-semibold">Create a Memory →</Link>
                        <Link to={user ? "/memories" : "/login"} className="inline-block px-7 py-3.5 rounded-full bg-white/80 text-[#1c1c1c] hover:bg-white font-semibold backdrop-blur">Explore Memories</Link>
                    </div>
                </div>
            </section>

            <section className="px-6 py-16">
                <h2 className="font-serif text-2xl mb-8 max-w-5xl mx-auto">Recent Memories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                        { title: "Picnics", place: "Pune", date: "20 Sep 2026", img: "/images/picknic.jpeg" },
                        { title: "Birthday's", place: "Mumbai", date: "12 Aug 2026", img: "/images/birthday.jpg" },
                        { title: "Weekend's", place: "Nashik", date: "05 Jul 2026", img: "/images/Weekend in the Vineyards.jpg" },
                    ].map((m, i) => (
                        <div key={i} className="relative rounded-3xl overflow-hidden shadow-lg">
                            <img src={m.img} alt={m.title} className="h-72 w-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-black/30 backdrop-blur-sm">
                                <h3 className="font-serif text-lg text-white">{m.title}</h3>
                                <p className="text-white/80 text-xs mt-1">{m.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white dark:bg-[#1e1a15] border-y border-[#efe9dd] dark:border-[#2a251e] py-20 px-6 text-center">
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
