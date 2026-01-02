export default function ProgressChart({ data, title }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{item.label}</span>
              <span className="text-sm font-bold text-[#99BBE2]">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700/50 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-[#D7C8F3] to-[#F2AFC1] h-3 rounded-full transition-all duration-300"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
