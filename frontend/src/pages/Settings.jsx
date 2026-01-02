import { useState, useEffect } from "react";
import {
  FiUser,
  FiSettings,
  FiCamera,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiSun,
  FiMoon,
} from "react-icons/fi";

const URL = "https://habit-flow-backend-tan.vercel.app";

export default function Settings({
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  t,
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({
    theme: theme || "light",
    notifications: true,
    emailReminders: false,
    language: language || "en",
  });

  // Theme değiştiğinde settings'i güncelle
  useEffect(() => {
    setSettings((prev) => ({ ...prev, theme }));
  }, [theme]);

  // Language değiştiğinde settings'i güncelle
  useEffect(() => {
    setSettings((prev) => ({ ...prev, language }));
  }, [language]);

  const [profile, setProfile] = useState({
    name: "",
  });

  //profili serverdan al GET /api/user/profile
  useEffect(() => {
    fetch(URL + "/api/user/profile")
      .then((resp) => resp.json())
      .then((data) => {
        setProfile(data);
        console.log(data);
      });
  }, []);

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);

    // Theme değişikliğini App'e bildir
    if (setting === "theme" && onThemeChange) {
      onThemeChange(value);
    }

    // Language değişikliğini App'e bildir
    if (setting === "language" && onLanguageChange) {
      onLanguageChange(value);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  // Profil guncellemelerini kaydet PUT /api/user/profile
  const handleSaveProfile = () => {
    setIsEditingProfile(false);
    fetch(URL + "/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    }).then((response) => response.json());
  };

  return (
    <div className="w-full bg-white dark:bg-transparent transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#99BBE2]">
            {activeTab === "profile"
              ? t?.settings?.profile || "Profile"
              : t?.settings?.settings || "Settings"}
          </h1>

          {/* Tab Buttons */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800/70 p-1 rounded-xl border dark:border-slate-700/50">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === "profile"
                  ? "bg-white dark:bg-slate-700 text-[#99BBE2] shadow-md"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
              }`}
            >
              <FiUser size={18} />
              {t?.settings?.profile || "Profile"}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === "settings"
                  ? "bg-white dark:bg-slate-700 text-[#99BBE2] shadow-md"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
              }`}
            >
              <FiSettings size={18} />
              {t?.settings?.settings || "Settings"}
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-[#99BBE2]/20 via-[#D7C8F3]/20 to-[#F2AFC1]/20 dark:from-[#99BBE2]/10 dark:via-[#D7C8F3]/10 dark:to-[#F2AFC1]/10 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#99BBE2] to-[#D7C8F3] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    )}
                  </div>
                  {/* Backend ile değişecek - POST /api/user/avatar endpoint'ine dosya yüklenecek */}
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#F2AFC1] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#D7C8F3] transition-colors">
                    <FiCamera size={18} />
                  </button>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {profile.name}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {profile.email}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-3">
                    {profile.bio}
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <FiCalendar size={14} />
                    <span>Joined {profile.joinDate}</span>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isEditingProfile
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      : "bg-gradient-to-r from-[#99BBE2] to-[#D7C8F3] text-white hover:shadow-lg"
                  }`}
                >
                  <FiEdit2 size={18} />
                  {isEditingProfile
                    ? t?.settings?.cancel || "Cancel"
                    : t?.settings?.editProfile || "Edit Profile"}
                </button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-soft dark:shadow-slate-900/30 p-6 dark:border dark:border-slate-700/50">
              <h3 className="text-xl font-bold text-[#99BBE2] mb-6">
                {t?.settings?.personalInfo || "Personal Information"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-slate-400 mb-2">
                    <FiUser size={16} className="text-[#F2AFC1]" />
                    {t?.settings?.fullName || "Full Name"}
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        handleProfileChange("name", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 dark:text-slate-100 border-2 border-transparent rounded-xl focus:outline-none focus:border-[#99BBE2] focus:bg-white dark:focus:bg-slate-700 transition-all"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl text-gray-800 dark:text-slate-200">
                      {profile.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    <FiMail size={16} className="text-[#F2AFC1]" />
                    {t?.settings?.email || "Email Address"}
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 dark:text-white border-2 border-transparent rounded-xl focus:outline-none focus:border-[#99BBE2] focus:bg-white dark:focus:bg-gray-600 transition-all"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-800 dark:text-white">
                      {profile.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-slate-400 mb-2">
                    <FiPhone size={16} className="text-[#F2AFC1]" />
                    {t?.settings?.phone || "Phone Number"}
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 dark:text-slate-100 border-2 border-transparent rounded-xl focus:outline-none focus:border-[#99BBE2] focus:bg-white dark:focus:bg-slate-700 transition-all"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl text-gray-800 dark:text-slate-200">
                      {profile.phone}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-slate-400 mb-2">
                    <FiMapPin size={16} className="text-[#F2AFC1]" />
                    {t?.settings?.location || "Location"}
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profile.location}
                      onChange={(e) =>
                        handleProfileChange("location", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 dark:text-slate-100 border-2 border-transparent rounded-xl focus:outline-none focus:border-[#99BBE2] focus:bg-white dark:focus:bg-slate-700 transition-all"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl text-gray-800 dark:text-slate-200">
                      {profile.location}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-slate-400 mb-2">
                    <FiEdit2 size={16} className="text-[#F2AFC1]" />
                    {t?.settings?.bio || "Bio"}
                  </label>
                  {isEditingProfile ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) =>
                        handleProfileChange("bio", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 dark:text-slate-100 border-2 border-transparent rounded-xl focus:outline-none focus:border-[#99BBE2] focus:bg-white dark:focus:bg-slate-700 transition-all resize-none"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl text-gray-800 dark:text-slate-200">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Save Button */}
              {isEditingProfile && (
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveProfile}
                    className="px-8 py-3 bg-gradient-to-r from-[#F2AFC1] to-[#D7C8F3] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#F2AFC1]/30 transition-all"
                  >
                    {t?.settings?.saveChanges || "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-soft dark:shadow-slate-900/30 p-6 dark:border dark:border-slate-700/50">
              <h3 className="text-xl font-bold text-[#99BBE2] mb-4">
                {t?.settings?.notifications || "Notifications"}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#F2AFC1]/20 to-[#F2AFC1]/10 dark:from-[#F2AFC1]/15 dark:to-transparent rounded-xl">
                  <label className="font-semibold text-gray-800 dark:text-slate-200">
                    {t?.settings?.pushNotifications || "Push Notifications"}
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) =>
                        handleChange("notifications", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#99BBE2]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#D7C8F3]/20 to-[#D7C8F3]/10 dark:from-[#D7C8F3]/15 dark:to-transparent rounded-xl">
                  <label className="font-semibold text-gray-800 dark:text-slate-200">
                    {t?.settings?.emailReminders || "Email Reminders"}
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailReminders}
                      onChange={(e) =>
                        handleChange("emailReminders", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D7C8F3]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-soft dark:shadow-slate-900/30 p-6 dark:border dark:border-slate-700/50">
              <h3 className="text-xl font-bold text-[#99BBE2] mb-4">
                {t?.settings?.preferences || "Preferences"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-slate-300 mb-3">
                    {t?.settings?.theme || "Theme"}
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleChange("theme", "light")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                        settings.theme === "light"
                          ? "bg-gradient-to-r from-[#FDCF7D] to-[#FC8F7A] text-white shadow-lg shadow-[#FDCF7D]/30"
                          : "bg-gray-100 dark:bg-slate-700/70 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <FiSun size={20} />
                      {t?.settings?.light || "Light"}
                    </button>
                    <button
                      onClick={() => handleChange("theme", "dark")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                        settings.theme === "dark"
                          ? "bg-gradient-to-r from-[#99BBE2] to-[#D7C8F3] text-white shadow-lg shadow-[#99BBE2]/30"
                          : "bg-gray-100 dark:bg-slate-700/70 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <FiMoon size={20} />
                      {t?.settings?.dark || "Dark"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-slate-300 mb-2">
                    {t?.settings?.language || "Language"}
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700/50 dark:text-slate-100 border-2 border-transparent rounded-xl focus:border-[#99BBE2] focus:outline-none transition-all"
                  >
                    <option value="en">English</option>
                    <option value="tr">Türkçe</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-soft dark:shadow-slate-900/30 p-6 dark:border dark:border-slate-700/50">
              <h3 className="text-xl font-bold text-[#99BBE2] mb-4">
                {t?.settings?.account || "Account"}
              </h3>

              <div className="space-y-3">
                {/* Backend ile değişecek - POST /api/auth/change-password endpoint'ine istek atılacak */}
                <button className="w-full px-6 py-3 bg-gradient-to-r from-[#99BBE2]/30 to-[#D7C8F3]/30 dark:from-[#99BBE2]/40 dark:to-[#D7C8F3]/40 text-gray-800 dark:text-white rounded-xl hover:from-[#99BBE2]/40 hover:to-[#D7C8F3]/40 dark:hover:from-[#99BBE2]/50 dark:hover:to-[#D7C8F3]/50 transition font-semibold text-left">
                  {t?.settings?.changePassword || "Change Password"}
                </button>
                {/* Backend ile değişecek - DELETE /api/user/account endpoint'ine istek atılacak */}
                <button className="w-full px-6 py-3 bg-red-100 dark:bg-red-500/30 text-red-600 dark:text-red-300 rounded-xl hover:bg-red-200 dark:hover:bg-red-500/40 transition font-semibold text-left">
                  {t?.settings?.deleteAccount || "Delete Account"}
                </button>
              </div>
            </div>

            {/* About */}
            <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-xl shadow-soft dark:shadow-slate-900/30 p-6 dark:border dark:border-slate-700/50">
              <h3 className="text-xl font-bold text-[#99BBE2] mb-4">
                {t?.settings?.about || "About"}
              </h3>
              <div className="space-y-2 text-gray-700 dark:text-slate-400">
                <p>
                  <strong className="dark:text-slate-200">
                    {t?.settings?.appVersion || "App Version"}:
                  </strong>{" "}
                  1.0.0
                </p>
                <p>
                  <strong className="dark:text-slate-200">
                    {t?.settings?.buildDate || "Build Date"}:
                  </strong>{" "}
                  December 2025
                </p>
                <p>
                  <strong className="dark:text-slate-200">
                    {t?.settings?.supportEmail || "Support Email"}:
                  </strong>{" "}
                  support@habitflow.com
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
