import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock constants directly
jest.mock('@/config/index', () => ({
  DEFAULT_BASE_CURRENCY: 'GBP',
  DEFAULT_TARGET_CURRENCIES: ['USD', 'EUR', 'JPY', 'CHF', 'CAD', 'AUD', 'ZAR'],
  DATE_RANGE: {
    DAYS_TO_SHOW: 7,
    MAX_DAYS_BACK: 90,
  },
}));

// Mock the API module before importing anything else
jest.mock('@/api/currencyApi', () => ({
  getCurrencyList: jest.fn(),
  getRatesForDateRange: jest.fn(),
}));

import currencyReducer, {
  setBaseCurrency,
  setSelectedEndDate,
  addTargetCurrency,
  removeTargetCurrency,
  resetToDefaults,
  fetchCurrencyList,
  fetchExchangeRates,
} from '../currency/currencySlice';

describe('currencySlice', () => {
  const initialState = {
    baseCurrency: 'GBP',
    targetCurrencies: ['USD', 'EUR', 'JPY', 'CHF', 'CAD', 'AUD', 'ZAR'],
    selectedEndDate: '2025-11-04',
    rates: {},
    dateRange: [],
    currencyList: {},
    loading: false,
    error: null,
  };

  describe('reducers', () => {
    describe('setBaseCurrency', () => {
      it('should update base currency', () => {
        const newState = currencyReducer(initialState, setBaseCurrency('USD'));
        expect(newState.baseCurrency).toBe('USD');
      });

      it('should swap currencies if new base is in target list', () => {
        const state = {
          ...initialState,
          baseCurrency: 'GBP',
          targetCurrencies: ['USD', 'EUR', 'JPY'],
        };
        const newState = currencyReducer(state, setBaseCurrency('USD'));

        expect(newState.baseCurrency).toBe('USD');
        expect(newState.targetCurrencies).toContain('GBP');
        expect(newState.targetCurrencies).not.toContain('USD');
      });

      it('should handle lowercase currency codes', () => {
        const newState = currencyReducer(initialState, setBaseCurrency('usd'));
        expect(newState.baseCurrency).toBe('USD');
      });
    });

    describe('setSelectedEndDate', () => {
      it('should update selected end date', () => {
        const newDate = '2025-11-10';
        const newState = currencyReducer(initialState, setSelectedEndDate(newDate));
        expect(newState.selectedEndDate).toBe(newDate);
      });
    });

    describe('addTargetCurrency', () => {
      it('should add new currency to target list', () => {
        const state = {
          ...initialState,
          targetCurrencies: ['USD', 'EUR'],
        };
        const newState = currencyReducer(state, addTargetCurrency('GBP'));

        expect(newState.targetCurrencies).toHaveLength(3);
        expect(newState.targetCurrencies).toContain('GBP');
      });

      it('should not add duplicate currency', () => {
        const state = {
          ...initialState,
          targetCurrencies: ['USD', 'EUR'],
        };
        const newState = currencyReducer(state, addTargetCurrency('USD'));

        expect(newState.targetCurrencies).toHaveLength(2);
      });

      it('should handle lowercase currency codes', () => {
        const state = {
          ...initialState,
          targetCurrencies: ['USD'],
        };
        const newState = currencyReducer(state, addTargetCurrency('eur'));

        expect(newState.targetCurrencies).toContain('EUR');
      });
    });

    describe('removeTargetCurrency', () => {
      it('should remove currency from target list', () => {
        const state = {
          ...initialState,
          targetCurrencies: ['USD', 'EUR', 'JPY'],
        };
        const newState = currencyReducer(state, removeTargetCurrency('EUR'));

        expect(newState.targetCurrencies).toHaveLength(2);
        expect(newState.targetCurrencies).not.toContain('EUR');
      });

      it('should handle lowercase currency codes', () => {
        const state = {
          ...initialState,
          targetCurrencies: ['USD', 'EUR', 'JPY'],
        };
        const newState = currencyReducer(state, removeTargetCurrency('eur'));

        expect(newState.targetCurrencies).not.toContain('EUR');
      });
    });

    describe('resetToDefaults', () => {
      it('should reset to default state', () => {
        const modifiedState = {
          ...initialState,
          baseCurrency: 'USD',
          targetCurrencies: ['EUR', 'JPY'],
          selectedEndDate: '2025-09-01',
        };
        const newState = currencyReducer(modifiedState, resetToDefaults());

        expect(newState.baseCurrency).toBe('GBP');
        expect(newState.targetCurrencies).toEqual([
          'USD',
          'EUR',
          'JPY',
          'CHF',
          'CAD',
          'AUD',
          'ZAR',
        ]);
      });
    });
  });

  describe('async thunks', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('fetchCurrencyList', () => {
      it('should set loading to true on pending', () => {
        const action = { type: fetchCurrencyList.pending.type };
        const newState = currencyReducer(initialState, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBeNull();
      });

      it('should update currency list on fulfilled', () => {
        const mockCurrencies = {
          usd: 'United States Dollar',
          eur: 'Euro',
          gbp: 'British Pound',
        };
        const action = {
          type: fetchCurrencyList.fulfilled.type,
          payload: mockCurrencies,
        };
        const newState = currencyReducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.currencyList).toEqual(mockCurrencies);
      });

      it('should set error on rejected', () => {
        const errorMessage = 'Failed to fetch currencies';
        const action = {
          type: fetchCurrencyList.rejected.type,
          payload: errorMessage,
        };
        const newState = currencyReducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(errorMessage);
      });
    });

    describe('fetchExchangeRates', () => {
      it('should set loading to true on pending', () => {
        const action = { type: fetchExchangeRates.pending.type };
        const newState = currencyReducer(initialState, action);

        expect(newState.loading).toBe(true);
        expect(newState.error).toBeNull();
      });

      it('should update rates on fulfilled', () => {
        const mockRates = [
          { date: '2025-11-04', rates: { USD: 1.25, EUR: 1.15 } },
          { date: '2025-11-03', rates: { USD: 1.24, EUR: 1.14 } },
        ];
        const mockDateRange = ['2025-11-03', '2025-11-04'];

        const action = {
          type: fetchExchangeRates.fulfilled.type,
          payload: { rates: mockRates, dateRange: mockDateRange },
        };
        const newState = currencyReducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.rates).toEqual({
          '2025-11-04': { USD: 1.25, EUR: 1.15 },
          '2025-11-03': { USD: 1.24, EUR: 1.14 },
        });
        expect(newState.dateRange).toEqual(mockDateRange);
      });

      it('should set error on rejected', () => {
        const errorMessage = 'Failed to fetch rates';
        const action = {
          type: fetchExchangeRates.rejected.type,
          payload: errorMessage,
        };
        const newState = currencyReducer(initialState, action);

        expect(newState.loading).toBe(false);
        expect(newState.error).toBe(errorMessage);
      });
    });
  });
});
