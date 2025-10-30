import React, { useState, useEffect } from 'react'
import AboutMe from './AboutMe'
import FixedHeader from './FixedHeader'

const Hero: React.FC = () => {
  const [currentTitle, setCurrentTitle] = useState('A Developer')
  const [isAnimating, setIsAnimating] = useState(false)

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
    }, 12000) // Change every 12 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const heroThreshold = 50
      const aboutThreshold = window.innerHeight * 0.8 // AboutMe starts after Hero height

      // Scrolling down from Hero section
      if (currentScrollY > lastScrollY && currentScrollY > heroThreshold && currentScrollY < aboutThreshold) {
        const aboutSection = document.getElementById('about-me')
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth' })
        }
      }
      // Scrolling up from AboutMe section
      else if (currentScrollY < lastScrollY && currentScrollY > aboutThreshold * 0.5) {
        const heroSection = document.querySelector('.hero-section')
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' })
        }
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
        const lerpSpeed = 0.15 // Adjust this value: lower = slower, higher = faster (0-1 range)
        
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
      <FixedHeader />
      <div className="hero-section" style={{
      margin: 0,
      padding: 0,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'linear-gradient(to right, #fffaf0ff 0%, #fdfaecff 100%)',
      position: 'relative', 
    }}>
      <style>{`
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
          grid-template-columns: repeat(12, 14px);
          grid-auto-rows: 14px;
          gap: 6px;
          width: 240px;
          padding: 24px 12px;
          opacity: 0.12;
          pointer-events: none;
          z-index: 1;
        }
        .left-pattern .left-square {
          width: 12px;
          height: 12px;
          background: linear-gradient(180deg, #ffffff 0%, #f3f4f6 50%, #e6e7e9 100%);
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          border-radius: 2px;
          opacity: 0;
          transform: translateY(6px) scale(0.95);
          animation: leftSquareFade 0.5s ease-out forwards;
        }
        .left-pattern .left-diamond {
          width: 12px;
          height: 12px;
          background: transparent;
          border: 2px solid #242424ff;
          box-shadow: none;
          transform: rotate(45deg) translateY(6px) scale(0.95);
          border-radius: 2px;
          opacity: 0;
          animation: leftSquareFade 0.5s ease-out forwards;
          box-sizing: border-box;
        }
      `}</style>
      {/* Logo */}
      {/* <div style={{
        position: 'absolute',
        top: '40px',
        left: '60px',
        fontFamily: 'system-ui',
        fontSize: '24px',
        fontWeight: 300,
        letterSpacing: '0.05em',
        color: '#000000',
        opacity: 0,
        animationDelay: '0.5s',
      }} className="animate-fade-in-up">
        steve.
      </div> */}

      {/* Main content - centered in left section */}
      <div style={{
        position: 'absolute',
        left: '6%',
        top: '60%',
        transform: 'translateY(-50%)',
        maxWidth: '480px',
        opacity: 0,
        animationDelay: '1.0s',
        zIndex: 10,
      }} className="animate-fade-in-left">
        <h2 style={{
          fontSize: 'clamp(42px, 7vw, 64px)',
          fontWeight: 150,
          color: '#000000',
          margin: '0 0 16px 0',
          lineHeight: '1.1',
          letterSpacing: '0.02em',
        }}>
          I'm <br />Steve Alden
        </h2>
        <p style={{
          fontSize: 'clamp(18px, 2.2vw, 22px)',
          fontWeight: 150,
          color: '#2b2b2bff',
          lineHeight: '1.5',
          margin: '0 0 32px 0',
          letterSpacing: '0.01em',
        }} className={isAnimating ? 'animate-slide-out-right' : 'animate-slide-in-right'}>
          {currentTitle}
        </p>
        <div style={{
          fontSize: 'clamp(14px, 1.6vw, 16px)',
          fontWeight: 300,
          color: '#555555',
          lineHeight: '1.7',
          maxWidth: '420px',
          opacity: 0,
          animationDelay: '1.4s',
        }} className="animate-fade-in-up">
          

        </div>
      </div>

      {/* Left S-curve line - repositioned */}
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
      </svg>

      {/* Right side decorative elements - repositioned for white bg */}
      
      {/* Large dot grid cluster - top right */}
      <div style={{
        position: 'absolute',
        top: '22%',
        right: '8%',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        gap: '14px',
        opacity: 0,
        animationDelay: '0.8s',
      }} className="animate-fade-in-right shape-interactive">
        {Array.from({length: 96}, (_, i) => (
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
      </div>

      {/* Small accent squares - right side */}
      <div style={{
        position: 'absolute',
        top: '58%',
        right: '12%',
        display: 'flex',
        gap: '8px',
        opacity: 0,
        animationDelay: '1.8s',
      }} className="animate-scale-in shape-interactive">
        <div style={{
          width: '18px',
          height: '18px',
          border: '1.5px solid #242424ff',
          transform: 'rotate(45deg)',
        }} />
        <div style={{
          width: '0',
          height: '0',
        }} />
      </div>

      {/* Zigzag - right upper */}
      <svg style={{
        position: 'absolute',
        top: '48%',
        right: '18%',
        opacity: 0,
        animationDelay: '1.4s',
        animation: 'fadeInRight 0.8s ease-out forwards',
      }} className="shape-interactive" width="120" height="60">
        <polyline points="0,30 30,10 60,30 90,10 120,30" 
                  stroke="#242424ff" 
                  strokeWidth="0.7" 
                  fill="none"/>
      </svg>

      {/* Small dot grid - bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '18%',
        right: '10%',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: 'repeat(4, 1fr)',
        gap: '10px',
        opacity: 0,
        animationDelay: '1.6s',
      }} className="animate-fade-in-right shape-interactive">
        {Array.from({length: 24}, (_, i) => (
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
      </div>

      {/* Chevron - center right */}
      <svg style={{
        position: 'absolute',
        top: '70%',
        right: '28%',
        opacity: 0,
        animationDelay: '2.2s',
        animation: 'fadeInRight 0.8s ease-out forwards',
      }} className="shape-interactive" width="35" height="24">
        <polyline points="0,0 17.5,12 35,0" 
                  stroke="#242424ff" 
                  strokeWidth="0.7" 
                  fill="none"/>
      </svg>

      {/* Circle outline - accent */}
      <svg style={{
        position: 'absolute',
        bottom: '25%',
        right: '22%',
        opacity: 0,
        animationDelay: '2.6s',
        animation: 'scaleIn 0.8s ease-out forwards',
      }} className="shape-interactive" width="32" height="32">
        <circle cx="16" cy="16" r="14" 
                stroke="#242424ff" 
                strokeWidth="0.7" 
                fill="none"/>
      </svg>

      {/* Main content */}
      {/* <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'clamp(30px, 5vw, 60px) clamp(20px, 6vw, 80px)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: 'clamp(48px, 10vw, 96px)',
            fontWeight: 800,
            color: '#000',
            margin: '0 0 clamp(20px, 3vw, 30px) 0',
            lineHeight: '1',
            letterSpacing: '-2px',
          }}>
            Frontend<br />Developer.
          </h1>
          
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#333',
            lineHeight: '1.6',
            margin: '0 0 clamp(40px, 8vw, 80px) 0',
            maxWidth: '520px',
          }}>
            I like to craft solid and scalable frontend products with great user experiences.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(30px, 5vw, 60px)',
            maxWidth: '700px',
          }}>
            <p style={{
              fontSize: 'clamp(14px, 1.5vw, 16px)',
              color: '#555',
              lineHeight: '1.6',
              margin: 0,
            }}>
              Highly skilled at progressive enhancement, design systems & UI Engineering.
            </p>
            <p style={{
              fontSize: 'clamp(14px, 1.5vw, 16px)',
              color: '#555',
              lineHeight: '1.6',
              margin: 0,
            }}>
              Proven experience building successful products for clients across several countries.
            </p>
          </div>
        </div>
      </div> */}
    </div>
    <AboutMe />
    </>
  );
};

export default Hero;
