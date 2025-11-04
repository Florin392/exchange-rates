import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, MESSAGES } from '@/config';

// GET all currencies
export const getCurrencyList = async () => {
  try {
    const response = await axios.get(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json'
    );
    return response.data;
  } catch (error) {
    throw new Error(`${MESSAGES.ERROR.CURRENCY_LIST}: ${error.message}`);
  }
};

// GET exchange rates for a specific currency on a specific date
export const getRatesForDate = async (currencyCode, date) => {
  try {
    const url = `https://${date}.currency-api.pages.dev/v1/currencies/${currencyCode.toLowerCase()}.json`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`${MESSAGES.ERROR.API}: ${error.message}`);
  }
};

// GET exchange rates for multiple dates (7-day chart)
export const getRatesForMultipleDates = async (currencyCode, dates) => {
  try {
    const results = await Promise.all(dates.map((date) => getRatesForDate(currencyCode, date)));
    return results;
  } catch (error) {
    throw new Error(`${MESSAGES.ERROR.API}: ${error.message}`);
  }
};

// GET specific currency rates for a date range
export const getRatesForDateRange = async (baseCurrency, targetCurrencies, dates) => {
  try {
    const allRates = await getRatesForMultipleDates(baseCurrency, dates);

    // Transform data into a more usable format
    return allRates.map((rateData, index) => {
      const date = dates[index];
      const rates = rateData[baseCurrency.toLowerCase()];

      // Filter only target currencies
      const filteredRates = {};
      for (const currency of targetCurrencies) {
        const currencyKey = currency.toLowerCase();
        if (rates?.[currencyKey]) {
          filteredRates[currency.toUpperCase()] = rates[currencyKey];
        }
      }

      return {
        date,
        baseCurrency: baseCurrency.toUpperCase(),
        rates: filteredRates,
      };
    });
  } catch (error) {
    throw new Error(`${MESSAGES.ERROR.API}: ${error.message}`);
  }
};

export default {
  getCurrencyList,
  getRatesForDate,
  getRatesForMultipleDates,
  getRatesForDateRange,
};
