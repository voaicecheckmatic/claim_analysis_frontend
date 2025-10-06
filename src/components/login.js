import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form data
    const email = e.target.email.value
    const password = e.target.password.value

    // Hardcoded credentials for testing
    const testEmail = "user@gmail.com"
    const testPassword = "password"

    // Check credentials
    if (email === testEmail && password === testPassword) {
      setTimeout(() => {
        setIsLoading(false)
        navigate("/dashboard") // Redirect to dashboard on success
      }, 2000)
    } else {
      setTimeout(() => {
        setIsLoading(false)
        alert("Invalid email or password. Please use user@gmail.com and password for testing.")
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/90 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-3xl hover:bg-slate-800/85">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Claims Analysis</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Welcome back! Please sign in to access your dashboard and analyze claims data.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-slate-300 font-medium block">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="w-full h-12 px-4 rounded bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition-all duration-200 hover:bg-slate-700/70"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-slate-300 font-medium block">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••••••"
                className="w-full h-12 px-4 rounded bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20 transition-all duration-200 hover:bg-slate-700/70"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/20 transition-colors"
                />
                <span className="group-hover:text-white transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{" "}
              <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Contact your administrator
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-xs">Secure • Encrypted • GDPR Compliant</p>
        </div>
      </div>
    </div>
  )
}