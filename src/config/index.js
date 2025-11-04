// API config
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1';

export const API_ENDPOINTS = {
  CURRENCIES: '/currencies.json',
  RATES: (date, currency) => `/currencies/${currency.toLowerCase()}.json`,
};

// App config
export const APP_CONFIG = {
  DEFAULT_BASE_CURRENCY: 'GBP',
  DEFAULT_TARGET_CURRENCIES: ['USD', 'EUR', 'JPY', 'CHF', 'CAD', 'AUD', 'ZAR'],
  DAYS_TO_SHOW: 7,
  MAX_DAYS_BACK: 90,
  MIN_CURRENCIES: 3,
  MAX_CURRENCIES: 7,
};

export const DEFAULT_TARGET_CURRENCIES = APP_CONFIG.DEFAULT_TARGET_CURRENCIES;
export const DEFAULT_BASE_CURRENCY = APP_CONFIG.DEFAULT_BASE_CURRENCY;
export const DATE_RANGE = {
  MAX_DAYS_BACK: APP_CONFIG.MAX_DAYS_BACK,
};

// Messages
export const MESSAGES = {
  ERROR: {
    API: 'Failed to fetch exchange rates. Please try again later.',
    CURRENCY_LIST: 'Unable to load currencies.',
  },
};
