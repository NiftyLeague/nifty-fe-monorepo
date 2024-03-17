'use client';

import { useState, useEffect, type PropsWithChildren } from 'react';
import { IntlProvider, type MessageFormatElement } from 'react-intl';

import useThemeConfig from '../hooks/useThemeConfig';

// load locales files
const loadLocaleData = (locale: string) => {
  switch (locale) {
    case 'fr':
      return import('../locales/fr.json');
    case 'ro':
      return import('../locales/ro.json');
    case 'zh':
      return import('../locales/zh.json');
    default:
      return import('../locales/en.json');
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
