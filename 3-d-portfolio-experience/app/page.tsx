"use client"

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #f7ecd0 0%, #e9d8a6 100%)',
      fontFamily: 'Noto Serif JP, serif',
    }}>
      <h1 style={{ fontSize: '2.2rem', marginBottom: '2rem', color: '#b08968', letterSpacing: '0.04em' }}>
        Bienvenue sur mon Portfolio
      </h1>
      <div style={{ color: '#444', fontSize: '1.1rem', marginBottom: '2.5rem', textAlign: 'center', maxWidth: 500 }}>
        Choisissez votre expérience&nbsp;:<br />
        <span style={{ fontSize: '0.95em', color: '#b08968' }}>
          Plongez dans un univers 3D immersif ou explorez la version web classique.
        </span>
      </div>
      <button style={{
        display: 'block',
        width: 320,
        padding: '1.2rem 2rem',
        margin: '1.2rem auto',
        fontSize: '1.3rem',
        fontWeight: 700,
        color: '#fff',
        background: '#c73e1d',
        border: 'none',
        borderRadius: '1.5rem',
        boxShadow: '0 4px 24px rgba(199,62,29,0.08)',
        cursor: 'pointer',
        transition: 'background 0.2s, transform 0.2s',
      }}
        onClick={() => window.location.href = '/experience-3d'}
        onMouseOver={e => { e.currentTarget.style.background = '#b08968'; e.currentTarget.style.transform = 'scale(1.04)'; }}
        onMouseOut={e => { e.currentTarget.style.background = '#c73e1d'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        Expérience 3D interactive
      </button>
      <button style={{
        display: 'block',
        width: 320,
        padding: '1.2rem 2rem',
        margin: '1.2rem auto',
        fontSize: '1.3rem',
        fontWeight: 700,
        color: '#fff',
        background: '#c73e1d',
        border: 'none',
        borderRadius: '1.5rem',
        boxShadow: '0 4px 24px rgba(199,62,29,0.08)',
        cursor: 'pointer',
        transition: 'background 0.2s, transform 0.2s',
      }}
        onClick={() => window.location.href = '/portfolio-inspire-ilan'}
        onMouseOver={e => { e.currentTarget.style.background = '#b08968'; e.currentTarget.style.transform = 'scale(1.04)'; }}
        onMouseOut={e => { e.currentTarget.style.background = '#c73e1d'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        Portfolio Web Classique
      </button>
    </div>
  )
}
