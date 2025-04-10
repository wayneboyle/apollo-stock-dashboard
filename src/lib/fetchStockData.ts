import yahooFinance from 'yahoo-finance2';
import { calculateRSI, calculateSMA } from './technicalIndicators';

// No API key needed for Yahoo Finance

export interface StockQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketOpen: number;
  regularMarketPreviousClose: number;
  fiftyDayAverage: number;
  twoHundredDayAverage: number;
}

export interface CompanyProfile {
  longName: string;
  symbol: string;
  logo_url?: string;
  marketCap: number;
  currency: string;
  sector: string;
  industry: string;
}

export interface HistoricalData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ProcessedStockData {
  historical: HistoricalData[];
  sma20: number[];
  rsi14: number[];
  dates: string[];
}

export const fetchStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    const quote = await yahooFinance.quote(symbol);
    return quote as StockQuote;
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
};

export const fetchCompanyProfile = async (symbol: string): Promise<CompanyProfile> => {
  try {
    const quote = await yahooFinance.quote(symbol);
    return {
      longName: quote.longName || quote.shortName || symbol,
      symbol: quote.symbol,
      logo_url: undefined, // Yahoo Finance API doesn't provide logos
      marketCap: quote.marketCap,
      currency: quote.currency,
      sector: quote.sector || 'N/A',
      industry: quote.industry || 'N/A',
    };
  } catch (error) {
    console.error('Error fetching company profile:', error);
    throw error;
  }
};

export const fetchHistoricalData = async (symbol: string): Promise<ProcessedStockData> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    const queryOptions = { period1: startDate, period2: endDate };
    const result = await yahooFinance.historical(symbol, queryOptions);

    const historical = result.map(item => ({
      date: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    const closePrices = historical.map(item => item.close);
    const sma20 = calculateSMA(closePrices, 20);
    const rsi14 = calculateRSI(closePrices, 14);
    const dates = historical.map(item => 
      item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    return {
      historical,
      sma20,
      rsi14,
      dates,
    };
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};
