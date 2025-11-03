import React, { useState, useEffect } from 'react'

interface AboutMeProps {
  isVisible?: boolean
  /** optional background color when bussines mode is active (e.g. '#f7f7f7') */
  businessBg?: string
  /** callback to navigate to projects */
  onNavigateToProjects?: () => void
}

const AboutMe: React.FC<AboutMeProps> = ({ isVisible = false, businessBg, onNavigateToProjects }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [activeTop, setActiveTop] = useState<'developer' | 'bussines'>('developer')
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    // Debounce show/hide to avoid flicker when isVisible toggles quickly (e.g. during fast scrolling)
    let showTimer: ReturnType<typeof setTimeout> | null = null
    let hideTimer: ReturnType<typeof setTimeout> | null = null

    if (isVisible) {
      // Mark that component has been visible at least once (prevents mode-switch effect from running on mount)
      if (!hasBeenVisible) {
        setHasBeenVisible(true)
      }
      // Cancel any pending hide and schedule show
      if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
      }
      showTimer = setTimeout(() => {
        setShouldAnimate(true)
      }, 300)
    } else {
      // When leaving view, wait a small amount before hiding so brief viewport flickers don't reset the animation
      hideTimer = setTimeout(() => {
        setShouldAnimate(false)
      }, 220)
    }

    return () => {
      if (showTimer) clearTimeout(showTimer)
      if (hideTimer) clearTimeout(hideTimer)
    }
  }, [isVisible, hasBeenVisible])

  // Re-trigger animation when switching between developer/business modes
  // Only run this effect if the component has been visible at least once (avoids flash on mount)
  useEffect(() => {
    if (!hasBeenVisible) return
    
    // Fade out current content
    setShouldAnimate(false)
    // Fade in new content after a shorter delay so the transition feels snappier
    const timer = setTimeout(() => {
      setShouldAnimate(true)
    }, 350)
    return () => clearTimeout(timer)
  }, [activeTop, hasBeenVisible])
  
  // When in bussines mode and a businessBg is provided, use it; otherwise default to white
  const currentBg = activeTop === 'bussines' && businessBg ? businessBg : '#ffffff'
  return (
    <div id="about-me" style={{
      minHeight: '100vh',
      width: '100vw',
      background: currentBg,
      position: 'relative',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
  transition: 'background 700ms cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      
      {/* Top Header Navigation */}
      <style>{`
        .top-btn { background: transparent; border: none; padding: 0; margin: 0; cursor: pointer; position: relative; transition: opacity 0.3s ease; }
        .top-btn:hover { opacity: 0.6; }
        .top-btn:focus { outline: none; }
        .top-btn-label { font-size: clamp(12px, 1.3vw, 15px); font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase; transition: color 500ms ease; }
  .top-underline { position: absolute; left: 0; right: 0; bottom: -5px; height: 1.5px; background: #000; transform: scaleX(0); transform-origin: center; transition: transform 700ms cubic-bezier(0.2,0.8,0.2,1), background 500ms ease; }
        .top-btn[data-active="true"] .top-underline { transform: scaleX(1); }
      `}</style>
      
      <div style={{
        position: 'absolute',
        top: 'clamp(35px, 4.5vh, 50px)',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        zIndex: 10,
  opacity: shouldAnimate ? 1 : 0,
  transition: 'opacity 700ms ease-out 120ms',
      }}>
        <button
          className="top-btn"
          data-active={activeTop === 'developer'}
          onClick={() => setActiveTop('developer')}
          aria-pressed={activeTop === 'developer'}
        >
          <span className="top-btn-label">DEVELOPER</span>
          <span className="top-underline" aria-hidden="true" />
        </button>

        <div style={{ fontSize: 'clamp(12px, 1.3vw, 15px)', color: '#ccc', fontWeight: 200 }}>|</div>

        <button
          className="top-btn"
          data-active={activeTop === 'bussines'}
          onClick={() => setActiveTop('bussines')}
          aria-pressed={activeTop === 'bussines'}
        >
          <span className="top-btn-label">BUSSINES</span>
          <span className="top-underline" aria-hidden="true" />
        </button>
      </div>

      {/* Top Right Accent Image - visible in developer mode (kept mounted for animations) */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          right: 0,
          width: 'clamp(600px, 30vw, 500px)',
          height: 'clamp(200px, 18vh, 220px)',
          objectPosition: 'center 30%',
          filter: 'brightness(0.85) saturate(1)',
          opacity: (activeTop === 'developer' && shouldAnimate) ? 0.92 : 0,
          transform: (activeTop === 'developer' && shouldAnimate) ? 'translateX(0)' : 'translateX(40px)',
          transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: activeTop === 'developer' ? 'auto' : 'none',
        }}
      >
        <img 
          src="TopRight.jpg" 
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 0%',
            display: 'block',
          }}
        />
      </div>

      {/* Main Photo - Left anchored to bottom - visible in developer mode (kept mounted for animation) */}
      <div style={{
        position: 'absolute',
        left: 'clamp(60px, 8vw, 120px)',
        bottom: 0,
        width: 'clamp(280px, 26vw, 380px)',
        height: 'clamp(800px, 72vh, 880px)',
        overflow: 'hidden',
        opacity: (activeTop === 'developer' && shouldAnimate) ? 1 : 0,
        transform: (activeTop === 'developer' && shouldAnimate) ? 'translateY(0)' : 'translateY(30px)',
  transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        pointerEvents: activeTop === 'developer' ? 'auto' : 'none',
      }}>
        <img 
          src="Port.jpg" 
          alt="Steve Alden"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 35%',
            display: 'block',
          }}
        />
      </div>

      {/* Content Area - Developer mode (kept mounted so we can animate out) */}
      <div style={{
        position: 'absolute',
        left: 'clamp(420px, 42vw, 580px)',
        top: '50%',
        transform: 'translateY(-50%)',
        maxWidth: 'clamp(460px, 42vw, 620px)',
        paddingRight: 'clamp(50px, 6vw, 100px)',
        opacity: (activeTop === 'developer' && shouldAnimate) ? 1 : 0,
        transformOrigin: 'top left',
  transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: activeTop === 'developer' ? 'auto' : 'none',
      }}>
          <h3 style={{
            fontSize: 'clamp(14px, 1.5vw, 20px)',
            fontWeight: 300,
            color: '#666666',
            margin: '0 0 clamp(16px, 2vh, 24px) 0',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: shouldAnimate ? 1 : 0,
            transform: shouldAnimate ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), transform 700ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
            As a Developer
          </h3>
          <h1 style={{
            fontSize: 'clamp(28px, 3.2vw, 48px)',
            fontWeight: 200,
            color: '#000000',
            lineHeight: '1.3',
            margin: '0 0 clamp(28px, 3.5vh, 42px) 0',
            letterSpacing: '0.01em',
            opacity: shouldAnimate ? 1 : 0,
            transform: shouldAnimate ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1) 200ms, transform 700ms cubic-bezier(0.4, 0, 0.2, 1) 200ms',
          }}>
             I excel in building software that solves bussines problems.
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 1.8vw, 24px)',
            fontWeight: 300,
            color: '#555555',
            lineHeight: '1.7',
            margin: 0,
            letterSpacing: '0.01em',
            opacity: shouldAnimate ? 1 : 0,
            transform: shouldAnimate ? 'translateY(0)' : 'translateY(15px)',
            transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1) 350ms, transform 700ms cubic-bezier(0.4, 0, 0.2, 1) 350ms',
          }}>
            I pride in my strong design intuition and my ability to identify needs and craft solutions that deliver real value.
          </p>
          {/* CTA: Check out my work (Developer) */}
          <div style={{ marginTop: 'clamp(24px, 3vh, 36px)', marginLeft: '-12px' }}>
            <div
              onClick={() => {
                if (onNavigateToProjects) {
                  onNavigateToProjects()
                }
              }}
              style={{
                cursor: 'pointer',
                padding: '12px 20px',
                fontSize: 'clamp(14px, 1.5vw, 16px)',
                fontWeight: 500,
                background: 'transparent',
                color: '#000000ff',
                transition: 'transform 220ms ease, box-shadow 220ms ease, opacity 300ms',
                opacity: shouldAnimate ? 1 : 0,
                transform: shouldAnimate ? 'translateY(0)' : 'translateY(8px)',
              }}
            >
              Check out my work →
            </div>
          </div>
        </div>

      {/* Bussines Mode - Portfolio Grid Layout (kept mounted so we can animate in/out) */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '45%',
        transform: 'translate(-50%, -50%)',
        width: '85vw',
        maxWidth: '1100px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'clamp(60px, 8vw, 120px)',
        padding: 'clamp(40px, 5vw, 80px) 0',
        alignItems: 'center',
        opacity: (activeTop === 'bussines' && shouldAnimate) ? 1 : 0,
        transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: activeTop === 'bussines' ? 'auto' : 'none',
      }}>
          {/* Item 1 - SURF (Left side with image on top) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(18px, 2.2vh, 28px)',
            opacity: shouldAnimate ? 1 : 0,
            transform: shouldAnimate ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1) 250ms, transform 700ms cubic-bezier(0.4, 0, 0.2, 1) 250ms',
          }}>
            {/* SURF Image - Landscape */}
            <div style={{
              width: '100%',
              height: 'clamp(180px, 24vh, 260px)',
              overflow: 'hidden',
              background: '#ffffffff',
            }}>
              <img 
                src='CravyCAD.svg' 
                alt="Surf"
                style={{
                  width: '100%',
                  height: '100%',
                  // stretch to exactly fill the container (may distort aspect ratio)
                  objectFit: 'fill',
                  display: 'block',
                }}
              />
            </div>
            {/* SURF Text below image */}
            <div style={{
              display: 'flex',
              gap: 'clamp(20px, 3vw, 40px)',
              alignItems: 'flex-start',
            }}>
              <h2 style={{
                fontSize: 'clamp(20px, 2.2vw, 32px)',
                fontWeight: 200,
                color: '#000000',
                margin: 0,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
              }}>
                68
              </h2>
              <p style={{
                fontSize: 'clamp(13px, 1.35vw, 16px)',
                fontWeight: 300,
                color: '#666666',
                lineHeight: '1.6',
                margin: 0,
                letterSpacing: '0.01em',
                paddingTop: '2px',
              }}>
                Different stores that we supply <br/> every week
              </p>
            </div>
          </div>

          {/* Item 2 - DREAM (Right side with text on left, image on right) */}
          <div style={{
            display: 'flex',
            gap: 'clamp(24px, 3.5vw, 50px)',
            alignItems: 'flex-start',
            paddingTop: 'clamp(120px, 5vh, 70px)',
            opacity: shouldAnimate ? 1 : 0,
            transform: shouldAnimate ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1) 350ms, transform 700ms cubic-bezier(0.4, 0, 0.2, 1) 350ms',
          }}>
            {/* DREAM Text on the left */}
            <div style={{
              flex: '1',
              display: 'flex',
              flexDirection: 'column',
              gap: 'clamp(12px, 1.5vh, 18px)',
              paddingTop: 'clamp(8px, 1vh, 12px)',
            }}>
              <h2 style={{
                fontSize: 'clamp(20px, 2.2vw, 32px)',
                fontWeight: 200,
                color: '#000000',
                margin: 0,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
              }}>
                3
              </h2>
              <p style={{
                fontSize: 'clamp(13px, 1.35vw, 16px)',
                fontWeight: 300,
                color: '#666666',
                lineHeight: '1.6',
                margin: 0,
                letterSpacing: '0.01em',
              }}>
                Booth Locations Open Every Weekend
              </p>
            </div>
            {/* DREAM Image - Portrait on the right */}
            <div style={{
              width: 'clamp(180px, 18vw, 240px)',
              height: 'clamp(400px, 32vh, 480px)',
              overflow: 'hidden',
              background: '#f5f5f5',
              flexShrink: 0,
            }}>
              <img 
                src="LeftSideBusiness.jpg" 
                alt="Dream"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  display: 'block',
                }}
              />
            </div>
          </div>

          {/* Bottom Left Label */}
          <h2 style={{
            position: 'absolute',
            bottom: 'clamp(60px, 4.5vh, 60px)',
            fontSize: 'clamp(18px, 2vw, 26px)',
            fontWeight: 200,
            color: '#000000',
            margin: 0,
            letterSpacing: '0.04em',
            opacity: shouldAnimate ? 1 : 0,
            transition: 'opacity 700ms ease-out 300ms',
          }}>
            CRAVYCAD
          </h2>
        </div>


      {/* Bottom Right Year */}
      <h3 style={{
        position: 'absolute',
        bottom: 'clamp(40px, 4.5vh, 60px)',
        right: 'clamp(50px, 6vw, 100px)',
        fontSize: 'clamp(18px, 2vw, 26px)',
        fontWeight: 200,
        color: '#999999',
        margin: 0,
        letterSpacing: '0.04em',
    opacity: shouldAnimate ? 1 : 0,
  transition: 'opacity 700ms cubic-bezier(0.4, 0, 0.2, 1) 350ms',
      }}>
        2025
      </h3>
      
    </div>
  )
}

export default AboutMe