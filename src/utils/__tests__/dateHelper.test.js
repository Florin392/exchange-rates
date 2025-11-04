import {
  formatDateForApi,
  formatDateForDisplay,
  getLast7Days,
  isDateWithinRange,
  getMaxPastDate,
  getTodayDate,
} from '../dateHelper';
import { describe, it, expect } from '@jest/globals';

describe('dateHelper', () => {
  describe('formatDateForApi', () => {
    it('should format date object to YYYY-MM-DD string', () => {
      const date = new Date('2025-11-04');
      expect(formatDateForApi(date)).toBe('2025-11-04');
    });

    it('should format date string to YYYY-MM-DD string', () => {
      expect(formatDateForApi('2025-11-04')).toBe('2025-11-04');
    });

    it('should handle invalid date and return today', () => {
      const result = formatDateForApi('invalid-date');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('formatDateForDisplay', () => {
    it('should format date to readable format', () => {
      const date = new Date('2025-11-04');
      expect(formatDateForDisplay(date)).toBe('Nov 4, 2025');
    });

    it('should handle date string', () => {
      expect(formatDateForDisplay('2025-11-04')).toBe('Nov 4, 2025');
    });

    it('should return "Invalid Date" for invalid input', () => {
      expect(formatDateForDisplay('invalid')).toBe('Invalid Date');
    });
  });

  describe('getLast7Days', () => {
    it('should return array of 7 dates ending on given date', () => {
      const endDate = new Date('2025-11-04');
      const result = getLast7Days(endDate);

      expect(result).toHaveLength(7);
      expect(result[6]).toBe('2025-11-04');
      expect(result[0]).toBe('2025-10-29');
    });

    it('should default to today if no date provided', () => {
      const result = getLast7Days();
      expect(result).toHaveLength(7);
    });

    it('should handle custom number of days', () => {
      const endDate = new Date('2025-11-04');
      const result = getLast7Days(endDate, 5);
      expect(result).toHaveLength(5);
    });
  });

  describe('isDateWithinRange', () => {
    it('should return true for dates within range', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 30);
      expect(isDateWithinRange(recentDate, 90)).toBe(true);
    });

    it('should return false for dates beyond range', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 100);
      expect(isDateWithinRange(oldDate, 90)).toBe(false);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      expect(isDateWithinRange(futureDate, 90)).toBe(false);
    });
  });

  describe('getMaxPastDate', () => {
    it('should return date formatted as YYYY-MM-DD', () => {
      const result = getMaxPastDate(90);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('getTodayDate', () => {
    it('should return today formatted as YYYY-MM-DD', () => {
      const result = getTodayDate();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
