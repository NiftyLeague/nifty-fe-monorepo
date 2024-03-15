'use client';

import { useState, useEffect, type PropsWithChildren } from 'react';

// third-party
import { IntlProvider, type MessageFormatElement } from 'react-intl';
import useThemeConfig from '@/theme/hooks/useThemeConfig';

// load locales files
const loadLocaleData = (locale: string) => {
  switch (locale) {
    case 'fr':
      return import('@/theme/locales/fr.json');
    case 'ro':
      return import('@/theme/locales/ro.json');
    case 'zh':
      return import('@/theme/locales/zh.json');
    default:
      return import('@/theme/locales/en.json');
  }
};

// ==============================|| LOCALIZATION ||============================== //

export const LocalesProvider = ({ children }: PropsWithChildren) => {
  const { locale } = useThemeConfig();
  const [messages, setMessages] = useState<
    Record<string, string> | Record<string, MessageFormatElement[]> | undefined
  >();

  useEffect(() => {
    loadLocaleData(locale).then(
      (d: { default: Record<string, string> | Record<string, MessageFormatElement[]> | undefined }) => {
        setMessages(d.default);
      },
    );
  }, [locale]);

  return (
    <>
      {messages && (
        <IntlProvider locale={locale} defaultLocale="en" messages={messages}>
          {children}
        </IntlProvider>
      )}
    </>
  );
};

export default LocalesProvider;
