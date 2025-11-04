import { describe, it, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import CurrencyTable from '../CurrencyTable';

describe('CurrencyTable', () => {
  const mockDateRange = ['2025-11-02', '2025-11-03', '2025-11-04'];
  const mockTableData = [
    {
      currency: 'USD',
      rates: [1.23, 1.24, 1.25],
      percentageChange: 1.63,
    },
    {
      currency: 'EUR',
      rates: [1.13, 1.14, 1.15],
      percentageChange: 1.77,
    },
  ];

  it('should render loading state', () => {
    render(<CurrencyTable tableData={[]} dateRange={[]} baseCurrency="GBP" loading={true} />);

    expect(screen.getByText(/loading exchange rates/i)).toBeInTheDocument();
  });

  it('should render empty state when no data', () => {
    render(<CurrencyTable tableData={[]} dateRange={[]} baseCurrency="GBP" loading={false} />);

    expect(screen.getByText(/no currencies selected/i)).toBeInTheDocument();
  });

  it('should render table with data', () => {
    render(
      <CurrencyTable
        tableData={mockTableData}
        dateRange={mockDateRange}
        baseCurrency="GBP"
        loading={false}
      />
    );

    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('1.2300')).toBeInTheDocument();
  });

  it('should display percentage change', () => {
    render(
      <CurrencyTable
        tableData={mockTableData}
        dateRange={mockDateRange}
        baseCurrency="GBP"
        loading={false}
      />
    );

    expect(screen.getByText('+1.63%')).toBeInTheDocument();
    expect(screen.getByText('+1.77%')).toBeInTheDocument();
  });

  it('should display base currency in cell', () => {
    render(
      <CurrencyTable
        tableData={mockTableData}
        dateRange={mockDateRange}
        baseCurrency="GBP"
        loading={false}
      />
    );

    const baseCurrencyCells = screen.getAllByText(/1 GBP =/i);
    expect(baseCurrencyCells.length).toBeGreaterThan(0);
  });
});
