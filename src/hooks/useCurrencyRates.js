import {
  addTargetCurrency,
  fetchCurrencyList,
  fetchExchangeRates,
  removeTargetCurrency,
  resetToDefaults,
  setBaseCurrency,
  setSelectedEndDate,
} from '@/features/currency/currencySlice';
import {
  selectAllCurrencies,
  selectAvailableCurrencies,
  selectBaseCurrency,
  selectDateRange,
  selectError,
  selectLoading,
  selectSelectedEndDate,
  selectTableData,
  selectTargetCurrencies,
} from '@/features/currency/selectors';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useCurrencyRates = () => {
  const dispatch = useDispatch();

  const baseCurrency = useSelector(selectBaseCurrency);
  const targetCurrencies = useSelector(selectTargetCurrencies);
  const selectedEndDate = useSelector(selectSelectedEndDate);
  const tableData = useSelector(selectTableData);
  const dateRange = useSelector(selectDateRange);
  const allCurrencies = useSelector(selectAllCurrencies);
  const availableCurrencies = useSelector(selectAvailableCurrencies);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const prevLengthRef = useRef(0);

  useEffect(() => {
    dispatch(fetchCurrencyList());
  }, [dispatch]);

  useEffect(() => {
    if (baseCurrency && targetCurrencies.length > 0 && selectedEndDate) {
      const prevLength = prevLengthRef.current;
      const currentLength = targetCurrencies.length;

      const shouldSkipFetch = currentLength < prevLength;

      if (!shouldSkipFetch) {
        dispatch(
          fetchExchangeRates({
            baseCurrency,
            targetCurrencies,
            endDate: selectedEndDate,
          })
        );
      }

      prevLengthRef.current = currentLength;
    }
  }, [dispatch, baseCurrency, targetCurrencies, selectedEndDate]);

  const handleBaseCurrencyChange = (currency) => {
    dispatch(setBaseCurrency(currency));
  };

  const handleEndDateChange = (date) => {
    dispatch(setSelectedEndDate(date));
  };

  const handleAddCurrency = (currency) => {
    dispatch(addTargetCurrency(currency));
  };

  const handleRemoveCurrency = (currency) => {
    dispatch(removeTargetCurrency(currency));
  };

  const handleReset = () => {
    dispatch(resetToDefaults());
  };

  return {
    baseCurrency,
    targetCurrencies,
    selectedEndDate,
    tableData,
    dateRange,
    allCurrencies,
    availableCurrencies,
    loading,
    error,
    handleBaseCurrencyChange,
    handleEndDateChange,
    handleAddCurrency,
    handleRemoveCurrency,
    handleReset,
  };
};
