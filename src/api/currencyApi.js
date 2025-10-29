import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, MESSAGES } from '@/config/index.js';

// GET all currencies
export const getCurrencyList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.CURRENCIES}`);
    return response.data;
  } catch (error) {
    throw new Error(`${MESSAGES.ERROR.CURRENCY_LIST}: ${error.message}`);
  }
};

// GET exchange rates for a specific currency on a specific date
export const getRatesForDate = async (currencyCode, date) => {
  try {
    const endpoint = API_ENDPOINTS.RATES(date, currencyCode);
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    throw new Error(`${MESSAGES.ERROR.API}: ${error.message}`);
  }
};

// GET exchange rates for multiple dates (7-day chart)
export const getRatesForMultipleDates = async (currencyCode, dates) => {
  try {
    const promises = dates.map((date) => getRatesForDate(currencyCode, date));
    const results = await Promise.all(promises);
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
    const formattedData = allRates.map((rateData, index) => {
      const date = dates[index];
      const rates = rateData[baseCurrency.toLowerCase()];

      // Filter only target currencies
      const filteredRates = {};
      targetCurrencies.forEach((currency) => {
        const currencyKey = currency.toLowerCase();
        if (rates && rates[currencyKey]) {
          filteredRates[currency.toUpperCase()] = rates[currencyKey];
        }
      });

      return {
        date,
        baseCurrency: baseCurrency.toUpperCase(),
        rates: filteredRates,
      };
    });

    return formattedData;
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
