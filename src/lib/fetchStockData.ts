import yahooFinance from 'yahoo-finance2';

type Quote = {
  symbol: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketOpen?: number;
  regularMarketPreviousClose?: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;
  longName?: string;
  shortName?: string;
  marketCap?: number;
  currency?: string;
  sector?: string;
  industry?: string;
};

type HistoricalRowRaw = {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjclose?: number;
};
import { calculateRSI, calculateSMA } from './technicalIndicators';

// No API key needed for Yahoo Finance

export interface StockQuote {
  symbol: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketOpen?: number;
  regularMarketPreviousClose?: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;
}

export interface CompanyProfile {
  longName: string;
  symbol: string;
  logo_url?: string;
  marketCap?: number;
  currency?: string;
  sector?: string;
  industry?: string;
}

export interface HistoricalData {
  date: Date;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface ProcessedStockData {
  historical: HistoricalData[];
  sma20: number[];
  rsi14: number[];
  dates: string[];
}

export const fetchStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    const quote = await yahooFinance.quote(symbol) as Quote;
    return quote as unknown as StockQuote;
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
};

export const fetchCompanyProfile = async (symbol: string): Promise<CompanyProfile> => {
  const defaultProfile: CompanyProfile = {
    longName: 'N/A',
    symbol: symbol,
    logo_url: undefined,
    marketCap: 0,
    currency: 'USD',
    sector: 'N/A',
    industry: 'N/A',
  };
  try {
    const quote = await yahooFinance.quote(symbol) as Quote;
    return {
      longName: quote.longName || quote.shortName || symbol,
      symbol: quote.symbol,
      logo_url: undefined, // Yahoo Finance API doesn't provide logos
      marketCap: quote.marketCap || 0, // Default to 0 if undefined
      currency: quote.currency || 'USD', // Default to USD if undefined
      sector: typeof quote.sector === 'string' ? quote.sector : 'N/A',
      industry: typeof quote.industry === 'string' ? quote.industry : 'N/A',
    };
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return defaultProfile;
  }
};

export const fetchHistoricalData = async (symbol: string): Promise<ProcessedStockData> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    const queryOptions = { period1: startDate, period2: endDate };
    const result = await yahooFinance.historical(symbol, queryOptions) as HistoricalRowRaw[];

    const historical = (result ?? []).map(item => ({
      date: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    const closePrices = historical.map(item => item.close ?? 0);
    const sma20 = calculateSMA(closePrices, 20);
    const rsi14 = calculateRSI(closePrices, 14);
    const dates = historical.map(item => {
      if (!item?.date) return 'N/A';
      return item.date.toISOString().split('T')[0];
    });

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
