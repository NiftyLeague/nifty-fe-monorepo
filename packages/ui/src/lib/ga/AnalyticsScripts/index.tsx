'use client';

import Script from 'next/script';

export const GoogleAnalyticsScript = () => (
  <>
    <Script
      id="google-tag-manager"
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
    />
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        if (!window.location.host.includes('localhost') && !window.location.host.includes('staging')) {
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        }
      `}
    </Script>
  </>
);

export const MicrosoftClarityScript = () => (
  <Script id="microsoft-clarity" strategy="lazyOnload">
    {`
      if (!window.location.host.includes('localhost') && !window.location.host.includes('staging')) {
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_TAG}");
      }
    `}
  </Script>
);

export function AnalyticsScripts() {
  return (
    <>
      <GoogleAnalyticsScript />
      <MicrosoftClarityScript />
    </>
  );
}
