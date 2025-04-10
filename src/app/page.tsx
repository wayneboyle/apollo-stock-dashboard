'use client';

import { useEffect, useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CandlestickChart } from '@/components/CandlestickChart';
import { PriceLineChart } from '@/components/PriceLineChart';
import { VolumeChart } from '@/components/VolumeChart';
import { RSIChart } from '@/components/RSIChart';
import type { ProcessedStockData } from '@/lib/fetchStockData';

export default function Home() {
  const [symbol, setSymbol] = useState('AAPL');
  const [inputSymbol, setInputSymbol] = useState('AAPL');
  const [stockData, setStockData] = useState<ProcessedStockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!symbol) {
      setError('Please enter a stock symbol');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setStockData(data);
    } catch (err) {
      setError('Error fetching stock data. Please check the symbol and try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbol]); // Add symbol as a dependency since it's used in fetchData

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSymbol(inputSymbol.toUpperCase());
  }, [inputSymbol]);

  useEffect(() => {
    if (symbol) {
      fetchData();
    }
  }, [fetchData, symbol]);

  // Trigger fetchData when symbol changes
  useEffect(() => {
    if (symbol) {
      fetchData();
    }
  }, [symbol, fetchData]);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Stock Analysis Dashboard</h1>
        <form onSubmit={handleSubmit} className="flex gap-4 items-center">
          <Input
            type="text"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="max-w-xs"
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Analyze'}
          </Button>
        </form>
        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}
      </div>

      {stockData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CandlestickChart
            data={stockData.historical}
            dates={stockData.dates}
            title={`${symbol} Price (OHLC)`}
          />
          <PriceLineChart
            data={stockData}
            title={`${symbol} Price Trend with SMA(20)`}
          />
          <VolumeChart
            data={stockData.historical}
            dates={stockData.dates}
            title={`${symbol} Trading Volume`}
          />
          <RSIChart
            data={stockData}
            title={`${symbol} RSI(14)`}
          />
        </div>
      )}
    </main>
  );
}
