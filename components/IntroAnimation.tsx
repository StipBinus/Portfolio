import { useState, useEffect } from 'react'

export default function IntroAnimation() {
  // separate states for independent animations
  const [hiVisible, setHiVisible] = useState(true)
  const [hiFadingOut, setHiFadingOut] = useState(false)
  const [welcomeVisible, setWelcomeVisible] = useState(false)
  const [welcomeFadingOut, setWelcomeFadingOut] = useState(false)
  const [showMainContent, setShowMainContent] = useState(false)

  useEffect(() => {
    const timers: number[] = []

    // After 1.5s start fading out "Hi"
    timers.push(
      window.setTimeout(() => {
        setHiFadingOut(true)
      }, 1500)
    )

    // After hi fade-out duration (1500 + 500 = 2000ms) hide Hi and show Welcome
    timers.push(
      window.setTimeout(() => {
        setHiVisible(false)
        setHiFadingOut(false)
        setWelcomeVisible(true)
      }, 2000)
    )

    // After 5s start fading out welcome
    timers.push(
      window.setTimeout(() => {
        setWelcomeFadingOut(true)
      }, 5000)
    )

    // After 5.5s show main content
    timers.push(
      window.setTimeout(() => {
        setWelcomeVisible(false)
        setWelcomeFadingOut(false)
        setShowMainContent(true)
      }, 5500)
    )

    return () => timers.forEach((t) => clearTimeout(t))
  }, [])

  if (!showMainContent) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center overflow-hidden"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
          .fade-in { animation: fadeIn 600ms ease-in-out forwards }
          .fade-out { animation: fadeOut 500ms ease-in-out forwards }
        `}</style>

        <div className="text-center">
          {hiVisible && (
            <h1
              className={`text-6xl font-light tracking-wider ${hiFadingOut ? 'fade-out' : 'fade-in'}`}
              style={{ fontWeight: 300, letterSpacing: '0.1em', color: '#000000' }}
            >
              Hi !
            </h1>
          )}

          {welcomeVisible && (
            <h1
              className={`text-5xl font-light tracking-wide mt-4 ${welcomeFadingOut ? 'fade-out' : 'fade-in'}`}
              style={{ fontWeight: 300, letterSpacing: '0.05em', color: '#000000' }}
            >
              Welcome To My Portfolio !
            </h1>
          )}
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="text-center p-6">
        <h2 className="text-3xl font-semibold">Welcome — main content</h2>
        <p className="mt-4 text-gray-600">This is where your portfolio content goes.</p>
      </div>
    </main>
  )
}
