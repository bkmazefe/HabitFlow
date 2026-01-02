import { useState } from 'react'
import { FiMail, FiGithub, FiTwitter, FiInstagram, FiHeart, FiSend, FiCheckCircle, FiChevronRight } from 'react-icons/fi'

export default function Footer({ t, onNavigate, currentPage }) {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  // Backend ile değişecek - POST /api/newsletter/subscribe endpoint'ine istek atılacak
  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim() && email.includes('@')) {
      // Backend ile değişecek - Gerçek API çağrısı yapılacak
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const quickLinks = [
    { key: 'dashboard', label: t?.nav?.dashboard || 'Dashboard' },
    { key: 'habits', label: t?.nav?.habits || 'Habits' },
    { key: 'tracker', label: t?.nav?.tracker || 'Tracker' },
    { key: 'reports', label: t?.nav?.reports || 'Reports' },
  ]

  const socialLinks = [
    { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: FiInstagram, href: 'https://instagram.com', label: 'Instagram' },
  ]

  return (
    <footer className="mt-16 bg-gradient-to-br from-[#99BBE2]/10 via-[#D7C8F3]/10 to-[#F2AFC1]/10 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-t border-[#D7C8F3]/30 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌱</span>
              <h3 className="font-bold text-xl text-[#543310] dark:text-white">HabitFlow</h3>
            </div>
            <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-5">
              {t?.footer?.aboutText || 'Build better habits and track your progress with our beautiful habit tracking app.'}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-[#99BBE2] hover:text-white shadow-sm dark:shadow-none transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[#543310] dark:text-white mb-4 text-sm uppercase tracking-wider">{t?.footer?.quickLinks || 'Quick Links'}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <span
                    onClick={() => onNavigate && onNavigate(link.key)}
                    className={`text-sm cursor-pointer transition-colors duration-200 flex items-center gap-1 group ${
                      currentPage === link.key 
                        ? 'text-[#99BBE2]' 
                        : 'text-gray-600 dark:text-slate-400 hover:text-[#543310] dark:hover:text-white'
                    }`}
                  >
                    <FiChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-[#543310] dark:text-white mb-4 text-sm uppercase tracking-wider">{t?.footer?.features || 'Features'}</h4>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#99BBE2]"></span>
                {t?.footer?.habitTrackingShort || 'Habit Tracking'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7C8F3]"></span>
                {t?.footer?.analyticsShort || 'Analytics & Reports'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F2AFC1]"></span>
                {t?.footer?.streakMonitoringShort || 'Streak Monitoring'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FDCF7D]"></span>
                {t?.footer?.mobileFriendlyShort || 'Mobile Friendly'}
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-[#543310] dark:text-white mb-4 text-sm uppercase tracking-wider">{t?.footer?.newsletter || 'Newsletter'}</h4>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
              {t?.footer?.newsletterText || 'Subscribe for tips and updates!'}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t?.footer?.emailPlaceholder || 'Your email'}
                className="w-full px-4 py-2.5 rounded-lg text-sm bg-white dark:bg-slate-800 border border-[#D7C8F3]/50 dark:border-slate-700 focus:outline-none focus:border-[#99BBE2] text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-gradient-to-r from-[#99BBE2] to-[#D7C8F3] text-white dark:text-slate-900 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
              >
                {subscribed ? (
                  <>
                    <FiCheckCircle size={16} />
                    {t?.footer?.subscribed || 'Subscribed!'}
                  </>
                ) : (
                  <>
                    <FiSend size={16} />
                    {t?.footer?.subscribe || 'Subscribe'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#D7C8F3]/30 dark:border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Contact */}
            <a
              href="mailto:support@habitflow.com"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-[#99BBE2] transition-colors"
            >
              <FiMail size={16} />
              support@habitflow.com
            </a>

            {/* Copyright */}
            <p className="text-sm text-gray-500 dark:text-slate-500 flex items-center gap-1.5">
              &copy; {currentYear} HabitFlow · {t?.footer?.madeWith || 'Made with'} 
              <FiHeart className="text-[#F2AFC1]" size={14} /> 
              {t?.footer?.forYou || 'for you'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
