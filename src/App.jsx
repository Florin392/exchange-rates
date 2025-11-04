import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  RestartAlt as ResetIcon,
  CurrencyExchange as CurrencyIcon,
} from '@mui/icons-material';
import { useCurrencyRates } from './hooks/useCurrencyRates';
import DatePicker from './components/DatePicker/DatePicker';
import { useState } from 'react';
import CurrencyTable from './components/CurrencyTable/CurrencyTable';
import { APP_CONFIG } from './config';

function App() {
  const {
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
  } = useCurrencyRates();

  const { MIN_CURRENCIES, MAX_CURRENCIES } = APP_CONFIG;

  const [addCurrencyDialogOpen, setAddCurrencyDialogOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [selectedCurrencies, setSelectedCurrencies] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const filteredCurrencies = availableCurrencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
      currency.name.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const handleOpenAddDialog = () => {
    setAddCurrencyDialogOpen(true);
    setSelectedCurrencies([]);
    setCurrencySearch('');
  };

  const handleCloseAddDialog = () => {
    setAddCurrencyDialogOpen(false);
    setSelectedCurrencies([]);
    setCurrencySearch('');
  };

  const handleAddSelectedCurrencies = () => {
    const currentCount = targetCurrencies.length;
    const newCount = selectedCurrencies.length;

    // Check if adding would exceed maximum
    if (currentCount + newCount > MAX_CURRENCIES) {
      setSnackbar({
        open: true,
        message: `Cannot add ${newCount} ${newCount === 1 ? 'currency' : 'currencies'}. Maximum is ${MAX_CURRENCIES} currencies (currently tracking ${currentCount}).`,
        severity: 'error',
      });
      return;
    }

    selectedCurrencies.forEach((currency) => {
      handleAddCurrency(currency);
    });

    setSnackbar({
      open: true,
      message: `Added ${selectedCurrencies.length} ${selectedCurrencies.length === 1 ? 'currency' : 'currencies'}`,
      severity: 'success',
    });

    handleCloseAddDialog();
  };

  const handleRemove = (currency) => {
    // Check minimum requirement
    if (targetCurrencies.length <= MIN_CURRENCIES) {
      setSnackbar({
        open: true,
        message: `Cannot remove ${currency}. Minimum ${MIN_CURRENCIES} currencies required.`,
        severity: 'warning',
      });
      return;
    }

    handleRemoveCurrency(currency);
    setSnackbar({
      open: true,
      message: `Removed ${currency}`,
      severity: 'info',
    });
  };

  const handleResetToDefaults = () => {
    handleReset();
    setSnackbar({
      open: true,
      message: 'Reset to default settings',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const toggleCurrencySelection = (currencyCode) => {
    setSelectedCurrencies((prev) => {
      const newSelection = prev.includes(currencyCode)
        ? prev.filter((c) => c !== currencyCode)
        : [...prev, currencyCode];

      // Check if adding this would exceed max
      if (newSelection.length + targetCurrencies.length > MAX_CURRENCIES) {
        setSnackbar({
          open: true,
          message: `Maximum ${MAX_CURRENCIES} currencies allowed (currently tracking ${targetCurrencies.length})`,
          severity: 'warning',
        });
        return prev;
      }

      return newSelection;
    });
  };

  // Check if we can add more currencies
  const canAddMoreCurrencies = targetCurrencies.length < MAX_CURRENCIES;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <CurrencyIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Exchange Rates
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ my: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => window.location.reload()}>
            {error}
          </Alert>
        )}

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="flex-start">
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              {allCurrencies.length > 0 && (
                <FormControl fullWidth>
                  <InputLabel>Base Currency</InputLabel>
                  <Select
                    value={baseCurrency}
                    onChange={(e) => handleBaseCurrencyChange(e.target.value)}
                    label="Base Currency"
                  >
                    {allCurrencies.map((currency) => (
                      <MenuItem key={currency.code} value={currency.code}>
                        {currency.code}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <DatePicker selectedDate={selectedEndDate} onDateChange={handleEndDateChange} />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddDialog}
                  disabled={loading || !canAddMoreCurrencies}
                >
                  Add Currency
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ResetIcon />}
                  onClick={handleResetToDefaults}
                  disabled={loading}
                >
                  Reset
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {targetCurrencies.map((currency) => (
                <Chip
                  key={currency}
                  label={currency}
                  onDelete={() => handleRemove(currency)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Currently tracking {targetCurrencies.length} of {MAX_CURRENCIES} maximum currencies
              (min: {MIN_CURRENCIES})
            </Typography>
          </Box>
        </Paper>

        <CurrencyTable
          tableData={tableData}
          dateRange={dateRange}
          baseCurrency={baseCurrency}
          onRemoveCurrency={handleRemove}
          loading={loading}
        />
      </Container>

      <Dialog open={addCurrencyDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add Currencies (Max: {MAX_CURRENCIES}, Currently: {targetCurrencies.length})
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search currencies"
            type="text"
            fullWidth
            variant="outlined"
            value={currencySearch}
            onChange={(e) => setCurrencySearch(e.target.value)}
            placeholder="Type to search..."
            sx={{ mb: 2 }}
          />

          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => (
                <ListItem key={currency.code} disablePadding>
                  <ListItemButton
                    onClick={() => toggleCurrencySelection(currency.code)}
                    selected={selectedCurrencies.includes(currency.code)}
                  >
                    <ListItemText primary={currency.code} secondary={currency.name} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                {currencySearch
                  ? 'No currencies found'
                  : 'All available currencies are already added'}
              </Typography>
            )}
          </List>

          {selectedCurrencies.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">Selected: {selectedCurrencies.length}</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedCurrencies.map((code) => (
                  <Chip
                    key={code}
                    label={code}
                    size="small"
                    onDelete={() => toggleCurrencySelection(code)}
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button
            onClick={handleAddSelectedCurrencies}
            variant="contained"
            disabled={selectedCurrencies.length === 0}
          >
            Add Selected ({selectedCurrencies.length})
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
