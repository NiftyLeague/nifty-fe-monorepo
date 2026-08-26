import type { CSSProperties } from 'react'

const pageStyle: CSSProperties = {
  alignItems: 'center',
  backgroundColor: '#09090b',
  boxSizing: 'border-box',
  color: '#fafafa',
  colorScheme: 'dark',
  display: 'flex',
  fontFamily: 'Arial, Helvetica, sans-serif',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '24px',
  width: '100%',
}

const cardStyle: CSSProperties = {
  backgroundColor: '#18181b',
  border: '1px solid #3f3f46',
  borderRadius: '16px',
  boxSizing: 'border-box',
  maxWidth: '480px',
  padding: '40px',
  width: '100%',
}

const eyebrowStyle: CSSProperties = {
  color: '#a1a1aa',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.16em',
  margin: '0 0 16px',
}

const headingStyle: CSSProperties = {
  fontSize: 'clamp(28px, 6vw, 40px)',
  lineHeight: 1.1,
  margin: '0 0 16px',
}

const messageStyle: CSSProperties = {
  color: '#a1a1aa',
  fontSize: '16px',
  lineHeight: 1.5,
  margin: '0 0 28px',
}

const buttonStyle: CSSProperties = {
  backgroundColor: '#620edf',
  border: '1px solid #8b5cf6',
  borderRadius: '999px',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 700,
  minHeight: '44px',
  padding: '10px 20px',
}

export interface GlobalErrorPageProps {
  onRetry: () => void
}

export function GlobalErrorPage({ onRetry }: GlobalErrorPageProps) {
  return (
    <main style={pageStyle}>
      <section
        aria-describedby="global-error-message"
        aria-labelledby="global-error-title"
        role="alert"
        style={cardStyle}
      >
        <p style={eyebrowStyle}>NIFTY LEAGUE</p>
        <h1 id="global-error-title" style={headingStyle}>
          Something went wrong
        </h1>
        <p id="global-error-message" style={messageStyle}>
          An unexpected error interrupted this page. Try again to continue.
        </p>
        <button onClick={onRetry} style={buttonStyle} type="button">
          Try again
        </button>
      </section>
    </main>
  )
}

export default GlobalErrorPage
