import { useState } from "react";

export default function HabitForm({ habit, onSubmit, onCancel, t }) {
  const UNIT_OPTIONS = [
    { value: "minutes", label: t?.habitForm?.minutes || "Minutes" },
    { value: "pages", label: t?.habitForm?.pages || "Pages" },
    { value: "count", label: t?.habitForm?.count || "Count" },
    { value: "hours", label: t?.habitForm?.hours || "Hours" },
    { value: "times", label: t?.habitForm?.times || "Times" },
    { value: "none", label: t?.habitForm?.justComplete || "Just Complete" },
  ];

  const [formData, setFormData] = useState(
    habit || {
      name: "",
      description: "",
      frequency: "daily",
      unit: "none",
      targetValue: 1,
      color: "primary",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit({
        ...formData,
        targetValue: Number(formData.targetValue) || 1,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
          {t?.habitForm?.habitName || "Habit Name"} *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Morning Exercise"
          className="w-full px-4 py-2 border-2 border-[#D7C8F3] dark:border-slate-600 rounded-lg focus:border-[#99BBE2] focus:outline-none bg-white dark:bg-slate-700/50 dark:text-slate-100 dark:placeholder-slate-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
          {t?.habitForm?.description || "Description"}
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your habit..."
          rows="2"
          className="w-full px-4 py-2 border-2 border-[#D7C8F3] dark:border-slate-600 rounded-lg focus:border-[#99BBE2] focus:outline-none bg-white dark:bg-slate-700/50 dark:text-slate-100 dark:placeholder-slate-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
            {t?.habitForm?.frequency || "Frequency"}
          </label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-[#D7C8F3] dark:border-slate-600 rounded-lg focus:border-[#99BBE2] focus:outline-none bg-white dark:bg-slate-700/50 dark:text-slate-100"
          >
            <option value="daily">{t?.habits?.daily || "Daily"}</option>
            <option value="weekly">{t?.habits?.weekly || "Weekly"}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
            {t?.habitForm?.unit || "Unit"}
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-[#D7C8F3] dark:border-slate-600 rounded-lg focus:border-[#99BBE2] focus:outline-none bg-white dark:bg-slate-700/50 dark:text-slate-100"
          >
            {UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {formData.unit !== "none" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">
            {t?.habitForm?.target || "Target"} (
            {formData.frequency === "daily"
              ? t?.habitForm?.dailyTarget || "Daily Target"
              : t?.habitForm?.weeklyTarget || "Weekly Target"}
            )
          </label>
          <input
            type="number"
            name="targetValue"
            value={formData.targetValue}
            onChange={handleChange}
            min="1"
            placeholder="e.g., 30"
            className="w-full px-4 py-2 border-2 border-[#D7C8F3] dark:border-slate-600 rounded-lg focus:border-[#99BBE2] focus:outline-none bg-white dark:bg-slate-700/50 dark:text-slate-100"
          />
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {formData.unit === "minutes" &&
              `${formData.targetValue} ${t?.habitForm?.minutes || "minutes"} ${
                formData.frequency === "daily"
                  ? t?.common?.perDay || "per day"
                  : t?.common?.perWeek || "per week"
              }`}
            {formData.unit === "pages" &&
              `${formData.targetValue} ${t?.habitForm?.pages || "pages"} ${
                formData.frequency === "daily"
                  ? t?.common?.perDay || "per day"
                  : t?.common?.perWeek || "per week"
              }`}
            {formData.unit === "count" &&
              `${formData.targetValue} ${t?.habitForm?.count || "count"} ${
                formData.frequency === "daily"
                  ? t?.common?.perDay || "per day"
                  : t?.common?.perWeek || "per week"
              }`}
            {formData.unit === "hours" &&
              `${formData.targetValue} ${t?.habitForm?.hours || "hours"} ${
                formData.frequency === "daily"
                  ? t?.common?.perDay || "per day"
                  : t?.common?.perWeek || "per week"
              }`}
            {formData.unit === "times" &&
              `${formData.targetValue} ${t?.habitForm?.times || "times"} ${
                formData.frequency === "daily"
                  ? t?.common?.perDay || "per day"
                  : t?.common?.perWeek || "per week"
              }`}
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-[#99BBE2] text-white py-2 rounded-lg hover:bg-[#D7C8F3] transition font-semibold"
        >
          {habit
            ? t?.habitForm?.updateHabit || "Update Habit"
            : t?.habitForm?.createHabit || "Create Habit"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-slate-100 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition font-semibold"
        >
          {t?.habitForm?.cancel || "Cancel"}
        </button>
      </div>
    </form>
  );
}
