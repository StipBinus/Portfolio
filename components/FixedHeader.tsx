import React, { useState, useEffect } from 'react'

interface FixedHeaderProps {
  isOnAboutMe?: boolean
  isOnProjects?: boolean
  isOnContact?: boolean
  onNavClick?: (index: number) => void
}

const FixedHeader: React.FC<FixedHeaderProps> = ({ isOnAboutMe = false, isOnProjects = false, isOnContact = false, onNavClick }) => {
  const [isOnHero, setIsOnHero] = useState(true) // Start with true since we begin on hero
  const [activeNav, setActiveNav] = useState<number>(0)
  const [logoKey, setLogoKey] = useState(0) // Key to trigger re-animation

  const toggleNav = (index: number) => {
    if (activeNav !== index) {
      console.log(`🔄 Navigation changed: ${activeNav} → ${index}`)
      setActiveNav(index)
    } else {
      console.log(`⚠️ Already active: ${index}`)
    }
    if (onNavClick) {
      onNavClick(index)
    }
  }

  useEffect(() => {
    // Determine hero state and update logo
    const onHero = !isOnAboutMe && !isOnProjects && !isOnContact
    if (onHero !== isOnHero) {
      setIsOnHero(onHero)
      setLogoKey(prev => prev + 1)
    }

    // Prioritise Contact, then Projects, then AboutMe, then Hero when deciding the active nav
    if (isOnContact) {
      setActiveNav(3)
    } else if (isOnProjects) {
      setActiveNav(2)
    } else if (isOnAboutMe) {
      setActiveNav(1)
    } else {
      setActiveNav(0)
    }
  }, [isOnAboutMe, isOnProjects, isOnContact])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: 'clamp(20px, 5vh, 40px) clamp(20px, 8vw, 60px) clamp(12px, 2vh, 20px) clamp(20px, 8vw, 60px)',
      background: 'transparent',
      fontFamily: 'system-ui',
      pointerEvents: 'none',
    }}>
      {/* Logo */}
      <div 
        onClick={() => onNavClick && onNavClick(0)}
        style={{
          position: 'absolute',
          top: 'clamp(20px, 5vh, 40px)',
          left: 'clamp(20px, 8vw, 60px)',
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontWeight: 300,
          letterSpacing: '0.05em',
          color: '#000000',
          pointerEvents: 'auto',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          opacity: 0,
          animation: 'fadeInLogo 0.8s ease-out forwards',
          animationDelay: '0.5s',
        }}
      >
        <span style={{
          transition: 'opacity 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
          opacity: isOnHero ? 1 : 0.95,
        }}>s</span>
        <span
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            maxWidth: isOnHero ? '200px' : '0px',
            transition: 'max-width 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
            opacity: isOnHero ? 1 : 0,
          }}
        >
          <span style={{ 
            whiteSpace: 'nowrap',
            display: 'inline-block',
            transform: isOnHero ? 'translateX(0)' : 'translateX(-8px)',
            transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}>teve</span>
        </span>
        <span style={{
          transition: 'opacity 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
          opacity: isOnHero ? 1 : 0.95,
        }}>.</span>
      </div>

      {/* Navigation Menu */}
      <div style={{
        position: 'fixed',
        top: '68%',
        right: 'clamp(2%, 3vw, 2%)',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(12px, 2.5vh, 20px)',
        pointerEvents: 'auto',
        zIndex: 1000,
      }}>
        <div
          onClick={() => toggleNav(0)}
          style={{
            width: 'clamp(12px, 2vw, 16px)',
            height: 'clamp(12px, 2vw, 16px)',
            background: 'transparent',
            border: '1.5px solid #242424ff',
            boxSizing: 'border-box',
            cursor: 'pointer',
            transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), background 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), border-color 0.3s ease',
            opacity: 0,
            animation: 'scaleInRotate 0.6s ease-out forwards',
            animationDelay: '2.4s',
          }}
          className={`nav-square ${activeNav === 0 ? 'is-diamond' : ''}`}
        />
        <div
          onClick={() => toggleNav(1)}
          style={{
            width: 'clamp(12px, 2vw, 16px)',
            height: 'clamp(12px, 2vw, 16px)',
            background: 'transparent',
            border: '1.5px solid #242424ff',
            boxSizing: 'border-box',
            cursor: 'pointer',
            transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), background 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), border-color 0.3s ease',
            opacity: 0,
            animation: 'scaleInRotate 0.6s ease-out forwards',
            animationDelay: '2.6s',
          }}
          className={`nav-square ${activeNav === 1 ? 'is-diamond' : ''}`}
        />
        <div
          onClick={() => toggleNav(2)}
          style={{
            width: 'clamp(12px, 2vw, 16px)',
            height: 'clamp(12px, 2vw, 16px)',
            background: 'transparent',
            border: '1.5px solid #242424ff',
            boxSizing: 'border-box',
            cursor: 'pointer',
            transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), background 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), border-color 0.3s ease',
            opacity: 0,
            animation: 'scaleInRotate 0.6s ease-out forwards',
            animationDelay: '2.8s',
          }}
          className={`nav-square ${activeNav === 2 ? 'is-diamond' : ''}`}
        />
        <div
          onClick={() => toggleNav(3)}
          style={{
            width: 'clamp(12px, 2vw, 16px)',
            height: 'clamp(12px, 2vw, 16px)',
            background: 'transparent',
            border: '1.5px solid #242424ff',
            boxSizing: 'border-box',
            cursor: 'pointer',
            transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), background 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), border-color 0.3s ease',
            opacity: 0,
            animation: 'scaleInRotate 0.6s ease-out forwards',
            animationDelay: '3.0s',
          }}
          className={`nav-square ${activeNav === 3 ? 'is-diamond' : ''}`}
        />
      </div>

      <style>{`
        @keyframes wipeInLeft {
          0% { 
            clip-path: inset(0 0 0 100%);
            opacity: 1;
          }
          100% { 
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }
        
        @keyframes fadeInLogo {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleInRotate {
          0% { opacity: 0; scale: 0.8; }
          100% { opacity: 1; scale: 1; }
        }
        
        .nav-square:hover {
          border-color: #1a1a1a;
        }

        .nav-square.is-diamond {
          transform: rotate(45deg) !important;
          background: #242424ff !important;
        }
      `}</style>
    </div>
  )
}

export default FixedHeader