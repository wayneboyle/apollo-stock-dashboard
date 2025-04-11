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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);

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
      console.log('API Response Data:', {
        dates: data.dates.slice(0, 5),
        sampleDate: new Date(data.dates[0]).toISOString(),
        totalDates: data.dates.length
      });
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
        {stockData && (
          <div className="text-sm mb-4 text-muted-foreground">
            Available data range: {stockData.dates[0]} to {stockData.dates[stockData.dates.length - 1]}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex gap-4 items-center mb-4">
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
        <div className="date-range">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
          <Button
            onClick={() => {
              if (startDate && endDate && stockData) {
                const inputStart = new Date(startDate);
                const inputEnd = new Date(endDate);
                const firstDataDate = new Date(stockData.dates[0]);
                const lastDataDate = new Date(stockData.dates[stockData.dates.length - 1]);

                // Check if selected range overlaps with available data
                if (inputEnd < firstDataDate || inputStart > lastDataDate) {
                  setError(`Please select dates between ${stockData.dates[0]} and ${stockData.dates[stockData.dates.length - 1]}`);
                  return;
                }

                setError(null);
                const startTime = Math.max(inputStart.getTime(), firstDataDate.getTime());
                const endTime = Math.min(inputEnd.getTime(), lastDataDate.getTime());
                
                setDateRange({ 
                  start: new Date(startTime).toISOString().split('T')[0],
                  end: new Date(endTime).toISOString().split('T')[0]
                });
              }
            }}
            disabled={!startDate || !endDate}
          >
            Apply Date Range
          </Button>
        </div>
        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}
      </div>

      {stockData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="chart-panel">
            <CandlestickChart
              data={stockData.historical}
              dates={stockData.dates}
              title={`${symbol} Price (OHLC)`}
              dateRange={dateRange}
            />
          </div>
          <div className="chart-panel">
            <PriceLineChart
              data={stockData}
              title={`${symbol} Price Trend with SMA(20)`}
              dateRange={dateRange}
            />
          </div>
          <div className="chart-panel">
            <VolumeChart
              data={stockData.historical}
              dates={stockData.dates}
              title={`${symbol} Trading Volume`}
              dateRange={dateRange}
            />
          </div>
          <div className="chart-panel">
            <RSIChart
              data={stockData}
              title={`${symbol} RSI(14)`}
              dateRange={dateRange}
            />
          </div>
        </div>
      )}
    </main>
  );
}
