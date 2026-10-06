export default function Footer() {
    return (
        <footer className="border-t border-[#efe9dd] dark:border-[#2a251e] bg-white dark:bg-[#16130f] mt-16 py-8 text-center text-sm text-[#8a8578]">
            <p className="font-serif text-lg font-bold text-[#1c1c1c] dark:text-[#ece7dd]">Memory <em className="text-[#2f5d43] italic">Diary</em></p>
            <p className="mt-1">Save your memories. Live your moments.</p>
            <p className="mt-1">© {new Date().getFullYear()} Memory Diary · A private digital photo diary</p>
            <p className="mt-3 text-xs">
                Developed by <a href="https://ismailshaikh.in" target="_blank" rel="noreferrer" className="text-[#2f5d43] dark:text-[#9fd4ae] font-semibold">Ismail Shaikh</a> · Cloud Native Developer ·{" "}
                <a href="https://github.com/Ismail-dcode/Cloud-Memory-app" target="_blank" rel="noreferrer" className="text-[#2f5d43] dark:text-[#9fd4ae] font-semibold">GitHub Repo</a>
            </p>
        </footer>
    );
}
