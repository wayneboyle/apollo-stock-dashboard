import { CardContent } from '@/components/ui/card';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { HistoricalData } from '@/lib/fetchStockData';

interface CandlestickChartProps {
  data: HistoricalData[];
  title?: string;
  dates: string[];
  dateRange?: { start: string; end: string } | null;
}

export function CandlestickChart({ data, dates, title = 'Stock Price', dateRange }: CandlestickChartProps) {
  console.log('CandlestickChart received dateRange:', dateRange);
  console.log('Sample of dates array:', dates.slice(0, 5));

  const startDate = dateRange ? new Date(dateRange.start) : null;
  const endDate = dateRange ? new Date(dateRange.end) : null;
  startDate?.setHours(0, 0, 0, 0);
  endDate?.setHours(23, 59, 59, 999);

  console.log('Parsed dates:', {
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString()
  });

  const filteredIndexes = dateRange
    ? dates.reduce<number[]>((acc, date, index) => {
        const currentDate = new Date(date);
        currentDate.setHours(0, 0, 0, 0);
        if (startDate && endDate && currentDate >= startDate && currentDate <= endDate) {
          acc.push(index);
        }
        if (index < 5) {
          console.log('Date comparison:', {
            date,
            currentDate: currentDate.toISOString(),
            isInRange: startDate && endDate && currentDate >= startDate && currentDate <= endDate
          });
        }
        return acc;
      }, [])
    : dates.map((_, index) => index);

  console.log('Filtered indexes:', filteredIndexes.length);

  const filteredData = filteredIndexes.map(index => data[index]);
  const filteredDates = filteredIndexes.map(index => dates[index]);

  const formattedData = filteredData.map((item, index) => ({
    index, // Add index for x-axis positioning
    date: filteredDates[index],
    open: item.open ?? 0,
    high: item.high ?? 0,
    low: item.low ?? 0,
    close: item.close ?? 0,
    color: (item.close ?? 0) > (item.open ?? 0) ? 'var(--chart-bullish)' : 'var(--chart-bearish)',
  }));

  return (
    <div className="w-full h-[400px]">
      <div className="chart-title">{title}</div>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={formattedData} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis
              dataKey="index"
              stroke="var(--foreground)"
              style={{ fontSize: '12px' }}
              tickLine={false}
              tickFormatter={(index) => formattedData[index]?.date || ''}
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
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[var(--card)] border border-[var(--border)] p-2 rounded shadow text-[var(--foreground)]">
                      <p className="text-sm opacity-70">{data.date}</p>
                      <p className="text-sm">Open: ${(data.open ?? 0).toFixed(2)}</p>
                      <p className="text-sm">High: ${(data.high ?? 0).toFixed(2)}</p>
                      <p className="text-sm">Low: ${(data.low ?? 0).toFixed(2)}</p>
                      <p className="text-sm">Close: ${(data.close ?? 0).toFixed(2)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Candlestick body */}
            <Bar
              dataKey="open"
              fill="transparent"
              stroke="none"
              yAxisId={0}
              barSize={3}
            />
            {/* High-Low line */}
            {formattedData.map((entry) => (
              <ReferenceLine
                key={`hl-${entry.date}`}
                segment={[
                  { x: entry.index, y: entry.high },
                  { x: entry.index, y: entry.low }
                ]}
                stroke={entry.color}
                strokeWidth={1}
              />
            ))}
            {/* Open-Close line */}
            {formattedData.map((entry) => (
              <ReferenceLine
                key={`oc-${entry.date}`}
                segment={[
                  { x: entry.index, y: entry.open },
                  { x: entry.index, y: entry.close }
                ]}
                stroke={entry.color}
                strokeWidth={6}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </div>
  );
}
