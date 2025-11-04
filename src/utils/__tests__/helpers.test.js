import { describe, it, expect } from '@jest/globals';
import { calculatePercentageChange, formatCurrencyRate, formatPercentage } from '../helpers';

describe('Currency Helpers', () => {
  describe('formatCurrencyRate', () => {
    it('should format valid numbers', () => {
      expect(formatCurrencyRate(1.2345)).toBe('1.2345');
      expect(formatCurrencyRate(10.5)).toBe('10.5000');
    });

    it('should handle invalid values', () => {
      expect(formatCurrencyRate(null)).toBe('N/A');
    });
  });

  describe('formatPercentage', () => {
    it('should format with signs', () => {
      expect(formatPercentage(5.5)).toBe('+5.50%');
      expect(formatPercentage(-5.5)).toBe('-5.50%');
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate correctly', () => {
      expect(calculatePercentageChange(100, 150)).toBe(50);
      expect(calculatePercentageChange(100, 50)).toBe(-50);
    });

    it('should return null for zero', () => {
      expect(calculatePercentageChange(0, 100)).toBeNull();
    });
  });
});
