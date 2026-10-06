export default function ConfirmModal({ title, message, confirmText = "Delete", loading = false, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-[#1e1a15] rounded-2xl p-7 max-w-sm w-full shadow-xl">
                <h2 className="font-serif text-2xl mb-2">{title}</h2>
                <p className="text-[#666] text-sm leading-relaxed mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} disabled={loading} className="px-5 py-2.5 rounded-full border border-[#e5dfd2] dark:border-[#3a342b] bg-white dark:bg-[#1e1a15] dark:text-[#ece7dd] text-sm font-semibold disabled:opacity-50">Cancel</button>
                    <button onClick={onConfirm} disabled={loading} className="px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-semibold disabled:opacity-60 inline-flex items-center gap-2">
                        {loading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-90" d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>}
                        {loading ? "Deleting..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

