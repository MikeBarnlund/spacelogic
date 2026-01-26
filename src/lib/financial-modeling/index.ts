// Financial Modeling Library
// Exports all financial calculation functions and market data

export {
  calculateFinancialModel,
  calculateTotalLeaseValue,
  getBaseRent,
  formatCurrency,
  formatCurrencyFull,
  calculateComparison,
} from './calculator';

export {
  CANADIAN_MARKETS,
  MARKETS_BY_KEY,
  getMarketRates,
  getAllMarkets,
  matchLocationToMarket,
} from './markets';
