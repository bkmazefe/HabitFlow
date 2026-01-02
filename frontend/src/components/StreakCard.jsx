export default function StreakCard({ title, value, icon: Icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-[#99BBE2] dark:bg-[#99BBE2]/80',
    secondary: 'bg-[#D7C8F3] dark:bg-[#D7C8F3]/80',
    accent: 'bg-[#F2AFC1] dark:bg-[#F2AFC1]/80',
    light: 'bg-[#FDCF7D] dark:bg-[#FDCF7D]/80',
    coral: 'bg-[#FC8F7A] dark:bg-[#FC8F7A]/80',
  }

  return (
    <div className={`${colorClasses[color]} rounded-xl p-6 text-center shadow-md transition-colors duration-300`}>
      <div className="flex justify-center mb-2">
        {typeof Icon === 'string' ? (
          <span className="text-3xl">{Icon}</span>
        ) : (
          <Icon className="text-3xl text-white" size={32} />
        )}
      </div>
      <p className="text-sm text-white font-semibold mb-2" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>{title}</p>
      <p className="text-4xl font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }}>{value}</p>
    </div>
  )
}
