import OptimizedImage from '@nl/ui/custom/optimized-image'

const Loading = () => (
  <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
    <h3 style={{ margin: 'auto' }} id="loading-message">
      Redirecting...
    </h3>
    <OptimizedImage
      alt="Nifty League Logo"
      width={200}
      height={70}
      style={{ margin: 'auto' }}
      quality={100}
      src="/img/logos/NL/wordmark.webp"
    />
  </div>
)

export default Loading
