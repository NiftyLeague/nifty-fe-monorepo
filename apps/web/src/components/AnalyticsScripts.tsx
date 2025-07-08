'use client';

import Script from 'next/script';

export function AnalyticsScripts() {
  return (
    <>
      <Script strategy="lazyOnload" id="clarity-script">
        {`
          if (!window.location.host.includes('localhost')) {
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_TAG}");
          }
        `}
      </Script>

      <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
      <Script id="google-analytics">
        {`
          if (!window.location.host.includes('localhost')) {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          }
        `}
      </Script>
    </>
  );
}

export default AnalyticsScripts;
