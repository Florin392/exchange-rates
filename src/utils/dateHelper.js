// Format date as API data
export const formatDateForApi = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return new Date().toISOString().split('T')[0];
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// Format day mm//dd//yyyy
export const formatDateForDisplay = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getLast7Days = (endDate = new Date(), days = 7) => {
  const dates = [];
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(end);
    date.setDate(date.getDate() - i);
    dates.push(formatDateForApi(date));
  }

  return dates;
};

export const isDateWithinRange = (date, maxDaysBack = 90) => {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - maxDaysBack);

  today.setHours(23, 59, 59, 999);
  minDate.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);

  return checkDate >= minDate && checkDate <= today;
};

export const getMaxPastDate = (daysBack = 90) => {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return formatDateForApi(date);
};

export const getTodayDate = () => {
  return formatDateForApi(new Date());
};
