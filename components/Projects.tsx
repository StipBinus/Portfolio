import React, { useState, useEffect } from 'react'

interface ProjectsProps {
  isVisible?: boolean
}

interface Project {
  id: string
  title: string
  subtitle?: string
  year: number
  description: string
  tags: string[]
  images?: string[]
  hasArrow?: boolean
  url?: string
}

const Projects: React.FC<ProjectsProps> = ({ isVisible = false }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (isVisible) {
      const t = setTimeout(() => setShouldAnimate(true), 220)
      return () => clearTimeout(t)
    }
    setShouldAnimate(false)
  }, [isVisible])

  const projects: Project[] = [
    {
      id: 'diamond-cut-motors',
      title: 'Diamond Cut Motors',
      year: 2024,
      description: 'Showroom Website for fictional car company',
      tags: ['UI/UX', 'WebDev'],
      hasArrow: true,
      url: 'https://diamond-cut-motors-final-html-finished-copy-stippps-projects.vercel.app?_vercel_share=igDaQAgqX97H1DfbKUHBIoW5OuMZ1OWp',
      images: ['/Cras.png', '/DiamondCutHome.png'],
    },
    {
      id: 'taskora',
      title: 'Taskora',
      year: 2025,
      description: 'AI based android software task scheduler',
      tags: ['UI/UX', 'Software'],
      hasArrow: true,
      url: 'https://github.com/alvinrk335/Taskora',
    },
    {
      id: 'karsaloka',
      title: 'KarsaLoka',
      subtitle: 'marketplace',
      year: 2025,
      description: 'Marketplace website that supports group buying and location based support',
      tags: ['UI/UX', 'Backend', 'Software'],
      images: ['/Logo.png', '/GroupBuy.png'],
      hasArrow: true,
      url: 'https://karsa-loka.vercel.app/marketplace',
    },
  ]

  return (
    <div
      id="projects"
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#ffffff',
        position: 'relative',
        padding: 'clamp(64px, 8vh, 100px) clamp(48px, 8vw, 160px) clamp(48px, 6vh, 80px)',
        boxSizing: 'border-box',
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: '1600px', margin: '0 auto', opacity: shouldAnimate ? 1 : 0, transition: 'opacity 700ms ease' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '14px', fontWeight: 300, color: '#666666', marginBottom: '8px' }}>/ projects</div>
          <h1 style={{ fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 200, margin: 0, lineHeight: 1.02, color: '#000000' }}>Explore&nbsp;&nbsp;&nbsp;My<br/>Projects</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {projects.map((p, i) => (
            <ProjectRow 
              key={p.id} 
              project={p} 
              index={i} 
              isExpanded={expandedId === p.id}
              onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const ProjectRow: React.FC<{ project: Project; index: number; isExpanded: boolean; onToggle: () => void }> = ({ project, index, isExpanded, onToggle }) => {

  return (
    <div 
      role="button"
      aria-pressed={isExpanded}
      aria-expanded={isExpanded}
      tabIndex={0}
  onClick={onToggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
      style={{ 
        borderBottom: index < 2 ? '1px solid rgba(0,0,0,0.06)' : 'none', 
        padding: isExpanded ? '28px 0 52px 0' : '28px 0', 
        paddingRight: '72px',
        position: 'relative',
        display: 'grid',
  // Keep columns fixed so middle description doesn't shift when rows expand.
  // Left column width is fixed to 320px (enough room for logos); right column kept 280px.
  gridTemplateColumns: '320px 1fr 280px',
        gap: '24px',
        alignItems: 'flex-start',
        cursor: 'pointer',
        transition: 'all 450ms cubic-bezier(0.4, 0, 0.2, 1), padding 450ms cubic-bezier(0.4, 0, 0.2, 1), height 450ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Left column: Title, Year and (expanded) images under the title */}
      <div style={{
        opacity: isExpanded ? 1 : 0.95,
        transform: 'translateX(0)',
        transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 400, color: '#000' }}>{project.title}</h3>
          {project.subtitle && <span style={{ color: '#888', fontSize: '13px' }}>{project.subtitle}</span>}
        </div>
        <div style={{ color: '#999', fontSize: '13px', marginBottom: 10 }}>• {project.year}</div>

        {/* Images shown under title only when expanded. Height fixed, width varies by image aspect ratio. */}
        <div style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          maxHeight: isExpanded ? '140px' : '0px',
          overflow: 'hidden',
          opacity: isExpanded ? 1 : 0,
          transform: isExpanded ? 'translateY(0) scale(1)' : 'translateY(-12px) scale(0.92)',
          transition: 'all 450ms cubic-bezier(0.4, 0, 0.2, 1) 50ms'
        }}>
          {project.images && project.images.length > 0 ? (
            project.images.map((img, idx) => (
              <div key={idx} style={{
                height: 96,
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
                background: '#fff',
                display: 'inline-block',
                opacity: isExpanded ? 1 : 0,
                transform: isExpanded ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(-8px)',
                transition: `all 400ms cubic-bezier(0.4, 0, 0.2, 1) ${100 + idx * 70}ms`,
              }}>
                <img src={img} alt={`${project.title} ${idx}`} style={{ height: 96, width: 'auto', display: 'block' }} />
              </div>
            ))
          ) : null}
        </div>
      </div>

      {/* Middle column: Description */}
      <div style={{
        opacity: isExpanded ? 1 : 0.85,
        transition: 'opacity 350ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <p style={{ margin: 0, color: '#666', fontSize: '15px', lineHeight: 1.6 }}>{project.description}</p>
      </div>

      {/* Right column: Tags (always visible) + Images and Arrow (only when expanded) */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        alignItems: 'flex-start',
        transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Tags */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end', width: '100%' }}>
          {project.tags.map((t, idx) => (
            <span key={t} style={{ 
              padding: '6px 14px', 
              borderRadius: 20, 
              background: isExpanded ? '#111' : '#eee', 
              color: isExpanded ? '#fff' : '#444', 
              fontSize: '13px',
              fontWeight: 400,
              transform: isExpanded ? 'scale(1)' : 'scale(1)',
              transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}>{t}</span>
          ))}
        </div>

        {/* Expanded content: Images and Arrow */}
        <div style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxHeight: isExpanded ? '200px' : '0px',
          opacity: isExpanded ? 1 : 0,
          overflow: 'hidden',
          transform: isExpanded ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1) 100ms'
        }}>
          {/* images moved to left column under title per design */}
        </div>

        {/* Arrow button on the right */}
        {project.hasArrow && (
          <button 
            aria-label={`open ${project.title}`} 
            onClick={(e) => { e.stopPropagation(); if (project.url) window.open(project.url, '_blank'); }}
            style={{ 
              position: 'absolute',
              right: '0%',
              top: '70%',
              zIndex: 5,
              width: 44,
              height: 44,
              borderRadius: '50%', 
              border: 'none', 
              background: '#111', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              flexShrink: 0,
              opacity: isExpanded ? 1 : 0,
              transform: isExpanded ? 'translateY(-50%) scale(1) rotate(0deg)' : 'translateY(-50%) scale(0.8) rotate(-90deg)',
              transition: 'all 350ms cubic-bezier(0.4, 0, 0.2, 1) 300ms'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default Projects
