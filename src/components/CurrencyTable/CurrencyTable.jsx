import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, TrendingUp, TrendingDown } from '@mui/icons-material';
import styles from './CurrencyTable.module.scss';
import { formatDateForDisplay } from '@/utils/dateHelper';
import { formatCurrencyRate, formatPercentage } from '@/utils/helpers';

const CurrencyTable = ({ tableData, dateRange, baseCurrency, loading }) => {
  if (loading) {
    return (
      <Box className={styles.loadingContainer}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading exchange rates...
        </Typography>
      </Box>
    );
  }

  if (!tableData || tableData.length === 0) {
    return (
      <Box className={styles.emptyContainer}>
        <Typography variant="body1" color="text.secondary">
          No currencies selected. Please add currencies to compare.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table className={styles.table} stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell className={styles.headerCell}>
              <Typography variant="subtitle2" fontWeight="bold">
                Currency
              </Typography>
            </TableCell>
            {dateRange.map((date) => (
              <TableCell key={date} className={styles.headerCell} align="center">
                <Typography variant="subtitle2" fontWeight="bold">
                  {formatDateForDisplay(date)}
                </Typography>
              </TableCell>
            ))}
            <TableCell className={styles.headerCell} align="center">
              <Typography variant="subtitle2" fontWeight="bold">
                7-Day Change
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => {
            const isPositiveChange = row.percentageChange && row.percentageChange > 0;
            const isNegativeChange = row.percentageChange && row.percentageChange < 0;

            return (
              <TableRow key={row.currency} className={styles.tableRow}>
                <TableCell className={styles.currencyCell}>
                  <Typography variant="body1" fontWeight="medium">
                    {row.currency}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    1 {baseCurrency} =
                  </Typography>
                </TableCell>
                {row.rates.map((rate, index) => (
                  <TableCell
                    key={`${row.currency}-${index}`}
                    align="center"
                    className={styles.rateCell}
                  >
                    {rate ? (
                      <Typography variant="body2">{formatCurrencyRate(rate)}</Typography>
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                ))}
                <TableCell align="center" className={styles.changeCell}>
                  {row.percentageChange !== null ? (
                    <Chip
                      icon={
                        isPositiveChange ? (
                          <TrendingUp fontSize="small" />
                        ) : isNegativeChange ? (
                          <TrendingDown fontSize="small" />
                        ) : null
                      }
                      label={formatPercentage(row.percentageChange)}
                      color={isPositiveChange ? 'success' : isNegativeChange ? 'error' : 'default'}
                      size="small"
                      className={styles.changeChip}
                    />
                  ) : (
                    <Typography variant="body2" color="text.disabled">
                      N/A
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CurrencyTable;
