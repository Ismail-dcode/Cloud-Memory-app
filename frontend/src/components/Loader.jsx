export default function Loader({ label = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
            <svg className="animate-spin h-10 w-10 text-[#2f5d43]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-90" d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <p className="text-[#8a8578] text-sm tracking-wide">{label}</p>
        </div>
    );
}
