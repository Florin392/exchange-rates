// API config
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@';

export const API_ENDPOINTS = {
  CURRENCIES: 'latest/v1/currencies.json',
  RATES: (date, currency) => `${date}/v1/currencies/${currency.toLowerCase()}.json`,
};

// App config

export const APP_CONFIG = {
  DEFAULT_BASE_CURRENCY: 'GBP',
  DEFAULT_TARGET_CURRENCIES: ['USD', 'EUR', 'JPY', 'CHF', 'CAD', 'AUD', 'ZAR'],
  DAYS_TO_SHOW: 7,
  MAX_DAYS_BACK: 90,
  API_TIMEOUT: 10000,
};

// Storage keys
export const STORAGE_KEYS = {
  BASE_CURRENCY: 'baseCurrency',
  TARGET_CURRENCIES: 'targetCurrencies',
  SELECTED_DATE: 'selectedDate',
  THEME_MODE: 'themeMode',
};

// Messages
export const MESSAGES = {
  ERROR: {
    NETWORK: 'Unable to connect. Please check your internet connection.',
    API: 'Failed to fetch exchange rates. Please try again later.',
    INVALID_CURRENCY: 'Invalid currency code provided.',
    INVALID_DATE: 'Invalid date selected.',
    DATE_TOO_FAR: 'Selected date is too far in the past (max 90 days).',
    CURRENCY_LIST: 'Unable to load currencies.',
  },
  SUCCESS: {
    RATES_UPDATED: 'Exchange rates updated successfully.',
    CURRENCY_ADDED: 'Currency added to comparison.',
    CURRENCY_REMOVED: 'Currency removed from comparison.',
    BASE_CURRENCY_CHANGED: 'Base currency changed successfully.',
  },
};

// UI Config
export const UI_CONFIG = {
  TABLE: {
    ROWS_PER_PAGE: 10,
    ROWS_PER_PAGE_OPTIONS: [10, 25, 50],
  },
  CHART: {
    COLORS: {
      PRIMARY: '#1976d2',
      SECONDARY: '#9c27b0',
      SUCCESS: '#2e7d32',
      ERROR: '#d32f2f',
      WARNING: '#ed6c02',
      INFO: '#0288d1',
    },
    LINE_THICKNESS: 2,
    POINT_RADIUS: 3,
  },
};

// Currency format options
export const CURRENCY_FORMAT = {
  MINIMUM_FRACTION_DIGITS: 2,
  MAXIMIM_FRACTION_DIGITS: 6,
};

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  CHART_VIEW: true,
  EXPORT: true,
  FAVORITES: true,
};
