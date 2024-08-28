import Image from 'next/image';

const Loading = () => (
  <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
    <h3 style={{ margin: 'auto' }} id="loading-message">
      Loading...
    </h3>
    <Image
      alt="Nifty League Logo"
      width={200}
      height={70}
      style={{ margin: 'auto' }}
      quality={100}
      src="/img/logos/NL/wordmark.webp"
    />
  </div>
);

export default Loading;
