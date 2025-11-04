// Format currency rate decimals
export const formatCurrencyRate = (rate, decimals = 4) => {
  if (rate === null || rate === undefined || isNaN(rate)) {
    return 'N/A';
  }
  return Number(rate).toFixed(decimals);
};

// Format percentage with sign and color indication
export const formatPercentage = (percentage) => {
  if (percentage === null || percentage === undefined || isNaN(percentage)) {
    return 'N/A';
  }
  const sign = percentage >= 0 ? '+' : '-';
  return `${sign}${Math.abs(percentage).toFixed(2)}%`;
};

// Calculate percentage change between two values
export const calculatePercentageChange = (oldValue, newValue) => {
  if (
    oldValue === null ||
    oldValue === undefined ||
    newValue === null ||
    newValue === undefined ||
    isNaN(oldValue) ||
    isNaN(newValue) ||
    oldValue === 0
  ) {
    return null;
  }
  return ((newValue - oldValue) / oldValue) * 100;
};
