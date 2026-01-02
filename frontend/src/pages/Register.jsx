import { useState } from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";

export default function Register({ onNavigate, onRegister }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Backend ile değişecek - POST /api/auth/register endpoint'ine istek atılacak
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreeTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    // Backend ile değişecek - Gerçek API çağrısı yapılacak
    setTimeout(() => {
      setIsLoading(false);
      if (onRegister) {
        onRegister(formData);
      }
    }, 1500);
  };

  // Password strength checker
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Weak", color: "#FC8F7A" },
      { strength: 2, label: "Fair", color: "#FDCF7D" },
      { strength: 3, label: "Good", color: "#99BBE2" },
      { strength: 4, label: "Strong", color: "#D7C8F3" },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2AFC1]/20 via-white to-[#FDCF7D]/20 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-72 h-72 bg-[#99BBE2]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-[#F2AFC1]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#FDCF7D]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#F2AFC1] via-[#D7C8F3] to-[#99BBE2] bg-clip-text text-transparent">
            HabitFlow
          </h1>
          <p className="text-gray-500 mt-2">
            Create your account and start building better habits!
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F2AFC1]"
                  size={20}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-[#F2AFC1] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F2AFC1]"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-[#F2AFC1] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F2AFC1]"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-[#F2AFC1] focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F2AFC1] transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor:
                            level <= passwordStrength.strength
                              ? passwordStrength.color
                              : "#e5e7eb",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F2AFC1]"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all ${
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword
                      ? "border-[#FC8F7A]"
                      : formData.confirmPassword &&
                        formData.password === formData.confirmPassword
                      ? "border-[#D7C8F3]"
                      : "border-transparent focus:border-[#F2AFC1]"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F2AFC1] transition-colors"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <FiCheck
                      className="absolute right-12 top-1/2 -translate-y-1/2 text-[#D7C8F3]"
                      size={20}
                    />
                  )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#F2AFC1] focus:ring-[#F2AFC1]"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-[#99BBE2] hover:underline"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-[#99BBE2] hover:underline"
                >
                  Privacy Policy
                </button>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#F2AFC1] to-[#D7C8F3] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#F2AFC1]/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => onNavigate && onNavigate("login")}
              className="text-[#99BBE2] hover:text-[#D7C8F3] font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
