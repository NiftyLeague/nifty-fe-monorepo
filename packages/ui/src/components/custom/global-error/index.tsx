import type { JSX } from 'solid-js'

const pageStyle: JSX.CSSProperties = {
  'align-items': 'center',
  'background-color': '#09090b',
  'box-sizing': 'border-box',
  color: '#fafafa',
  'color-scheme': 'dark',
  display: 'flex',
  'font-family': 'Arial, Helvetica, sans-serif',
  'justify-content': 'center',
  'min-height': '100vh',
  padding: '24px',
  width: '100%',
}

const cardStyle: JSX.CSSProperties = {
  'background-color': '#18181b',
  border: '1px solid #3f3f46',
  'border-radius': '16px',
  'box-sizing': 'border-box',
  'max-width': '480px',
  padding: '40px',
  width: '100%',
}

const eyebrowStyle: JSX.CSSProperties = {
  color: '#a1a1aa',
  'font-size': '12px',
  'font-weight': '700',
  'letter-spacing': '0.16em',
  margin: '0 0 16px',
}

const headingStyle: JSX.CSSProperties = {
  'font-size': 'clamp(28px, 6vw, 40px)',
  'line-height': '1.1',
  margin: '0 0 16px',
}

const messageStyle: JSX.CSSProperties = {
  color: '#a1a1aa',
  'font-size': '16px',
  'line-height': '1.5',
  margin: '0 0 28px',
}

const buttonStyle: JSX.CSSProperties = {
  'background-color': '#620edf',
  border: '1px solid #8b5cf6',
  'border-radius': '999px',
  color: '#ffffff',
  cursor: 'pointer',
  'font-size': '15px',
  'font-weight': '700',
  'min-height': '44px',
  padding: '10px 20px',
}

export interface GlobalErrorPageProps {
  onRetry: () => void
}

export function GlobalErrorPage(props: GlobalErrorPageProps) {
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
        <button onClick={props.onRetry} style={buttonStyle} type="button">
          Try again
        </button>
      </section>
    </main>
  )
}

export default GlobalErrorPage
