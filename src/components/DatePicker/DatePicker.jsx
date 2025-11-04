import { formatDateForApi, getMaxPastDate, isDateWithinRange } from '@/utils/dateHelper';
import styles from './DatePicker.module.scss';
import { Box, TextField, Typography } from '@mui/material';
import { DATE_RANGE } from '@/config';

const DatePicker = ({ selectedDate, onDateChange }) => {
  const today = formatDateForApi(new Date());
  const minDate = getMaxPastDate(DATE_RANGE.MAX_DAYS_BACK);

  const handleDateChange = (e) => {
    const newDate = e.target.value;

    if (isDateWithinRange(new Date(newDate), DATE_RANGE.MAX_DAYS_BACK)) {
      onDateChange(newDate);
    }
  };

  return (
    <Box className={styles.datePickerContainer}>
      <TextField
        type="date"
        label="Select End Date"
        value={selectedDate}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          max: today,
          min: minDate,
        }}
        fullWidth
        variant="outlined"
        helperText={`Shows exchange rates for the 7 days ending on the selected date(max ${DATE_RANGE.MAX_DAYS_BACK} days back)`}
        className={styles.dateInput}
      />
    </Box>
  );
};

export default DatePicker;
