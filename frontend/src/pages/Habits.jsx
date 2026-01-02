import { useState } from 'react'
import { HabitCard, Modal, HabitForm } from '../components'
import { FiPlus, FiSearch } from 'react-icons/fi'

export default function Habits({ habits, onAddHabit, onUpdateHabit, onDeleteHabit, onToggleHabit, t }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredHabits = habits.filter((h) =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (formData) => {
    if (editingHabit) {
      onUpdateHabit({ ...editingHabit, ...formData })
      setEditingHabit(null)
    } else {
      onAddHabit(formData)
    }
    setIsModalOpen(false)
  }

  const handleEdit = (habit) => {
    setEditingHabit(habit)
    setIsModalOpen(true)
  }

  return (
    <div className="w-full bg-white dark:bg-transparent transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#99BBE2]">{t?.habits?.title || 'My Habits'}</h1>
            <p className="text-gray-600 dark:text-slate-400">{t?.habits?.youHave || 'You have'} {habits.length} {t?.habits?.habitsToTrack || 'habits to track'}</p>
          </div>
          <button
            onClick={() => {
              setEditingHabit(null)
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 bg-[#FDCF7D] text-white px-6 py-3 rounded-lg hover:bg-[#F2AFC1] transition font-semibold"
          >
            <FiPlus size={20} />
            <span>{t?.habits?.addHabit || 'Add Habit'}</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t?.habits?.searchHabits || 'Search habits...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-[#D7C8F3] dark:border-slate-600 rounded-lg focus:border-[#99BBE2] focus:outline-none bg-white dark:bg-slate-800/50 dark:text-slate-100 dark:placeholder-slate-500 transition-colors duration-300"
          />
        </div>

        {/* Habits Grid */}
        {filteredHabits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={onToggleHabit}
                onEdit={handleEdit}
                onDelete={onDeleteHabit}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-soft dark:border dark:border-slate-700/50 transition-colors duration-300">
            <p className="text-2xl mb-2">📭</p>
            <p className="text-gray-600 dark:text-slate-400">
              {searchTerm ? (t?.habits?.noHabitsFound || 'No habits found matching your search') : (t?.habits?.noHabitsYet || 'No habits yet. Create your first habit!')}
            </p>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          title={editingHabit ? (t?.habits?.editHabit || 'Edit Habit') : (t?.habits?.createHabit || 'Create New Habit')}
          onClose={() => {
            setIsModalOpen(false)
            setEditingHabit(null)
          }}
        >
          <HabitForm
            habit={editingHabit}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsModalOpen(false)
              setEditingHabit(null)
            }}
            t={t}
          />
        </Modal>
      </div>
    </div>
  )
}
