import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ProcessedStockData } from '@/lib/fetchStockData';

interface PriceLineChartProps {
  data: ProcessedStockData;
  title?: string;
  dateRange?: { start: string; end: string } | null;
}

export function PriceLineChart({ data, title = 'Price Trend', dateRange }: PriceLineChartProps) {
  const startDate = dateRange ? new Date(dateRange.start) : null;
  const endDate = dateRange ? new Date(dateRange.end) : null;
  startDate?.setHours(0, 0, 0, 0);
  endDate?.setHours(23, 59, 59, 999);

  const filteredIndexes = dateRange
    ? data.dates.reduce<number[]>((acc, date, index) => {
        const currentDate = new Date(date);
        currentDate.setHours(0, 0, 0, 0);
        if (startDate && endDate && currentDate >= startDate && currentDate <= endDate) {
          acc.push(index);
        }
        return acc;
      }, [])
    : data.dates.map((_, index) => index);

  const filteredData = filteredIndexes.map(index => data.historical[index]);
  const filteredDates = filteredIndexes.map(index => data.dates[index]);
  const filteredSMA = filteredIndexes.map(index => data.sma20[index]);

  const chartData = filteredData.map((item, index) => ({
    date: filteredDates[index],
    price: item.close ?? 0,
    sma20: filteredSMA[index] ?? 0,
  }));

  return (
    <div className="w-full h-[400px]">
      <div className="chart-title">{title}</div>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis
              dataKey="date"
              stroke="var(--foreground)"
              style={{ fontSize: '12px' }}
              tickLine={false}
            />
            <YAxis
              stroke="var(--foreground)"
              style={{ fontSize: '12px' }}
              tickLine={false}
              tickFormatter={(value) => `$${(value ?? 0).toFixed(2)}`}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[var(--card)] border border-[var(--border)] p-2 rounded shadow text-[var(--foreground)]">
                      <p className="text-sm opacity-70">{payload[0].payload.date}</p>
                      <p className="text-sm">Price: ${typeof payload[0].value === 'number' ? payload[0].value.toFixed(2) : payload[0].value}</p>
                      {payload[1] && (
                        <p className="text-sm">SMA(20): ${typeof payload[1].value === 'number' ? payload[1].value.toFixed(2) : payload[1].value}</p>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--chart-price)"
              strokeWidth={2}
              dot={false}
              name="Price"
            />
            <Line
              type="monotone"
              dataKey="sma20"
              stroke="var(--chart-sma)"
              strokeWidth={2}
              dot={false}
              name="20-day SMA"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </div>
  );
}
