export default function ConfirmModal({ title, message, confirmText = "Delete", onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-xl">
                <h2 className="font-serif text-2xl mb-2">{title}</h2>
                <p className="text-[#666] text-sm leading-relaxed mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onCancel} className="px-5 py-2.5 rounded-full border border-[#e5dfd2] bg-white text-sm font-semibold">Cancel</button>
                    <button onClick={onConfirm} className="px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-semibold">{confirmText}</button>
                </div>
            </div>
        </div>
    );
}
