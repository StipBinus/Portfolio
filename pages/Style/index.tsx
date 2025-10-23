import type { NextPage } from 'next'

const StylePage: NextPage = () => {
  return (
    <main className="min-h-screen bg-gray-50" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <div className="pt-8 pl-8">
        <h1 className="text-6xl font-light tracking-wider text-left" style={{ fontWeight: 300, letterSpacing: '0.1em', color: '#000' }}>Intro Heading</h1>
        <p className="text-5xl font-light tracking-wide text-left" style={{ fontWeight: 300, letterSpacing: '0.05em', color: '#000' }}>Intro Subheading</p>
      </div>
    </main>
  )
}

export default StylePage
