import { useState, useEffect } from "react";
import useFetch from "./hooks/useFetch";
import { Navigation, Footer } from "./components";
import {
  Dashboard,
  Habits,
  Tracker,
  Reports,
  Settings,
  Login,
  Register,
  ForgotPassword,
} from "./pages";
import { translations } from "./utils/translations";

const URL = "https://habit-flow-backend-tan.vercel.app";

// Helper: bugünün tarihini YYYY-MM-DD formatında al
const getTodayKey = () => new Date().toISOString().split("T")[0];

// Helper: bu haftanın başlangıç tarihini al
const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff)).toISOString().split("T")[0];
};

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved || "en";
  });

  const [habits, setHabits] = useState([]);

  // Kullanici habit listesini serverdan al
  useEffect(() => {
    fetch(URL + "/api/items")
      .then((resp) => resp.json())
      .then((data) => {
        setHabits(data);
        //console.log(data);
      });
  }, []);

  // Theme'i localStorage'a kaydet ve document'e uygula
  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Language'i localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Habit'in completion oranını hesapla
  const getCompletion = (habit) => {
    const todayKey = getTodayKey();
    const weekStart = getWeekStart();

    if (habit.unit === "none") {
      // Sadece tamamla tipi - bugün yapıldı mı?
      return habit.logs[todayKey] ? 100 : 0;
    }

    if (habit.frequency === "daily") {
      const todayValue = habit.logs[todayKey] || 0;
      return Math.min(Math.round((todayValue / habit.targetValue) * 100), 100);
    } else {
      // Haftalık - bu haftaki toplam
      let weekTotal = 0;
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - today.getDay() + i + 1);
        const key = d.toISOString().split("T")[0];
        weekTotal += habit.logs[key] || 0;
      }
      return Math.min(Math.round((weekTotal / habit.targetValue) * 100), 100);
    }
  };

  // Bugün tamamlandı mı?
  const isCompletedToday = (habit) => {
    return getCompletion(habit) >= 100;
  };

  // Yeni habit ekleme istegi gonder ve geri donen yeni itemi ekle
  const handleAddHabit = (formData) => {
    fetch(URL + "/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, streak: 0, logs: {} }),
    })
      .then((response) => response.json())
      .then((data) => setHabits([...habits, data]));
  };

  // Listedeki bir habiti servera update istegi atip geri donuse gore guncelleme
  const handleUpdateHabit = (updatedHabit) => {
    fetch(URL + "/api/items/" + updatedHabit.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedHabit),
    })
      .then((response) => response.json())
      .then((data) =>
        setHabits(habits.map((h) => (h.id === data.id ? data : h)))
      );
  };

  // Habit silme servera istek atiyor, eger st == true ise idyi local olarak listeden cikariyoruz
  const handleDeleteHabit = (habitId) => {
    fetch(URL + "/api/items/" + habitId, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: habitId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.st == true) setHabits(habits.filter((h) => h.id !== habitId));
        alert(data.message);
      });
  };

  // Habit track verisini her habite ozel guncelle /api/items/:id/log
  const handleLogValue = (habitId, value) => {
    const todayKey = getTodayKey();

    habits.forEach((h) => {
      if (h.id === habitId) {
        const previousTodayValue = h.logs[todayKey] || 0;
        const wasCompletedToday =
          h.unit === "none"
            ? previousTodayValue > 0
            : previousTodayValue / h.targetValue >= 1;

        const newLogs = { ...h.logs, [todayKey]: Number(value) };
        const nowCompleted =
          h.unit === "none" ? value > 0 : Number(value) / h.targetValue >= 1;

        // Streak sadece bugün İLK KEZ tamamlandığında artar
        let newStreak = h.streak;
        if (nowCompleted && !wasCompletedToday) {
          newStreak = h.streak + 1;
        } else if (!nowCompleted && wasCompletedToday) {
          newStreak = Math.max(h.streak - 1, 0);
        }

        fetch(URL + "/api/items/" + habitId + "/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...h,
            logs: newLogs,
            streak: newStreak,
          }),
        })
          .then((response) => response.json())
          .then((data) =>
            setHabits(habits.map((h) => (h.id === data.id ? data : h)))
          );
      }
    });
  };

  // Habiti bugun icin tamamlandi olarak isaretle /api/habits/:id/toggle
  const handleToggleHabit = (habitId, completed) => {
    const todayKey = getTodayKey();
    habits.map((h) => {
      if (h.id === habitId) {
        const wasCompletedToday = (h.logs[todayKey] || 0) > 0;

        // Streak sadece bugün İLK KEZ tamamlandığında artar
        let newStreak = h.streak;
        if (completed && !wasCompletedToday) {
          newStreak = h.streak + 1;
        } else if (!completed && wasCompletedToday) {
          newStreak = Math.max(h.streak - 1, 0);
        }

        fetch(URL + "/api/items/" + habitId + "/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...h,
            logs: { ...h.logs, [todayKey]: completed ? 1 : 0 },
            streak: newStreak,
          }),
        })
          .then((response) => response.json())
          .then((data) =>
            setHabits(habits.map((h) => (h.id === data.id ? data : h)))
          );
      }
    });
  };

  // Habits'e completion ve completedToday ekle
  const habitsWithCompletion = habits.map((h) => ({
    ...h,
    completion: getCompletion(h),
    completedToday: isCompletedToday(h),
    todayValue: h.logs[getTodayKey()] || 0,
  }));

  // LOGIN POST /api/auth/login
  const handleLogin = async (credentials) => {
    try {
      console.log(credentials);
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token (localStorage or state)
      localStorage.setItem("token", data.token);

      console.log("Login successful:", data);
      setIsAuthenticated(true);
      setCurrentPage("dashboard");
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const handleRegister = async (userData) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Optional: store user or token if you later add auth
      // localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Registration successful:", data);

      setIsAuthenticated(true);
      setCurrentPage("dashboard");
    } catch (error) {
      console.error("Register error:", error.message);
      alert(error.message);
    }
  };

  // LOGOUT POST /api/auth/logout
  const handleLogout = () => {
    fetch(URL + "/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localStorage.getItem("token")),
    });

    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCurrentPage("login");
  };

  // Translation helper
  const t = translations[language];

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login onNavigate={setCurrentPage} onLogin={handleLogin} />;
      case "register":
        return (
          <Register onNavigate={setCurrentPage} onRegister={handleRegister} />
        );
      case "forgot-password":
        return <ForgotPassword onNavigate={setCurrentPage} />;
      case "dashboard":
        return (
          <Dashboard
            habits={habitsWithCompletion}
            onLogValue={handleLogValue}
            t={t}
          />
        );
      case "habits":
        return (
          <Habits
            habits={habitsWithCompletion}
            onAddHabit={handleAddHabit}
            onUpdateHabit={handleUpdateHabit}
            onDeleteHabit={handleDeleteHabit}
            onToggleHabit={handleToggleHabit}
            t={t}
          />
        );
      case "tracker":
        return (
          <Tracker
            habits={habitsWithCompletion}
            onToggleHabit={handleToggleHabit}
            onLogValue={handleLogValue}
            t={t}
          />
        );
      case "reports":
        return <Reports habits={habitsWithCompletion} t={t} />;
      case "settings":
        return (
          <Settings
            theme={theme}
            onThemeChange={setTheme}
            language={language}
            onLanguageChange={setLanguage}
            t={t}
          />
        );
      default:
        return <Dashboard habitsWithCompletion={habits} t={t} />;
    }
  };

  // Auth sayfalarında Navigation ve Footer gösterme
  const isAuthPage = ["login", "register", "forgot-password"].includes(
    currentPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {!isAuthPage && (
        <Navigation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          t={t}
        />
      )}
      <main className="flex-grow">{renderPage()}</main>
      {!isAuthPage && (
        <Footer t={t} onNavigate={setCurrentPage} currentPage={currentPage} />
      )}
    </div>
  );
}

export default App;
