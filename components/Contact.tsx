import React, { useState, useEffect } from 'react'

interface ContactProps {
  isVisible?: boolean
}

interface SocialLink {
  name: string
  url: string
  icon: JSX.Element
  description: string
}

const Contact: React.FC<ContactProps> = ({ isVisible = false }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => setShouldAnimate(true), 220)
      return () => clearTimeout(t)
    }
    setShouldAnimate(false)
  }, [isVisible])

  const socialLinks: SocialLink[] = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/steve-alden-6b80b52b0',
      description: 'Professional network',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      ),
    },
    {
      name: 'GitHub',
      url: 'https://github.com/StipBinus',
      description: 'Code & projects',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      ),
    },
    {
      name: 'Email',
      url: 'mailto:stevealdennn@gmail.com',
      description: 'Direct contact',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      ),
    },
    
  ]

  return (
    <div
      id="contact"
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#ffffff',
        position: 'relative',
        padding: 'clamp(64px, 8vh, 100px) clamp(48px, 8vw, 160px) clamp(48px, 6vh, 80px)',
        boxSizing: 'border-box',
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: 'clamp(900px, 90vw, 1400px)', margin: '0 auto', width: '100%', opacity: shouldAnimate ? 1 : 0, transition: 'opacity 700ms ease' }}>
        {/* Header */}
        <div style={{ marginBottom: 'clamp(48px, 8vh, 80px)', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(12px, 1.2vw, 14px)', fontWeight: 300, color: '#666666', marginBottom: '8px' }}>/ contact</div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 200, margin: 0, lineHeight: 1.1, color: '#000000' }}>Let's Connect</h1>
          <p style={{
            fontSize: 'clamp(14px, 1.6vw, 20px)',
            fontWeight: 300,
            color: '#666666',
            lineHeight: 1.6,
            margin: 'clamp(20px, 3vh, 32px) auto 0',
            maxWidth: 'clamp(400px, 60vw, 600px)',
          }}>
            Open to internship opportunities, collaborations, and conversations about software engineering.
          </p>
        </div>

        {/* Social Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(240px, 45vw, 280px), 1fr))',
          gap: 'clamp(20px, 3vw, 32px)',
          marginBottom: 'clamp(48px, 8vh, 80px)',
        }}>
          {socialLinks.map((link, idx) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(12px, 1.8vh, 16px)',
                padding: 'clamp(24px, 3.5vw, 32px)',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 'clamp(8px, 1.2vw, 12px)',
                background: '#ffffff',
                textDecoration: 'none',
                color: '#000000',
                transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: shouldAnimate ? 1 : 0,
                transform: shouldAnimate ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${200 + idx * 80}ms`,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ color: '#000000', opacity: 0.9 }}>
                {link.icon}
              </div>
              <div>
                <h3 style={{
                  fontSize: 'clamp(16px, 1.8vw, 20px)',
                  fontWeight: 400,
                  margin: '0 0 clamp(4px, 0.6vh, 6px) 0',
                  color: '#000000',
                }}>
                  {link.name}
                </h3>
                <p style={{
                  fontSize: 'clamp(12px, 1.3vw, 14px)',
                  fontWeight: 300,
                  color: '#666666',
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                  {link.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Footer Note */}
        <div style={{
          textAlign: 'center',
          opacity: shouldAnimate ? 1 : 0,
          transition: 'opacity 700ms ease 600ms',
        }}>
          <p style={{
            fontSize: 'clamp(12px, 1.3vw, 14px)',
            fontWeight: 300,
            color: '#999999',
            margin: 0,
            letterSpacing: '0.02em',
          }}>
            Based in Indonesia • Available for remote internships
          </p>
        </div>
      </div>
    </div>
  )
}

export default Contact
