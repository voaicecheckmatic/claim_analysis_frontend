"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Counter component for animated numbers
function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    let animationFrame

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration])

  return (
    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative">
      {/* Background Video */}
      <video autoPlay muted loop playsInline className="fixed inset-0 w-full h-full object-cover z-0">
        <source src="/Landing_Page_background_video.mp4" type="video/mp4" />
        {/* Fallback background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
          }}
        />
      </video>

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-slate-900/85 backdrop-blur-sm z-10" />

      {/* Content - Scrollable */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-4 flex-shrink-0">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Claims Analysis</span>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Sign In
            </button>
          </div>
        </header>

        {/* Main Content - Responsive */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:py-0">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
            {/* Left Side - Hero Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 leading-tight">
                Smarter Claims.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Better Decisions.
                </span>
              </h1>
              <p className="text-slate-400 text-base sm:text-lg md:text-xl mb-6 lg:mb-8 leading-relaxed">
                AI-powered platform to analyze, verify, and streamline insurance claims. Stop fraud before it costs you
                millions.
              </p>
              {/* CTA Button */}
              <button
                onClick={() => navigate("/login")}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-base sm:text-lg"
              >
                <span className="relative z-10">Start Analyzing Claims</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
              <p className="text-slate-500 text-sm mt-4">Trusted by leading insurance companies worldwide</p>
            </div>

            {/* Right Side - Statistics */}
            <div className="space-y-4 lg:space-y-6 order-1 lg:order-2">
              {/* Main Stats Card */}
              <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 text-center">
                  Insurance Fraud Impact
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 ">
                      <span className="text-orange-300">₹</span>{" "}<AnimatedCounter end={308} duration={2500} />{" "}<span className="text-orange-300">Lakhs</span>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm">Annual fraud losses</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                      <AnimatedCounter end={10} duration={2000} />{" "}<span className="text-orange-300">%</span>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm">Claims are fraudulent</p>
                  </div>
                </div>
                <div className="text-center pt-4 border-t border-slate-700/50">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                    <AnimatedCounter end={2500000} duration={3000} />{" "}<span className="text-orange-300">+</span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm">Fraudulent claims detected</p>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-xl p-3 sm:p-4 text-center hover:bg-slate-800/60 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">AI Detection</h4>
                  <p className="text-xs text-slate-400">Real-time analysis</p>
                </div>
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-xl p-3 sm:p-4 text-center hover:bg-slate-800/60 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">Analytics</h4>
                  <p className="text-xs text-slate-400">Instant insights</p>
                </div>
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-xl p-3 sm:p-4 text-center hover:bg-slate-800/60 transition-all duration-300 sm:col-span-1 col-span-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-2 mx-auto">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">Secure</h4>
                  <p className="text-xs text-slate-400">GDPR compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-3 flex-shrink-0 mt-auto">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-slate-500 text-xs">
              © 2024 Claims Analysis Platform • Secure • Encrypted • GDPR Compliant
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
