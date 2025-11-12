import React, { useState, useEffect, useRef } from 'react'
import AboutMe from './AboutMe'
import FixedHeader from './FixedHeader'
import Projects from './Projects'
import Contact from './Contact'

const Hero: React.FC = () => {
  const [currentTitle, setCurrentTitle] = useState('A Developer')
  const [isAnimating, setIsAnimating] = useState(false)
  // section: 0 = Hero, 1 = AboutMe, 2 = Projects, 3 = Contact
  const [section, setSection] = useState<number>(0)
  const isTransitioning = useRef(false)

  const scrollToAboutMe = () => {
    setSection(1)
  }

  const handleNavClick = (index: number) => {
    // Allow nav clicks to immediately change section; block wheel input briefly
    setSection(Math.max(0, Math.min(3, index)))
    isTransitioning.current = true
    setTimeout(() => {
      isTransitioning.current = false
    }, 1400)
  }

  useEffect(() => {
    const titles = ['A Developer', 'A Business Owner']
    let currentIndex = 0

    const interval = setInterval(() => {
      setIsAnimating(true)
      
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % titles.length
        setCurrentTitle(titles[currentIndex])
        setIsAnimating(false)
      }, 1000) // Half of animation duration
    }, 6000) // Change every 12 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Replace separate boolean states with a single section index for predictable transitions.
    const transitionMs = 1400
    let wheelDebounce: ReturnType<typeof setTimeout> | null = null
    let touchStartY = 0
    let touchEndY = 0

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isTransitioning.current) return

      // Debounce to avoid multiple rapid triggers
      if (wheelDebounce) clearTimeout(wheelDebounce)
      wheelDebounce = setTimeout(() => {
        const delta = e.deltaY
        if (delta > 0) {
          // scroll down
          setSection(prev => {
            const next = Math.min(3, prev + 1)
            if (next !== prev) {
              isTransitioning.current = true
              setTimeout(() => { isTransitioning.current = false }, transitionMs)
            }
            return next
          })
        } else if (delta < 0) {
          // scroll up
          setSection(prev => {
            const next = Math.max(0, prev - 1)
            if (next !== prev) {
              isTransitioning.current = true
              setTimeout(() => { isTransitioning.current = false }, transitionMs)
            }
            return next
          })
        }
      }, 120)
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      touchEndY = e.touches[0].clientY
    }

    const handleTouchEnd = () => {
      if (isTransitioning.current) return
      
      const swipeDistance = touchStartY - touchEndY
      const minSwipeDistance = 50 // Minimum distance for a valid swipe

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          // Swiped up - scroll down
          setSection(prev => {
            const next = Math.min(3, prev + 1)
            if (next !== prev) {
              isTransitioning.current = true
              setTimeout(() => { isTransitioning.current = false }, transitionMs)
            }
            return next
          })
        } else {
          // Swiped down - scroll up
          setSection(prev => {
            const next = Math.max(0, prev - 1)
            if (next !== prev) {
              isTransitioning.current = true
              setTimeout(() => { isTransitioning.current = false }, transitionMs)
            }
            return next
          })
        }
      }

      touchStartY = 0
      touchEndY = 0
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      if (wheelDebounce) clearTimeout(wheelDebounce)
    }
  }, [])

  useEffect(() => {
    console.log('🎯 Setting up mouse interaction...')

    // Store current positions and target positions for smooth animation
    const shapeStates = new Map<HTMLElement, { currentX: number; currentY: number; targetX: number; targetY: number }>()

    const handleMouseMove = (e: MouseEvent) => {
      const shapes = document.querySelectorAll('.shape-interactive:not(.nav-square)')

      shapes.forEach((shape, index) => {
        const htmlShape = shape as HTMLElement
        const rect = shape.getBoundingClientRect()
        const computedStyle = window.getComputedStyle(htmlShape)

        const shapeCenterX = rect.left + rect.width / 2
        const shapeCenterY = rect.top + rect.height / 2
        const opacity = parseFloat(computedStyle.opacity)

        // Only animate shapes that are visible (opacity > 0)
        if (opacity > 0) {
          const deltaX = e.clientX - shapeCenterX
          const deltaY = e.clientY - shapeCenterY
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

          // Activation radius - how close mouse needs to be
          const activationRadius = 200

          if (distance < activationRadius) {
            // Calculate movement away from mouse
            const force = Math.min((activationRadius - distance) / activationRadius, 1)
            const maxMove = 15 // Maximum movement in pixels
            const moveX = -(deltaX / distance) * force * maxMove
            const moveY = -(deltaY / distance) * force * maxMove

            // Initialize state if not exists
            if (!shapeStates.has(htmlShape)) {
              shapeStates.set(htmlShape, { currentX: 0, currentY: 0, targetX: moveX, targetY: moveY })
            }

            const state = shapeStates.get(htmlShape)!
            state.targetX = moveX
            state.targetY = moveY

            htmlShape.classList.add('mouse-active')
          } else {
            // Reset target to origin
            if (shapeStates.has(htmlShape)) {
              const state = shapeStates.get(htmlShape)!
              state.targetX = 0
              state.targetY = 0
            }

            // Remove active class when back at origin
            if (!shapeStates.has(htmlShape) || (Math.abs(shapeStates.get(htmlShape)!.currentX) < 0.1 && Math.abs(shapeStates.get(htmlShape)!.currentY) < 0.1)) {
              htmlShape.classList.remove('mouse-active')
              htmlShape.style.removeProperty('transform')
              htmlShape.style.removeProperty('opacity')
            }
          }
        }
      })
    }

    // Animation loop for smooth transitions
    const animate = () => {
      shapeStates.forEach((state, htmlShape) => {
        // Lerp (linear interpolation) towards target with fixed speed
        const lerpSpeed = 0.05 // Adjust this value: lower = slower, higher = faster (0-1 range)
        
        state.currentX += (state.targetX - state.currentX) * lerpSpeed
        state.currentY += (state.targetY - state.currentY) * lerpSpeed

        // Apply transform
        htmlShape.style.setProperty('transform', `translate(${state.currentX}px, ${state.currentY}px)`, 'important')
        htmlShape.style.setProperty('opacity', '1', 'important')
      })

      requestAnimationFrame(animate)
    }

    console.log('✅ Adding mouse event listener')
    window.addEventListener('mousemove', handleMouseMove)
    const animationId = requestAnimationFrame(animate)

    return () => {
      console.log('🗑️ Removing mouse event listener')
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])
  
  return (
    <>
      <FixedHeader isOnAboutMe={section === 1} isOnProjects={section === 2} isOnContact={section === 3} onNavClick={handleNavClick} />
      <div 
        className="hero-section" 
        style={{
          position: 'fixed',
          top: section === 0 ? '0' : '-100vh',
          left: 0,
          width: '100vw',
          maxWidth: '100vw',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          overflow: 'hidden',
          background: 'linear-gradient(60deg, #ffffff 0%, #ffffffff 80%, #ffe8cbff 100%)',
          boxSizing: 'border-box',
          transition: 'top 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
          zIndex: 10,
          boxShadow: 'inset 0 30px 60px rgba(0,0,0,0.15), inset 0 -12px 32px rgba(0,0,0,0.15)',
        }}
      >
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          width: 100%;
          height: 100vh;
        }
        
        /* Hide scrollbars */
        ::-webkit-scrollbar {
          display: none;
        }
        
        /* Firefox */
        html {
          scrollbar-width: none;
        }
        
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          0% { opacity: 0; transform: translateX(30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes scaleInRotate {
          0% { opacity: 0; scale: 0.8; }
          100% { opacity: 1; scale: 1; }
        }
        @keyframes scaleInRotateActive {
          0% { opacity: 0; scale: 0.8; }
          100% { opacity: 1; scale: 1; }
        }
        @keyframes scaleInDot {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; }
        }
        @keyframes drawIn {
          0% { opacity: 0; transform: scaleX(0); }
          100% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes slideOutRight {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(20px); opacity: 0; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes portraitReveal {
          0% { 
            opacity: 0; 
            transform: translateX(50px) scale(0.94);
            filter: grayscale(65%) blur(6px);
          }
          100% { 
            opacity: 1; 
            transform: translateX(0) scale(1);
            filter: grayscale(65%) blur(0);
          }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in-left { animation: fadeInLeft 0.8s ease-out forwards; }
        .animate-fade-in-right { animation: fadeInRight 0.8s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .animate-scale-in-rotated { 
          animation: scaleInRotate 0.6s ease-out forwards;
        }
        .animate-scale-in-rotated-active { 
          animation: scaleInRotateActive 0.6s ease-out forwards;
        }
        
        .nav-square {
          cursor: pointer;
          transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), background 0.6s cubic-bezier(0.4, 0.0, 0.2, 1), border-color 0.3s ease;
          background: transparent;
        }
        
        .nav-square:hover {
          border-color: #1a1a1a;
        }
        
        .nav-square.is-diamond {
          transform: rotate(45deg) !important;
          background: #242424ff !important;
        }
        .animate-draw-in { animation: drawIn 1s ease-out forwards; transform-origin: left; }
        .animate-slide-out-right { animation: slideOutRight 1s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 1s ease-out forwards; }
        .animate-portrait-reveal { animation: portraitReveal 1.8s cubic-bezier(0.4, 0.0, 0.2, 1) forwards; }
        
        .shape-interactive { 
          transform-origin: center;
        }
        
        .shape-interactive.mouse-active {
          /* Mouse active state - transform and opacity handled via JavaScript */
        }
        
        .shape-active { 
          /* This class will be dynamically managed */
        }
        
        .hover-zone { 
          position: absolute; 
          opacity: 0; 
          pointer-events: none; 
          z-index: 5;
        }
        /* Left background square pattern */
        @keyframes leftSquareFade {
          0% { opacity: 0; transform: translateY(6px) scale(0.95); }
          60% { opacity: 0.9; transform: translateY(2px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .left-pattern {
          position: absolute;
          left: 0;
          top: 0;
          height: 100vh;
          display: grid;
          grid-template-columns: repeat(12, clamp(10px, 1.8vw, 14px));
          grid-auto-rows: clamp(10px, 1.8vw, 14px);
          gap: clamp(4px, 0.8vw, 6px);
          width: clamp(120px, 20vw, 240px);
          padding: clamp(16px, 3vh, 24px) clamp(8px, 1.5vw, 12px);
          opacity: 0.12;
          pointer-events: none;
          z-index: 1;
        }
        .left-pattern .left-square {
          width: clamp(8px, 1.5vw, 12px);
          height: clamp(8px, 1.5vw, 12px);
          background: linear-gradient(180deg, #ffffff 0%, #f3f4f6 50%, #e6e7e9 100%);
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          border-radius: 2px;
          opacity: 0;
          transform: translateY(6px) scale(0.95);
          animation: leftSquareFade 0.5s ease-out forwards;
        }
        .left-pattern .left-diamond {
          width: clamp(8px, 1.5vw, 12px);
          height: clamp(8px, 1.5vw, 12px);
          background: transparent;
          border: 2px solid #242424ff;
          box-shadow: none;
          transform: rotate(45deg) translateY(6px) scale(0.95);
          border-radius: 2px;
          opacity: 0;
          animation: leftSquareFade 0.5s ease-out forwards;
          box-sizing: border-box;
        }
        
        /* Mobile responsive - hide images and adjust layout */
        @media (max-width: 768px) {
          .hero-portrait {
            display: none !important;
          }
          
          .hero-side-text {
            display: none !important;
          }
          
          .hero-text-content {
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            text-align: center !important;
            max-width: 90vw !important;
          }
          
          .hero-learn-more {
            left: 50% !important;
            transform: translateX(-50%) !important;
            text-align: center !important;
          }
          
          .left-pattern {
            display: none !important;
          }
        }
      `}</style>

      {/* Left side - Text content */}
      <div style={{
        position: 'absolute',
        left: 'clamp(5%, 10vw, 10%)',
        top: '38%',
        transform: 'translateY(-50%)',
        maxWidth: 'clamp(280px, 90vw, 520px)',
        opacity: 0,
        animationDelay: '1.0s',
        zIndex: 10,
        textAlign: 'left',
        padding: '0 clamp(8px, 2vw, 16px)',
      }} className="animate-fade-in-left hero-text-content">
        <h2 style={{
          fontSize: 'clamp(28px, 7vw, 90px)',
          fontWeight: 150,
          color: '#000000',
          margin: '0 0 clamp(8px, 2vh, 16px) 0',
          lineHeight: '1.1',
          letterSpacing: '0.02em',
        }}>
          I'm <br />Steve Alden
        </h2>
        <p style={{
          fontSize: 'clamp(14px, 2.2vw, 22px)',
          fontWeight: 150,
          color: '#2b2b2bff',
          lineHeight: '1.5',
          margin: '0 0 clamp(12px, 4vh, 32px) 0',
          letterSpacing: '0.01em',
        }} className={isAnimating ? 'animate-slide-out-right' : 'animate-slide-in-right'}>
          {currentTitle}
        </p>
        <div style={{
          fontSize: 'clamp(11px, 1.6vw, 16px)',
          fontWeight: 300,
          color: '#555555',
          lineHeight: '1.7',
          maxWidth: 'clamp(260px, 85vw, 420px)',
          opacity: 0,
          animationDelay: '1.4s',
        }} className="animate-fade-in-up">
          

        </div>
      </div>

      {/* Left side vertical text - 2005 BINUS Student */}
      <div style={{
        position: 'absolute',
        left: 'clamp(2%, 3vw, 3%)',
        top: '15%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(12px, 2vh, 20px)',
        opacity: 0,
        animationDelay: '1.8s',
        zIndex: 10,
      }} className="animate-fade-in-left hero-side-text">
        <p style={{
          fontSize: 'clamp(8px, 1.2vw, 12px)',
          fontWeight: 300,
          color: '#555555',
          margin: 0,
          letterSpacing: '0.1em',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
        }}>
          BINUS Student
        </p>
        <div style={{
          width: '1px',
          height: 'clamp(280px, 50vh, 540px)',
          background: 'linear-gradient(to bottom, transparent, #d0d0d0 20%, #d0d0d0 80%, transparent)',
        }} />
        <p style={{
          fontSize: 'clamp(10px, 1.4vw, 14px)',
          fontWeight: 300,
          color: '#555555',
          margin: 0,
          letterSpacing: '0.1em',
          transform: 'rotate(-90deg)',
        }}>
          2005
        </p>
      </div>

      {/* Right side - Portrait image */}
      <div style={{
        position: 'absolute',
        right: '0',
        bottom:'0',
        width: 'clamp(45%, 50vw, 55%)',
        height: '100vh',
        opacity: 0,
        animationDelay: '0.6s',
        zIndex: 5,
      }} className="animate-portrait-reveal hero-portrait">
        <img 
          src="/SelfPort.png" 
          alt="Steve Alden - Self Portrait"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            filter: 'grayscale(0%)',
          }}
        />
      </div>

      

      

      {/* Left S-curve line - repositioned
      <svg style={{
        position: 'absolute',
        left: '-20px',
        top: 0,
        width: '200px',
        height: '150vh',
        overflow: 'hidden',
        opacity: 0.15,
        animationDelay: '0.2s',
      }} className="animate-draw-in" viewBox="0 0 150 700" preserveAspectRatio="none">
        <path d="M -20 0 Q 100 200 0 400 Q -100 600 0 700" 
              stroke="#242424ff" 
              strokeWidth="0.8" 
              fill="none"/>
      </svg> */}

      {/* Learn More section - appears after 5 seconds */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(5%, 6vh, 3%)',
        left: 'clamp(40%, 45vw, 45%)',
        textAlign: 'left',
        opacity: 0,
        animationDelay: '5s',
        zIndex: 10,
        cursor: 'pointer',
      }} className="animate-fade-in-up hero-learn-more" onClick={scrollToAboutMe}>
        <p style={{
          fontSize: 'clamp(8px, 1.5vw, 12px)',
          fontWeight: 200,
          color: '#242424ff',
          letterSpacing: '0.08em',
          margin: '0 0 0px 0',
          textTransform: 'uppercase',
        }}>
          Learn More About Me <span style={{ color: '#000000' }}>🔻</span>
        </p>
        
        
      </div>

      {/* Decorative elements - better spaced distribution */}
      
      {/* Large dot grid cluster - moved to bottom left
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '25%',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '16px',
        opacity: 0,
        animationDelay: '0.8s',
      }} className="animate-fade-in-left shape-interactive">
        {Array.from({length: 24}, (_, i) => (
          <div key={i} style={{
            width: '2.5px',
            height: '2.5px',
            background: '#242424ff',
            borderRadius: '50%',
            opacity: 0,
            animation: `scaleInDot 0.4s ease-out forwards`,
            animationDelay: `${0.8 + (i * 0.015)}s`,
          }} />
        ))}
      </div> */}

      {/* Circle outline - middle upper area */}
      {/* <div style={{
        position: 'absolute',
        bottom: '12%',
        left: '42%',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '12px',
        opacity: 0,
        animationDelay: '1.6s',
      }} className="animate-fade-in-up shape-interactive">
        {Array.from({length: 12}, (_, i) => (
          <div key={i} style={{
            width: '3px',
            height: '3px',
            background: '#242424ff',
            borderRadius: '50%',
            opacity: 0,
            animation: `scaleInDot 0.4s ease-out forwards`,
            animationDelay: `${1.6 + (i * 0.02)}s`,
          }} />
        ))}
      </div> */}

      {/* Circle outline - middle upper area */}
      <svg style={{
        position: 'absolute',
        top: '20%',
        left: '48%',
        opacity: 0,
        animationDelay: '2.6s',
        animation: 'scaleIn 1.6s ease-out forwards',
        display: 'clamp(0, calc(100vw - 600px), 1) > 0 ? block : none',
      }} className="shape-interactive" width="clamp(24, 5vw, 38)" height="clamp(24, 5vw, 38)">
        <circle cx="19" cy="19" r="16" 
                stroke="#242424ff" 
                strokeWidth="0.7" 
                fill="none"/>
      </svg>

      {/* Additional shapes with better spacing */}
      
      {/* Accent dots - upper middle area */}
      <div style={{
        position: 'absolute',
        top: '28%',
        left: '42%',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 'clamp(8px, 1.8vw, 14px)',
        opacity: 0,
        animationDelay: '1.2s',
      }} className="animate-fade-in-up shape-interactive">
        {Array.from({length: 12}, (_, i) => (
          <div key={i} style={{
            width: 'clamp(1.5px, 0.3vw, 2px)',
            height: 'clamp(1.5px, 0.3vw, 2px)',
            background: '#242424ff',
            borderRadius: '50%',
            opacity: 0,
            animation: `scaleInDot 0.4s ease-out forwards`,
            animationDelay: `${1.2 + (i * 0.025)}s`,
          }} />
        ))}
      </div>

      {/* Circle accent - middle left area */}
      {/* <svg style={{
        position: 'absolute',
        top: '70%',
        left: '8%',
        opacity: 0,
        animationDelay: '2.0s',
        animation: 'fadeInLeft 0.8s ease-out forwards',
      }} className="shape-interactive" width="32" height="32">
        <circle cx="16" cy="16" r="13" 
                stroke="#242424ff" 
                strokeWidth="0.7" 
                fill="none"/>
      </svg> */}

      {/* Top zigzag - moved to bottom middle */}
      {/* <svg style={{
        position: 'absolute',
        bottom: '15%',
        left: '25%',
        opacity: 0,
        animationDelay: '1.8s',
        animation: 'fadeInUp 0.8s ease-out forwards',
      }} className="shape-interactive" width="80" height="40">
        <polyline points="0,20 20,8 40,20 60,8 80,20" 
                  stroke="#242424ff" 
                  strokeWidth="0.7" 
                  fill="none"/>
      </svg> */}

      {/* Additional bottom shapes for better balance */}
      
      {/* Bottom right circle */}
      {/* <svg style={{
        position: 'absolute',
        bottom: '18%',
        left: '45%',
        opacity: 0,
        animationDelay: '2.6s',
        animation: 'scaleIn 0.8s ease-out forwards',
      }} className="shape-interactive" width="28" height="28">
        <circle cx="14" cy="14" r="12" 
                stroke="#242424ff" 
                strokeWidth="0.7" 
                fill="none"/>
      </svg> */}

      {/* Bottom center dots */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '55%',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '8px',
        opacity: 0,
        animationDelay: '3.0s',
      }} className="animate-fade-in-up shape-interactive">
        {Array.from({length: 6}, (_, i) => (
          <div key={i} style={{
            width: '2px',
            height: '2px',
            background: '#242424ff',
            borderRadius: '50%',
            opacity: 0,
            animation: `scaleInDot 0.4s ease-out forwards`,
            animationDelay: `${3.0 + (i * 0.03)}s`,
          }} />
        ))}
      </div>
    </div>
    
    {/* AboutMe Container */}
    <div 
      style={{
        position: 'fixed',
        top: section === 1 ? '0' : section === 2 ? '-100vh' : '100vh',
        left: 0,
        width: '100vw',
        minHeight: '100vh',
        transition: 'top 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
        zIndex: 20,
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <AboutMe 
        isVisible={section === 1}
        onNavigateToProjects={() => {
          // Move to Projects section
          setSection(2)
        }}
      />
    </div>

    {/* Projects Container */}
    <div 
      style={{
        position: 'fixed',
        top: section === 2 ? '0' : section === 3 ? '-100vh' : '100vh',
        left: 0,
        width: '100vw',
        minHeight: '100vh',
        transition: 'top 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
        zIndex: 30,
        background: '#f9fafb',
        overflow: 'hidden',
      }}
    >
      <Projects isVisible={section === 2} />
    </div>

    {/* Contact Section */}
    <div
      style={{
        position: 'fixed',
        top: section === 3 ? '0' : '100vh',
        left: 0,
        width: '100vw',
        minHeight: '100vh',
        transition: 'top 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
        zIndex: 40,
        background: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <Contact isVisible={section === 3} />
    </div>
    </>
  );
};

export default Hero;
