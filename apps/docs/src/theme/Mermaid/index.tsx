import React, { useMemo, useCallback } from 'react';
import { translate } from '@docusaurus/Translate';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { MermaidContainerClassName, useMermaidRenderResult } from '@docusaurus/theme-mermaid/client';

// Define MermaidProps interface directly since it's not exported from the module
interface MermaidProps {
  value: string;
  caption?: string;
}

// This component is only rendered in the browser
function MermaidContent({ value, caption }: MermaidProps): React.JSX.Element {
  // Memoize the getTheme function to prevent re-creation on each render
  const getTheme = useCallback((): 'dark' | 'forest' => {
    if (typeof document !== 'undefined') {
      return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'forest';
    }
    return 'forest';
  }, []);

  const isDarkTheme = getTheme() === 'dark';

  // Memoize themeVariables to prevent re-creation on each render
  const themeVariables = useMemo(
    () => ({
      // Base variables
      darkMode: isDarkTheme,
      background: isDarkTheme ? '#1a1b1e' : '#f6f8fa',
      primaryColor: '#5e72eb',
      primaryTextColor: isDarkTheme ? '#fff' : '#000',
      primaryBorderColor: '#7C0000',
      lineColor: '#F8B229',
      secondaryColor: '#006100',
      tertiaryColor: isDarkTheme ? '#2a2c34' : '#fff',

      // Pie chart specific variables
      pieStrokeWidth: '0.5px',
      pieOuterStrokeWidth: '3px',
      pieTitleTextSize: '34px',
      pieSectionTextSize: '12px',
      pieSectionTextColor: isDarkTheme ? '#fff' : '#000',
      pieOpacity: '1',
      pie1: '#5e72eb',
      pie2: '#620edf',
      pie3: '#388e3c',
      pie4: '#f57c00',
      pie5: '#8f57e2',
      pie6: '#7ed463',
      pie7: '#e57373',
      pie8: '#ffe500',
    }),
    [isDarkTheme],
  );

  // Memoize the config object
  const config = useMemo(() => ({ theme: getTheme(), themeVariables }), [getTheme, themeVariables]);

  const result = useMermaidRenderResult({ text: value, config });

  // Extract svg and check for errors
  const svg = result?.svg;
  const error = result instanceof Error ? result : null;

  if (error) {
    console.error(error);
    return (
      <div className="alert alert--warning">
        {translate(
          { id: 'theme.Mermaid.error', message: 'Failed to render Mermaid diagram:' },
          { error: error.message },
        )}
      </div>
    );
  }

  return (
    <div className="mermaid-container">
      <div
        className={MermaidContainerClassName}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: svg ?? '' }}
      />
      {caption && <div className="mermaid-caption">{caption}</div>}
    </div>
  );
}

// The main exported component
export default function Mermaid(props: MermaidProps): React.JSX.Element {
  return (
    <BrowserOnly
      fallback={
        <div className="alert alert--warning">
          {translate({ id: 'theme.Mermaid.loading', message: 'Loading diagram...' })}
        </div>
      }
    >
      {() => <MermaidContent {...props} />}
    </BrowserOnly>
  );
}
