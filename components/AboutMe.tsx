import React from 'react'

const AboutMe: React.FC = () => {
  return (
    <div id="about-me" style={{
      padding: 'clamp(30px, 5vw, 60px) clamp(20px, 6vw, 80px)',
      background: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '800px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: 'clamp(32px, 6vw, 48px)',
          fontWeight: 300,
          color: '#000000',
          margin: '0 0 20px 0',
          letterSpacing: '0.05em',
        }}>
          About Me
        </h2>
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: '#333333',
          lineHeight: '1.6',
          margin: '0 0 40px 0',
        }}>
          This is a placeholder for the About Me section. Here you can add your personal story, background, and what makes you unique as a developer.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'clamp(20px, 3vw, 40px)',
        }}>
          <div style={{
            padding: '20px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 400,
              color: '#000000',
              margin: '0 0 10px 0',
            }}>
              Placeholder 1
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#555555',
              lineHeight: '1.5',
              margin: 0,
            }}>
              Add your content here.
            </p>
          </div>
          <div style={{
            padding: '20px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 400,
              color: '#000000',
              margin: '0 0 10px 0',
            }}>
              Placeholder 2
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#555555',
              lineHeight: '1.5',
              margin: 0,
            }}>
              Add your content here.
            </p>
          </div>
          <div style={{
            padding: '20px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 400,
              color: '#000000',
              margin: '0 0 10px 0',
            }}>
              Placeholder 3
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#555555',
              lineHeight: '1.5',
              margin: 0,
            }}>
              Add your content here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutMe