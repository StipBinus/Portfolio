import React, { useState, useEffect } from 'react'

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
      }, 2000) // Half of animation duration
    }, 12000) // Change every 12 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    console.log('🎯 Setting up mouse interaction...')

    // Store current positions and target positions for smooth animation
    const shapeStates = new Map<HTMLElement, { currentX: number; currentY: number; targetX: number; targetY: number }>()

    const handleMouseMove = (e: MouseEvent) => {
      const shapes = document.querySelectorAll('.shape-interactive')

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
      <div style={{
      margin: 0,
      padding: 0,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: '#fcfcf7',
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
        .animate-draw-in { animation: drawIn 1s ease-out forwards; transform-origin: left; }
        .animate-slide-out-right { animation: slideOutRight 2s ease-out forwards; }
        .animate-slide-in-right { animation: slideInRight 2s ease-out forwards; }
        
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
      `}</style>
      {/* Logo */}
      <div style={{
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
      </div>

      {/* Placeholder text - left side */}
      <div style={{
        position: 'absolute',
        left: '95px',
        top: '60%',
        transform: 'translateY(-50%)',
        maxWidth: '400px',
        opacity: 0,
        animationDelay: '1.0s',
      }} className="animate-fade-in-left">
        <h2 style={{
          fontSize: 'clamp(32px, 6vw, 48px)',
          fontWeight: 200,
          color: '#000000',
          margin: '0 0 20px 0',
          lineHeight: '1.2',
          letterSpacing: '0.05em',
        }}>
          I'm <br />Steve Alden
        </h2>
        <p style={{
          fontSize: 'clamp(20px, 2vw, 18px)',
          fontWeight: 250,
          color: '#2b2b2bff',
          lineHeight: '1.6',
          margin: 0,
        }} className={isAnimating ? 'animate-slide-out-right' : 'animate-slide-in-right'}>
          {currentTitle}
        </p>
      </div>

      {/* Left S-curve line */}
      <svg style={{
        position: 'absolute',
        left: '0px',
        top: 0,
        width: '180px',
        height: '150vh',
        overflow: 'hidden',
        opacity: 0,
        animationDelay: '0.2s',
      }} className="animate-draw-in" viewBox="0 0 150 700" preserveAspectRatio="none">
        <path d="M -20 0 Q 80 175 -20 350 Q -120 525 -20 700" 
              stroke="#242424ff" 
              strokeWidth="0.5" 
              fill="none"/>
      </svg>

      {/* Dot grid - top right */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '12%',
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gridTemplateRows: 'repeat(6, 1fr)',
        gap: '12px',
        opacity: 0,
        animationDelay: '0.8s',
      }} className="animate-fade-in-right shape-interactive">
        {Array.from({length: 60}, (_, i) => (
          <div key={i} style={{
            width: '3px',
            height: '3px',
            background: '#242424ff',
            borderRadius: '50%',
            opacity: 0,
            animation: `scaleInDot 0.4s ease-out forwards`,
            animationDelay: `${0.8 + (i * 0.02)}s`,
          }} />
        ))}
      </div>

      {/* Dot grid - bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(5, 1fr)',
        gap: '12px',
        opacity: 0,
        animationDelay: '1.2s',
      }} className="animate-fade-in-right shape-interactive">
        {Array.from({length: 40}, (_, i) => (
          <div key={i} style={{
            width: '3px',
            height: '3px',
            background: '#242424ff',
            borderRadius: '50%',
            opacity: 0,
            animation: `scaleInDot 0.4s ease-out forwards`,
            animationDelay: `${1.2 + (i * 0.02)}s`,
          }} />
        ))}
      </div>

      {/* Zigzag - top right */}
      <svg style={{
        position: 'absolute',
        top: '40%',
        right: '10%',
        opacity: 0,
        animationDelay: '1.6s',
        animation: 'fadeInRight 0.8s ease-out forwards',
      }} className="shape-interactive" width="100" height="60">
        <polyline points="0,30 25,10 50,30 75,10 100,30" 
                  stroke="#242424ff" 
                  strokeWidth="0.5" 
                  fill="none"/>
      </svg>

      {/* Zigzag - bottom middle */}
      <svg style={{
        position: 'absolute',
        bottom: '35%',
        right: '35%',
        opacity: 0,
        animationDelay: '2.0s',
        animation: 'fadeInRight 0.8s ease-out forwards',
      }} className="shape-interactive" width="100" height="60">
        <polyline points="0,30 25,10 50,30 75,10 100,30" 
                  stroke="#242424ff" 
                  strokeWidth="0.5" 
                  fill="none"/>
      </svg>

      {/* Square - top right */}
      <div style={{
        position: 'absolute',
        top: '55%',
        right: '5%',
        width: '18px',
        height: '18px',
        border: '2px solid #242424ff',
        opacity: 0,
        animationDelay: '2.4s',
        animation: 'scaleIn 0.6s ease-out forwards',
      }} className="" />

      {/* Diamonds - right side */}
      <div style={{
        position: 'absolute',
        width: '12px',
        height: '12px',
        background: '#242424ff',
        transform: 'rotate(45deg)',
        top: '60%',
        right: '5%',
        opacity: 0,
        animationDelay: '2.8s',
        pointerEvents: 'none',
      }} className="animate-scale-in" />
      <div style={{
        position: 'absolute',
        width: '12px',
        height: '12px',
        background: '#242424ff',
        transform: 'rotate(45deg)',
        top: '64%',
        right: '5%',
        opacity: 0,
        animationDelay: '3.0s',
        pointerEvents: 'none',
      }} className="animate-scale-in" />
      <div style={{
        position: 'absolute',
        width: '12px',
        height: '12px',
        background: '#242424ff',
        transform: 'rotate(45deg)',
        top: '68%',
        right: '5%',
        opacity: 0,
        animationDelay: '3.2s',
        pointerEvents: 'none',
      }} className="animate-scale-in" />

      {/* Chevron - top right */}
      <svg style={{
        position: 'absolute',
        top: '30%',
        right: '35%',
        opacity: 0,
        animationDelay: '3.6s',
        animation: 'fadeInRight 0.8s ease-out forwards',
      }} className="shape-interactive" width="30" height="20">
        <polyline points="0,0 15,10 30,0" 
                  stroke="#242424ff" 
                  strokeWidth="0.5" 
                  fill="none"/>
      </svg>

      {/* Chevron - bottom */}
      <svg style={{
        position: 'absolute',
        bottom: '20%',
        right: '25%',
        opacity: 0,
        animationDelay: '4.0s',
        animation: 'fadeInRight 0.8s ease-out forwards',
      }} className="shape-interactive" width="30" height="20">
        <polyline points="0,0 15,10 30,0" 
                  stroke="#242424ff" 
                  strokeWidth="0.5" 
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
  );
};

export default Hero;
