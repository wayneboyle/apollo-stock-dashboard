import { CSSProperties } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface StockChartProps {
  dates: string[];
  prices: number[];
  isLoading?: boolean;
}

export function StockChart({ dates = [], prices = [], isLoading = false }: StockChartProps) {
  // Mock data for testing
  const mockData = [
    { date: 'Apr 1', price: 100 },
    { date: 'Apr 2', price: 120 },
    { date: 'Apr 3', price: 110 },
    { date: 'Apr 4', price: 130 },
    { date: 'Apr 5', price: 125 },
  ];

  console.log('StockChart props:', { dates, prices, isLoading });
  const data = dates.length > 0 ? dates.map((date, index) => ({
    date,
    price: prices[index],
  })) : mockData;

  const yAxisDomain = dates.length > 0
    ? [
        Math.min(...prices) * 0.995,
        Math.max(...prices) * 1.005
      ]
    : [95, 135];  // Default domain for mock data

  const containerStyle: CSSProperties = {
    width: '100%',
    height: '400px',
    position: 'relative',
  };

  const chartStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  };

  return (
    <div style={containerStyle}>
      {isLoading ? (
        <div style={{ ...chartStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading...
        </div>
      ) : (
        <div style={chartStyle}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="date"
                stroke="#666"
                style={{ fontSize: '12px' }}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis
                stroke="#666"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                domain={yAxisDomain}
              />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: '#666', marginBottom: '4px' }}
                itemStyle={{ color: '#2563eb' }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#2563eb' }}
                isAnimationActive={true}
                animationDuration={750}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
