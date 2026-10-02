export default function Footer() {
    return (
        <footer className="border-t border-[#efe9dd] bg-white mt-16 py-8 text-center text-sm text-[#8a8578]">
            <p className="font-serif text-lg font-bold text-[#1c1c1c]">Memory <em className="text-[#2f5d43] italic">Diary</em></p>
            <p className="mt-1">Save your memories. Live your moments.</p>
            <p className="mt-1">© {new Date().getFullYear()} Memory Diary · A private digital photo diary</p>
        </footer>
    );
}
