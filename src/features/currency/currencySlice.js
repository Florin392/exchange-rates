import { getCurrencyList, getRatesForDateRange } from '@/api/currencyApi';
import { DEFAULT_BASE_CURRENCY, DEFAULT_TARGET_CURRENCIES } from '@/config';
import { getLast7Days } from '@/utils/dateHelper';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Fetch all available currencies
export const fetchCurrencyList = createAsyncThunk(
  'currency/fetchCurrencyList',
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrencyList();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch exchange rates for date range
export const fetchExchangeRates = createAsyncThunk(
  'currency/fetchExchangeRates',
  async ({ baseCurrency, targetCurrencies, endDate }, { rejectWithValue }) => {
    try {
      const dateRange = getLast7Days(endDate);
      const rates = await getRatesForDateRange(baseCurrency, targetCurrencies, dateRange);
      return { rates, dateRange };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  baseCurrency: DEFAULT_BASE_CURRENCY,
  targetCurrencies: DEFAULT_TARGET_CURRENCIES,
  selectedEndDate: new Date().toISOString().split('T')[0],
  rates: {},
  dateRange: [],
  currencyList: {},
  loading: false,
  error: null,
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setBaseCurrency: (state, action) => {
      const newBase = action.payload.toUpperCase();
      const oldBase = state.baseCurrency;

      if (state.targetCurrencies.includes(newBase)) {
        state.targetCurrencies = state.targetCurrencies.map((currency) =>
          currency === newBase ? oldBase : currency
        );
      }

      state.baseCurrency = newBase;
    },
    setSelectedEndDate: (state, action) => {
      state.selectedEndDate = action.payload;
    },
    addTargetCurrency: (state, action) => {
      const currency = action.payload.toUpperCase();
      if (!state.targetCurrencies.includes(currency)) {
        state.targetCurrencies.push(currency);
      }
    },
    removeTargetCurrency: (state, action) => {
      const currency = action.payload.toUpperCase();
      state.targetCurrencies = state.targetCurrencies.filter((c) => c !== currency);
    },
    resetToDefaults: (state) => {
      state.baseCurrency = DEFAULT_BASE_CURRENCY;
      state.targetCurrencies = DEFAULT_TARGET_CURRENCIES;
      state.selectedEndDate = new Date().toISOString().split('T')[0];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch currency list
      .addCase(fetchCurrencyList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencyList.fulfilled, (state, action) => {
        state.loading = false;
        state.currencyList = action.payload;
      })
      .addCase(fetchCurrencyList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch exchange rates
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.loading = false;
        const ratesObject = {};
        action.payload.rates.forEach((item) => {
          ratesObject[item.date] = item.rates;
        });
        state.rates = ratesObject;
        state.dateRange = action.payload.dateRange;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setBaseCurrency,
  setSelectedEndDate,
  addTargetCurrency,
  removeTargetCurrency,
  resetToDefaults,
} = currencySlice.actions;

export default currencySlice.reducer;
