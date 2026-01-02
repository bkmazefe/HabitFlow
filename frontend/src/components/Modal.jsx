export default function Modal({ isOpen, title, children, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-40 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft dark:shadow-slate-900/50 max-w-md w-full p-6 transition-colors duration-300 dark:border dark:border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#99BBE2]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 text-2xl">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
