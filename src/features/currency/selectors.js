import { calculatePercentageChange } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';

export const selectBaseCurrency = (state) => state.currency.baseCurrency;
export const selectTargetCurrencies = (state) => state.currency.targetCurrencies;
export const selectSelectedEndDate = (state) => state.currency.selectedEndDate;
export const selectRates = (state) => state.currency.rates;
export const selectDateRange = (state) => state.currency.dateRange;
export const selectCurrencyList = (state) => state.currency.currencyList;
export const selectLoading = (state) => state.currency.loading;
export const selectError = (state) => state.currency.error;

// Memoized selector to get formatted table data
export const selectTableData = createSelector(
  [selectTargetCurrencies, selectRates, selectDateRange],
  (targetCurrencies, rates, dateRange) => {
    return targetCurrencies.map((currency) => {
      const currencyRates = dateRange.map((date) => {
        const dayRates = rates[date] || {};
        return dayRates[currency.toUpperCase()] || null;
      });

      // Calculate 7 day change
      const firstRate = currencyRates[0];
      const lastRate = currencyRates[currencyRates.length - 1];
      const percentageChange =
        firstRate && lastRate ? calculatePercentageChange(firstRate, lastRate) : null;

      return {
        currency,
        rates: currencyRates,
        percentageChange,
      };
    });
  }
);

export const selectAllCurrencies = createSelector([selectCurrencyList], (currencyList) => {
  return Object.entries(currencyList)
    .map(([code, name]) => ({
      code: code.toUpperCase(),
      name,
    }))
    .sort((a, b) => a.code.localeCompare(b.code));
});

export const selectAvailableCurrencies = createSelector(
  [selectCurrencyList, selectBaseCurrency, selectTargetCurrencies],
  (currencyList, baseCurrency, targetCurrencies) => {
    const excludedCurrencies = [
      baseCurrency.toLowerCase(),
      ...targetCurrencies.map((c) => c.toLowerCase()),
    ];

    return Object.entries(currencyList)
      .filter(([code]) => !excludedCurrencies.includes(code))
      .map(([code, name]) => ({
        code: code.toUpperCase(),
        name,
      }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }
);
