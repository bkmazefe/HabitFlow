import { FiEdit2, FiTrash2, FiTarget } from 'react-icons/fi'

const getUnitLabels = (t) => ({
  minutes: t?.habitForm?.minutes || 'min',
  pages: t?.habitForm?.pages || 'pages',
  count: t?.habitForm?.count || 'count',
  hours: t?.habitForm?.hours || 'hours',
  times: t?.habitForm?.times || 'times',
  none: '',
})

export default function HabitCard({ habit, onToggle, onEdit, onDelete, t }) {
  const UNIT_LABELS = getUnitLabels(t)
  return (
    <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-md dark:shadow-slate-900/30 p-6 hover:shadow-lg transition-all duration-300 dark:border dark:border-slate-700/50">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">{habit.name}</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">{habit.description}</p>
          {habit.unit && habit.unit !== 'none' && (
            <p className="text-xs text-[#99BBE2] mt-1 font-semibold flex items-center gap-1">
              <FiTarget size={12} /> {t?.habits?.target || 'Target'}: {habit.targetValue} {UNIT_LABELS[habit.unit]} / {habit.frequency === 'daily' ? (t?.habits?.daily || 'daily') : (t?.habits?.weekly || 'weekly')}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(habit)}
            className="p-2 text-[#D7C8F3] hover:bg-[#F2AFC1] hover:text-white rounded-lg transition"
          >
            <FiEdit2 size={16} />
          </button>
          {/* Backend ile değişecek - DELETE /api/habits/:id endpoint'ine istek atılacak */}
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Progress bar for today */}
      {habit.unit && habit.unit !== 'none' && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 mb-1">
            <span>{t?.habits?.today || 'Today'}: {habit.todayValue || 0} {UNIT_LABELS[habit.unit]}</span>
            <span>{habit.completion}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-700/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#D7C8F3] to-[#F2AFC1] h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(habit.completion, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#D7C8F3] dark:bg-[#D7C8F3]/80 rounded-lg p-3 text-center">
          <p className="text-xs text-white font-semibold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{t?.habits?.streak || 'STREAK'}</p>
          <p className="text-2xl font-bold text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{habit.streak}</p>
          <p className="text-xs text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{t?.habits?.days || 'days'}</p>
        </div>
        <div className="bg-[#FDCF7D] dark:bg-[#FDCF7D]/80 rounded-lg p-3 text-center">
          <p className="text-xs text-white font-semibold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{t?.habits?.today || 'TODAY'}</p>
          <p className="text-2xl font-bold text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{habit.completion}%</p>
        </div>
      </div>
    </div>
  )
}
