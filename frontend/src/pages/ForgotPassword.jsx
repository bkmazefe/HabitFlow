import { useState } from "react";
import { FiMail, FiArrowLeft, FiSend, FiCheckCircle } from "react-icons/fi";

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Backend ile değişecek - POST /api/auth/forgot-password endpoint'ine istek atılacak
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Backend ile değişecek - Gerçek API çağrısı yapılacak, e-posta gönderilecek
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D7C8F3]/20 via-white to-[#99BBE2]/20 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-[#D7C8F3]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#99BBE2]/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#FDCF7D]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => onNavigate && onNavigate("login")}
          className="flex items-center gap-2 text-gray-500 hover:text-[#99BBE2] transition-colors mb-8"
        >
          <FiArrowLeft size={20} />
          <span>Back to Login</span>
        </button>

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#D7C8F3] via-[#99BBE2] to-[#F2AFC1] bg-clip-text text-transparent">
            HabitFlow
          </h1>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/50">
          {!isSubmitted ? (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D7C8F3]/30 to-[#99BBE2]/30 rounded-full flex items-center justify-center">
                  <FiMail size={36} className="text-[#99BBE2]" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                Forgot your password?
              </h2>
              <p className="text-gray-500 text-center mb-8">
                No worries! Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#99BBE2]"
                      size={20}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hello@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:outline-none focus:border-[#99BBE2] focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#D7C8F3] to-[#99BBE2] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#99BBE2]/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Link
                      <FiSend size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#D7C8F3]/30 to-[#99BBE2]/30 rounded-full flex items-center justify-center animate-pulse">
                  <FiCheckCircle size={40} className="text-[#D7C8F3]" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
                Check your email!
              </h2>
              <p className="text-gray-500 text-center mb-6">
                We've sent a password reset link to{" "}
                <span className="font-semibold text-[#99BBE2]">{email}</span>
              </p>

              <div className="bg-gradient-to-r from-[#D7C8F3]/10 to-[#99BBE2]/10 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 text-center">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-[#99BBE2] hover:underline font-medium"
                  >
                    try again
                  </button>
                </p>
              </div>

              <button
                onClick={() => onNavigate && onNavigate("login")}
                className="w-full py-3 bg-gradient-to-r from-[#D7C8F3] to-[#99BBE2] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#99BBE2]/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <FiArrowLeft size={18} />
                Back to Login
              </button>
            </>
          )}

          {/* Additional Links */}
          {!isSubmitted && (
            <p className="text-center mt-6 text-gray-600">
              Remember your password?{" "}
              <button
                onClick={() => onNavigate && onNavigate("login")}
                className="text-[#99BBE2] hover:text-[#D7C8F3] font-semibold transition-colors"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Need help?{" "}
          <button className="text-[#F2AFC1] hover:underline">
            Contact Support
          </button>
        </p>
      </div>
    </div>
  );
}
