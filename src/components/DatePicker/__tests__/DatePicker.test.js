import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('@/config/index', () => ({
  DATE_RANGE: { DAYS_TO_SHOW: 7, MAX_DAYS_BACK: 90 },
}));

import * as dateHelper from '@/utils/dateHelper';
jest.mock('@/utils/dateHelper', () => ({
  formatDateForApi: jest.fn(() => '2025-11-04'),
  getMaxPastDate: jest.fn(() => '2025-08-06'),
  isDateWithinRange: jest.fn(() => true),
}));
import DatePicker from '../DatePicker';

describe('DatePicker', () => {
  const mockOnDateChange = jest.fn();
  const selectedDate = '2025-11-04';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render date input with selected date', () => {
    render(<DatePicker selectedDate={selectedDate} onDateChange={mockOnDateChange} />);

    const input = screen.getByLabelText(/select end date/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(selectedDate);
  });

  it('should call onDateChange when date is changed', () => {
    render(<DatePicker selectedDate={selectedDate} onDateChange={mockOnDateChange} />);

    const input = screen.getByLabelText(/select end date/i);
    fireEvent.change(input, { target: { value: '2025-11-01' } });

    expect(mockOnDateChange).toHaveBeenCalledWith('2025-11-01');
  });

  it('should display helper text', () => {
    render(<DatePicker selectedDate={selectedDate} onDateChange={mockOnDateChange} />);

    expect(screen.getByText(/shows exchange rates for the 7 days ending/i)).toBeInTheDocument();
  });

  it('should not call onDateChange for dates beyond 90 days', async () => {
    dateHelper.isDateWithinRange.mockReturnValueOnce(false);

    render(<DatePicker selectedDate={selectedDate} onDateChange={mockOnDateChange} />);
    const input = screen.getByLabelText(/select end date/i);
    fireEvent.change(input, { target: { value: '2025-07-01' } });

    await waitFor(() => {
      expect(mockOnDateChange).not.toHaveBeenCalled();
    });
  });
});
