import {
  selectBaseCurrency,
  selectTargetCurrencies,
  selectSelectedEndDate,
  selectRates,
  selectDateRange,
  selectCurrencyList,
  selectLoading,
  selectError,
  selectTableData,
  selectAllCurrencies,
  selectAvailableCurrencies,
} from '../currency/selectors';
import { describe, it, expect } from '@jest/globals';

describe('selectors', () => {
  const mockState = {
    currency: {
      baseCurrency: 'GBP',
      targetCurrencies: ['USD', 'EUR', 'JPY'],
      selectedEndDate: '2025-11-04',
      rates: {
        '2025-11-04': { USD: 1.25, EUR: 1.15, JPY: 150.5 },
        '2025-11-03': { USD: 1.24, EUR: 1.14, JPY: 149.5 },
        '2025-11-02': { USD: 1.23, EUR: 1.13, JPY: 148.5 },
      },
      dateRange: ['2025-11-02', '2025-11-03', '2025-11-04'],
      currencyList: {
        usd: 'United States Dollar',
        eur: 'Euro',
        gbp: 'British Pound',
        jpy: 'Japanese Yen',
        cad: 'Canadian Dollar',
      },
      loading: false,
      error: null,
    },
  };

  describe('basic selectors', () => {
    it('should select baseCurrency', () => {
      expect(selectBaseCurrency(mockState)).toBe('GBP');
    });

    it('should select targetCurrencies', () => {
      expect(selectTargetCurrencies(mockState)).toEqual(['USD', 'EUR', 'JPY']);
    });

    it('should select selectedEndDate', () => {
      expect(selectSelectedEndDate(mockState)).toBe('2025-11-04');
    });

    it('should select rates', () => {
      expect(selectRates(mockState)).toEqual(mockState.currency.rates);
    });

    it('should select dateRange', () => {
      expect(selectDateRange(mockState)).toEqual(['2025-11-02', '2025-11-03', '2025-11-04']);
    });

    it('should select currencyList', () => {
      expect(selectCurrencyList(mockState)).toEqual(mockState.currency.currencyList);
    });

    it('should select loading', () => {
      expect(selectLoading(mockState)).toBe(false);
    });

    it('should select error', () => {
      expect(selectError(mockState)).toBeNull();
    });
  });

  describe('selectTableData', () => {
    it('should format data for table display', () => {
      const result = selectTableData(mockState);

      expect(result).toHaveLength(3);
      expect(result[0].currency).toBe('USD');
      expect(result[0].rates).toEqual([1.23, 1.24, 1.25]);
    });

    it('should calculate percentage change', () => {
      const result = selectTableData(mockState);

      // For USD: from 1.23 to 1.25 = (1.25 - 1.23) / 1.23 * 100 ≈ 1.63%
      expect(result[0].percentageChange).toBeCloseTo(1.63, 1);
    });

    it('should handle missing rates', () => {
      const stateWithMissingRates = {
        currency: {
          ...mockState.currency,
          rates: {
            '2025-11-04': { USD: 1.25 },
            '2025-11-03': {},
            '2025-11-02': { USD: 1.23 },
          },
        },
      };

      const result = selectTableData(stateWithMissingRates);
      expect(result[0].rates[1]).toBeNull();
    });

    it('should return null percentage change when rates are missing', () => {
      const stateWithMissingRates = {
        currency: {
          ...mockState.currency,
          rates: {
            '2025-11-04': {},
            '2025-11-03': {},
            '2025-11-02': {},
          },
        },
      };

      const result = selectTableData(stateWithMissingRates);
      expect(result[0].percentageChange).toBeNull();
    });
  });

  describe('selectAllCurrencies', () => {
    it('should return formatted and sorted currency list', () => {
      const result = selectAllCurrencies(mockState);

      expect(result).toHaveLength(5);
      expect(result[0]).toEqual({ code: 'CAD', name: 'Canadian Dollar' });
      expect(result[1]).toEqual({ code: 'EUR', name: 'Euro' });
    });

    it('should convert codes to uppercase', () => {
      const result = selectAllCurrencies(mockState);
      result.forEach((currency) => {
        expect(currency.code).toBe(currency.code.toUpperCase());
      });
    });

    it('should sort alphabetically by code', () => {
      const result = selectAllCurrencies(mockState);
      const codes = result.map((c) => c.code);
      const sortedCodes = [...codes].sort();
      expect(codes).toEqual(sortedCodes);
    });
  });

  describe('selectAvailableCurrencies', () => {
    it('should exclude base currency and target currencies', () => {
      const result = selectAvailableCurrencies(mockState);

      expect(result).toHaveLength(1);
      expect(result[0].code).toBe('CAD');
    });

    it('should return sorted list', () => {
      const stateWithMoreCurrencies = {
        currency: {
          ...mockState.currency,
          currencyList: {
            ...mockState.currency.currencyList,
            aud: 'Australian Dollar',
            chf: 'Swiss Franc',
          },
        },
      };

      const result = selectAvailableCurrencies(stateWithMoreCurrencies);
      const codes = result.map((c) => c.code);
      const sortedCodes = [...codes].sort();
      expect(codes).toEqual(sortedCodes);
    });
  });
});
