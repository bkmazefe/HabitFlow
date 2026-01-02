import { useState } from 'react'
import { FiCheck, FiPlus, FiMinus } from 'react-icons/fi'

export default function Tracker({ habits, onToggleHabit, onLogValue, t }) {
  const UNIT_LABELS = {
    minutes: t?.habitForm?.unitsShort?.minutes || 'min',
    pages: t?.habitForm?.unitsShort?.pages || 'pages',
    count: t?.habitForm?.unitsShort?.count || 'count',
    hours: t?.habitForm?.unitsShort?.hours || 'hrs',
    times: t?.habitForm?.unitsShort?.times || 'times',
    none: '',
  }
  const [selectedDate, setSelectedDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(selectedDate)
  const firstDay = getFirstDayOfMonth(selectedDate)
  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    )
  }

  // Backend ile değişecek - POST /api/habits/:id/log endpoint'ine istek atılacak
  const handleIncrement = (habit, amount) => {
    const newValue = Math.max(0, (habit.todayValue || 0) + amount)
    onLogValue(habit.id, newValue)
  }

  return (
    <div className="w-full bg-white dark:bg-transparent transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#99BBE2] mb-2">{t?.tracker?.title || 'Daily Tracker'}</h1>
        <p className="text-gray-600 dark:text-slate-400 mb-8">{t?.tracker?.subtitle || 'Log your progress for today'}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-md dark:shadow-slate-900/30 p-6 transition-colors duration-300 dark:border dark:border-slate-700/50">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                className="px-3 py-1 bg-[#F2AFC1] text-white rounded hover:bg-[#D7C8F3] transition"
              >
                ←
              </button>
              <h2 className="text-lg font-bold text-[#99BBE2]">{monthName}</h2>
              <button
                onClick={handleNextMonth}
                className="px-3 py-1 bg-[#F2AFC1] text-white rounded hover:bg-[#D7C8F3] transition"
              >
                →
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center font-semibold text-[#99BBE2] text-xs py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center rounded text-xs font-semibold ${
                    day
                      ? isToday(day)
                        ? 'bg-[#99BBE2] text-white'
                        : 'bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-slate-300'
                      : ''
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Today's Habits with Input */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-md dark:shadow-slate-900/30 p-6 transition-colors duration-300 dark:border dark:border-slate-700/50">
            <h3 className="text-xl font-bold text-[#99BBE2] mb-4">📝 {t?.tracker?.logProgress || "Log Today's Progress"}</h3>
            
            {habits.length > 0 ? (
              <div className="space-y-4">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className={`p-4 rounded-xl border-2 transition ${
                      habit.completedToday
                        ? 'border-[#99BBE2] bg-[#99BBE2]/10'
                        : 'border-gray-200 dark:border-slate-600/50 bg-white dark:bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-slate-100">{habit.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400">
                          {habit.frequency === 'daily' ? (t?.habits?.daily || 'Daily') : (t?.habits?.weekly || 'Weekly')} {t?.habits?.target || 'target'}: {habit.targetValue} {UNIT_LABELS[habit.unit]}
                        </p>
                      </div>
                      {habit.completedToday && (
                        <span className="bg-[#99BBE2] text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <FiCheck size={12} /> {t?.tracker?.completed || 'Completed!'}
                        </span>
                      )}
                    </div>

                    {habit.unit === 'none' ? (
                      // Sadece tamamla butonu
                      // Backend ile değişecek - POST /api/habits/:id/toggle endpoint'ine istek atılacak
                      <button
                        onClick={() => onToggleHabit(habit.id, !habit.completedToday)}
                        className={`w-full py-2 rounded-lg font-semibold transition ${
                          habit.completedToday
                            ? 'bg-[#99BBE2] text-white'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 hover:bg-[#D7C8F3] hover:text-white'
                        }`}
                      >
                        {habit.completedToday ? `✓ ${t?.tracker?.completed || 'Completed'}` : (t?.tracker?.markComplete || 'Mark Complete')}
                      </button>
                    ) : (
                      // Değer girişi
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleIncrement(habit, -1)}
                          className="p-2 bg-[#F2AFC1] text-white rounded-lg hover:bg-[#D7C8F3] transition"
                        >
                          <FiMinus size={18} />
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            {/* Backend ile değişecek - onChange'de POST /api/habits/:id/log endpoint'ine istek atılacak */}
                            <input
                              type="number"
                              value={habit.todayValue || 0}
                              onChange={(e) => onLogValue(habit.id, e.target.value)}
                              className="w-20 text-center text-xl font-bold border-2 border-[#D7C8F3] dark:border-gray-600 rounded-lg py-1 focus:border-[#99BBE2] focus:outline-none bg-white dark:bg-gray-700 dark:text-white"
                              min="0"
                            />
                            <span className="text-gray-600 dark:text-gray-300">/ {habit.targetValue} {UNIT_LABELS[habit.unit]}</span>
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-[#D7C8F3] to-[#F2AFC1] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(habit.completion, 100)}%` }}
                            />
                          </div>
                          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">{habit.completion}% {t?.tracker?.completedLower || 'completed'}</p>
                        </div>

                        <button
                          onClick={() => handleIncrement(habit, 1)}
                          className="p-2 bg-[#99BBE2] text-white rounded-lg hover:bg-[#D7C8F3] transition"
                        >
                          <FiPlus size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t?.tracker?.noHabits || 'No habits to track yet!'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
