import { useState } from 'react'

export default function Navigation({ currentPage, setCurrentPage, t }) {
  const [isOpen, setIsOpen] = useState(false)

  const pages = [
    { id: 'dashboard', label: t?.nav?.dashboard || 'Dashboard' },
    { id: 'habits', label: t?.nav?.habits || 'Habits' },
    { id: 'tracker', label: t?.nav?.tracker || 'Tracker' },
    { id: 'reports', label: t?.nav?.reports || 'Reports' },
    { id: 'settings', label: t?.nav?.settings || 'Settings' },
  ]

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId)
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-800/95 backdrop-blur-md shadow-md dark:shadow-slate-900/50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#99BBE2]">HabitFlow</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => handleNavigate(page.id)}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  currentPage === page.id
                    ? 'bg-[#99BBE2] text-white shadow-lg shadow-[#99BBE2]/30'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-[#D7C8F3]/50 dark:hover:bg-slate-700/70'
                }`}
              >
                <span>{page.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#F2AFC1]/50 dark:hover:bg-slate-700 text-2xl dark:text-slate-200"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-[#D7C8F3] dark:border-slate-700/50">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => handleNavigate(page.id)}
                className={`block w-full text-left px-4 py-2 rounded transition ${
                  currentPage === page.id
                    ? 'bg-[#99BBE2] text-white'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-[#D7C8F3]/50 dark:hover:bg-slate-700/70'
                }`}
              >
                <span>{page.icon}</span> {page.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
