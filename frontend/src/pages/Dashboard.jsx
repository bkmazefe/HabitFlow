import { useState, useMemo, useEffect, useRef } from "react";
import { StreakCard, ProgressChart } from "../components";
import {
  FiTarget,
  FiCheckCircle,
  FiTrendingUp,
  FiBarChart2,
  FiPlay,
  FiPause,
  FiSquare,
} from "react-icons/fi";

// Günün tarihine göre sabit bir söz seç (quotes array'den)
const getDailyQuoteIndex = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return dayOfYear % 14; // 14 quote var
};

export default function Dashboard({ habits, onLogValue, t }) {
  const quoteIndex = useMemo(() => getDailyQuoteIndex(), []);
  const quotes = t?.dashboard?.quotes || [];
  const dailyQuote = quotes[quoteIndex] || {
    text: "Small steps lead to big changes.",
    author: "Kaizen Philosophy",
  };

  // Stopwatch state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [isFreeTimer, setIsFreeTimer] = useState(false); // Free timer mode
  const intervalRef = useRef(null);

  // Filter habits that use time units (minutes, hours)
  const timeBasedHabits = habits.filter(
    (h) => h.unit === "minutes" || h.unit === "hours"
  );

  // Set default selected habit
  useEffect(() => {
    if (timeBasedHabits.length > 0 && !selectedHabitId && !isFreeTimer) {
      setSelectedHabitId(timeBasedHabits[0].id);
    }
  }, [timeBasedHabits, selectedHabitId, isFreeTimer]);

  // Handle free timer toggle
  const handleFreeTimerToggle = (enabled) => {
    if (isRunning) return; // Don't allow toggle while running
    setIsFreeTimer(enabled);
    if (enabled) {
      setSelectedHabitId(null);
      setElapsedTime(0);
    } else if (timeBasedHabits.length > 0) {
      setSelectedHabitId(timeBasedHabits[0].id);
    }
  };

  // Sync elapsed time when habit selection changes
  const prevSelectedHabitIdRef = useRef(null);
  useEffect(() => {
    // Sync when habit selection changes OR on initial load (only if not free timer)
    if (
      !isFreeTimer &&
      selectedHabitId &&
      selectedHabitId !== prevSelectedHabitIdRef.current
    ) {
      prevSelectedHabitIdRef.current = selectedHabitId;
      const selectedHabit = habits.find((h) => h.id === selectedHabitId);
      if (selectedHabit && !isRunning) {
        const todayValue = selectedHabit.todayValue || 0;
        let seconds = 0;
        if (selectedHabit.unit === "minutes") {
          seconds = Math.round(todayValue * 60);
        } else if (selectedHabit.unit === "hours") {
          seconds = Math.round(todayValue * 3600);
        }
        setElapsedTime(seconds);
      }
    }
  }, [selectedHabitId, habits, isRunning, isFreeTimer]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Format time as MM:SS or HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle stop - log total elapsed time to selected habit
  const handleStop = () => {
    setIsRunning(false);
    // Only save if a habit is selected (not free timer mode)
    if (!isFreeTimer && selectedHabitId && elapsedTime > 0 && onLogValue) {
      const selectedHabit = habits.find((h) => h.id === selectedHabitId);
      if (selectedHabit) {
        // Convert elapsed seconds to the habit's unit (2 decimals for precision)
        let valueToLog = 0;
        if (selectedHabit.unit === "minutes") {
          valueToLog = Math.round((elapsedTime / 60) * 100) / 100; // 2 decimals: 8:15 = 8.25 min
        } else if (selectedHabit.unit === "hours") {
          valueToLog = Math.round((elapsedTime / 3600) * 1000) / 1000; // 3 decimals for hours
        }

        // Log the total elapsed time (already includes previous todayValue)
        onLogValue(selectedHabitId, valueToLog);
      }
    }
    // Reset elapsed time for free timer mode
    if (isFreeTimer) {
      setElapsedTime(0);
    }
  };

  // Save current progress
  const saveProgress = () => {
    // Only save if a habit is selected (not free timer mode)
    if (!isFreeTimer && selectedHabitId && elapsedTime > 0 && onLogValue) {
      const selectedHabit = habits.find((h) => h.id === selectedHabitId);
      if (selectedHabit) {
        if (selectedHabit) {
          let valueToLog = 0;
          if (selectedHabit.unit === "minutes") {
            valueToLog = Math.round((elapsedTime / 60) * 100) / 100; // 2 decimals
          } else if (selectedHabit.unit === "hours") {
            valueToLog = Math.round((elapsedTime / 3600) * 1000) / 1000; // 3 decimals
          }
          onLogValue(selectedHabitId, valueToLog);
        }
      }
    }
  };

  // Handle play/pause - save on pause
  const handlePlayPause = () => {
    if (isRunning) {
      // Pausing - save progress
      saveProgress();
    }
    setIsRunning(!isRunning);
  };

  // Handle reset
  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  // Calculate timer progress (0 to 1) based on selected habit's target
  const getTimerProgress = () => {
    // For free timer, use a 60-minute cycle (resets every hour)
    if (isFreeTimer) {
      const cycleSeconds = 60 * 60; // 1 hour cycle
      return (elapsedTime % cycleSeconds) / cycleSeconds;
    }

    if (!selectedHabitId) return 0;
    const selectedHabit = habits.find((h) => h.id === selectedHabitId);
    if (!selectedHabit) return 0;

    let targetSeconds = 0;
    if (selectedHabit.unit === "minutes") {
      targetSeconds = selectedHabit.targetValue * 60;
    } else if (selectedHabit.unit === "hours") {
      targetSeconds = selectedHabit.targetValue * 3600;
    }

    if (targetSeconds === 0) return 0;
    return Math.min(elapsedTime / targetSeconds, 1);
  };

  const totalHabits = habits.length;
  const longestStreak = Math.max(...habits.map((h) => h.streak), 0);
  const avgCompletion =
    habits.length > 0
      ? Math.round(
          habits.reduce((sum, h) => sum + h.completion, 0) / habits.length
        )
      : 0;

  const completedToday = habits.filter((h) => h.completedToday).length;

  const progressData = habits.slice(0, 5).map((h) => ({
    label: h.name,
    value: h.completion,
  }));

  return (
    <div className="w-full bg-white dark:bg-transparent transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Motivasyon Sözü */}
        <div className="mb-8 text-center">
          <p
            className="text-2xl md:text-3xl text-[#99BBE2] italic mb-2"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            "{dailyQuote.text}"
          </p>
          <p
            className="text-sm text-[#D7C8F3]"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            — {dailyQuote.author}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StreakCard
            title={t?.dashboard?.totalHabits || "Total Habits"}
            value={totalHabits}
            icon={FiTarget}
            color="primary"
          />
          <StreakCard
            title={t?.dashboard?.completedToday || "Completed Today"}
            value={completedToday}
            icon={FiCheckCircle}
            color="secondary"
          />
          <StreakCard
            title={t?.dashboard?.longestStreak || "Longest Streak"}
            value={longestStreak}
            icon={FiTrendingUp}
            color="coral"
          />
          <StreakCard
            title={t?.dashboard?.avgCompletion || "Avg Completion"}
            value={`${avgCompletion}%`}
            icon={FiBarChart2}
            color="light"
          />
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-md dark:shadow-slate-900/30 p-6 h-full transition-colors duration-300 dark:border dark:border-slate-700/50">
            <ProgressChart
              data={progressData}
              title={t?.dashboard?.habitCompletion || "Habit Completion Rate"}
            />
          </div>

          <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-md dark:shadow-slate-900/30 p-6 h-full transition-colors duration-300 dark:border dark:border-slate-700/50">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100 mb-4">
              {t?.dashboard?.thisWeek || "This Week"}
            </h3>
            <div className="space-y-3">
              {(
                t?.dashboard?.weekDays || [
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                  "Sun",
                ]
              ).map((day, i) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="font-semibold text-gray-600 dark:text-slate-400 w-12">
                    {day}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-slate-700/50 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#D7C8F3] to-[#F2AFC1] h-2 rounded-full"
                      style={{ width: `${Math.random() * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stopwatch Section */}
        {timeBasedHabits.length > 0 && (
          <div className="mt-8 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f0f23] rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 overflow-hidden relative">
            {/* Background glow effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D7C8F3]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              {/* Header with Free Timer Toggle & Habit Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-white/90 flex items-center gap-2">
                  <FiTarget className="text-[#D7C8F3]" />
                  {t?.dashboard?.focusTimer || "Focus Timer"}
                </h3>

                {/* Free Timer Toggle & Habit Selector */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {/* Free Timer Toggle */}
                  <button
                    onClick={() => handleFreeTimerToggle(!isFreeTimer)}
                    disabled={isRunning}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm ${
                      isRunning
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    } ${
                      isFreeTimer
                        ? "bg-[#D7C8F3]/30 border-2 border-[#D7C8F3]"
                        : "bg-white/5 border border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isFreeTimer
                          ? "border-[#D7C8F3] bg-[#D7C8F3]"
                          : "border-white/40"
                      }`}
                    >
                      {isFreeTimer && (
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-white/90">
                      {t?.dashboard?.free || "Free"}
                    </span>
                  </button>

                  {/* Habit Selector */}
                  <select
                    value={selectedHabitId || ""}
                    onChange={(e) => setSelectedHabitId(Number(e.target.value))}
                    disabled={isRunning || isFreeTimer}
                    className={`px-2 sm:px-4 py-1.5 sm:py-2 bg-white/10 border border-white/20 rounded-lg text-white/90 text-xs sm:text-sm focus:outline-none focus:border-[#D7C8F3] transition-colors backdrop-blur-sm max-w-[140px] sm:max-w-none truncate ${
                      isFreeTimer || isRunning
                        ? "opacity-40 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {timeBasedHabits.map((habit) => (
                      <option
                        key={habit.id}
                        value={habit.id}
                        className="bg-[#1a1a2e] text-white"
                      >
                        {habit.name} ({habit.unit})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Circular Timer */}
              <div className="flex flex-col items-center justify-center py-4 sm:py-6 md:py-8">
                <div className="relative">
                  {/* SVG Circle Progress */}
                  <svg className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                    />
                    {/* Progress circle with neon glow */}
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="url(#neonGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45} ${
                        2 * Math.PI * 45
                      }`}
                      strokeDashoffset={
                        2 * Math.PI * 45 * (1 - getTimerProgress())
                      }
                      className="transition-all duration-1000 ease-linear"
                      style={{
                        filter:
                          "drop-shadow(0 0 8px rgba(215, 200, 243, 0.8)) drop-shadow(0 0 20px rgba(215, 200, 243, 0.5)) drop-shadow(0 0 40px rgba(215, 200, 243, 0.3))",
                      }}
                    />
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient
                        id="neonGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#D7C8F3" />
                        <stop offset="50%" stopColor="#F2AFC1" />
                        <stop offset="100%" stopColor="#99BBE2" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Time Display in Center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-wider"
                      style={{ fontFamily: "'Quicksand', sans-serif" }}
                    >
                      {formatTime(elapsedTime)}
                    </span>
                    <span className="text-white/50 text-xs sm:text-sm mt-1 sm:mt-2 max-w-[120px] sm:max-w-none text-center truncate">
                      {isFreeTimer
                        ? t?.dashboard?.freeTimer || "Free Timer"
                        : habits.find((h) => h.id === selectedHabitId)?.name ||
                          t?.dashboard?.selectHabit ||
                          "Select a habit"}
                    </span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                  <button
                    onClick={handlePlayPause}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all transform hover:scale-110 active:scale-95 ${
                      isRunning
                        ? "bg-[#FDCF7D]/80 hover:bg-[#FDCF7D]"
                        : "bg-[#D7C8F3]/80 hover:bg-[#D7C8F3]"
                    }`}
                    style={{
                      boxShadow: isRunning
                        ? "0 0 20px rgba(253, 207, 125, 0.5), 0 0 40px rgba(253, 207, 125, 0.3)"
                        : "0 0 20px rgba(215, 200, 243, 0.5), 0 0 40px rgba(215, 200, 243, 0.3)",
                    }}
                  >
                    {isRunning ? (
                      <FiPause size={24} className="sm:w-7 sm:h-7" />
                    ) : (
                      <FiPlay size={24} className="ml-1 sm:w-7 sm:h-7" />
                    )}
                  </button>

                  <button
                    onClick={handleStop}
                    disabled={elapsedTime === 0}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/10 border border-white/20"
                  >
                    <FiSquare size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Today's Progress - only show when a habit is selected */}
                {!isFreeTimer && selectedHabitId && (
                  <div className="mt-4 sm:mt-6 text-center">
                    <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider mb-1">
                      {t?.dashboard?.todaysProgress || "Today's Progress"}
                    </p>
                    <p className="text-[#D7C8F3] text-base sm:text-lg font-medium">
                      {habits.find((h) => h.id === selectedHabitId)
                        ?.todayValue || 0}{" "}
                      <span className="text-white/50 text-xs sm:text-sm">
                        /{" "}
                        {
                          habits.find((h) => h.id === selectedHabitId)
                            ?.targetValue
                        }{" "}
                        {habits.find((h) => h.id === selectedHabitId)?.unit}
                      </span>
                    </p>
                  </div>
                )}

                {/* Free Timer Info */}
                {isFreeTimer && (
                  <div className="mt-4 sm:mt-6 text-center">
                    <p className="text-white/40 text-[10px] sm:text-xs uppercase tracking-wider">
                      {t?.dashboard?.noHabitTracking ||
                        "No habit tracking • Just focus"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
