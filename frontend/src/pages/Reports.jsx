import { useState, useEffect } from "react";
import { ProgressChart } from "../components";

const PORT = 3001;
const URL = "http://localhost:" + PORT;

export default function Reports({ habits, t }) {
  const monthlyData = habits.map((h) => ({
    label: h.name,
    value: h.completion,
  }));

  // Kategori istatistikleri GET /api/stats/categories
  const [categoryData, setCategoryData] = useState([
    { label: "lorem", value: 0 },
    { label: "ipsum", value: 0 },
    { label: "sit", value: 0 },
  ]);

  //profili serverdan al GET /api/stats/categories
  useEffect(() => {
    fetch(URL + "/api/stats/categories")
      .then((resp) => resp.json())
      .then((data) => {
        setCategoryData(data);
      });
  }, []);

  const downloadCSV = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/export/csv");

      if (!response.ok) {
        throw new Error("Failed to download CSV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "habits_export.csv";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV download failed:", error);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/export/pdf");

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "habits_export.pdf";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed:", error);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-transparent transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#99BBE2] mb-2">
          {t?.reports?.title || "Reports & Analytics"}
        </h1>
        <p className="text-gray-600 dark:text-slate-400 mb-8">
          {t?.reports?.subtitle ||
            "Track your progress and see what works for you"}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Habit Performance */}
          <ProgressChart
            data={monthlyData}
            title={t?.reports?.habitPerformance || "Habit Performance"}
          />

          {/* Category Analytics */}
          <ProgressChart
            data={categoryData}
            title={t?.reports?.categoryProgress || "Category Progress"}
          />
        </div>

        {/* Detailed Stats */}
        <div className="mt-8 bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-soft dark:shadow-slate-900/30 p-6 transition-colors duration-300 dark:border dark:border-slate-700/50">
          <h3 className="text-2xl font-bold text-[#99BBE2] mb-6">
            {t?.reports?.detailedStats || "Detailed Statistics"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#F2AFC1] dark:bg-[#F2AFC1]/15 rounded-lg text-center">
              <p className="text-gray-600 dark:text-slate-300 font-semibold mb-2">
                {t?.reports?.totalCheckins || "Total Check-ins"}
              </p>
              <p className="text-3xl font-bold text-[#99BBE2]">
                {habits.reduce((sum, h) => sum + (h.completedToday ? 1 : 0), 0)}
              </p>
            </div>

            <div className="p-4 bg-[#D7C8F3] dark:bg-[#D7C8F3]/15 rounded-lg text-center">
              <p className="text-gray-600 dark:text-slate-300 font-semibold mb-2">
                {t?.reports?.avgDailyRate || "Avg Daily Rate"}
              </p>
              <p className="text-3xl font-bold text-[#99BBE2]">
                {habits.length > 0
                  ? Math.round(
                      (habits.reduce(
                        (sum, h) => sum + (h.completedToday ? 1 : 0),
                        0
                      ) /
                        habits.length) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>

            <div className="p-4 bg-[#F2AFC1] dark:bg-[#F2AFC1]/15 rounded-lg text-center">
              <p className="text-gray-600 dark:text-slate-300 font-semibold mb-2">
                {t?.reports?.bestStreak || "Best Streak"}
              </p>
              <p className="text-3xl font-bold text-[#99BBE2]">
                {Math.max(...habits.map((h) => h.streak), 0)}{" "}
                {t?.common?.days || "days"}
              </p>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="mt-8 bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-soft dark:shadow-slate-900/30 p-6 transition-colors duration-300 dark:border dark:border-slate-700/50">
          <h3 className="text-xl font-bold text-[#99BBE2] mb-4">
            {t?.reports?.exportData || "Export Data"}
          </h3>
          <div className="flex gap-4 flex-wrap">
            {/* Backend ile değişecek - GET /api/export/csv endpoint'inden dosya indirilecek */}
            <button
              className="px-6 py-3 bg-[#99BBE2] text-white rounded-lg hover:bg-[#FC8F7A] transition font-semibold"
              onClick={downloadCSV}
            >
              {t?.reports?.exportCSV || "📊 Export as CSV"}
            </button>
            {/* Backend ile değişecek - GET /api/export/pdf endpoint'inden dosya indirilecek */}
            <button
              className="px-6 py-3 bg-[#D7C8F3] text-gray-800 rounded-lg hover:bg-[#99BBE2] hover:text-white transition font-semibold"
              onClick={downloadPDF}
            >
              {t?.reports?.exportPDF || "📄 Export as PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
