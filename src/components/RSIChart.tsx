import { CardContent } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ProcessedStockData } from '@/lib/fetchStockData';

interface RSIChartProps {
  data: ProcessedStockData;
  title?: string;
  dateRange?: { start: string; end: string } | null;
}

export function RSIChart({ data, title = 'RSI (14)', dateRange }: RSIChartProps) {
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

  const filteredDates = filteredIndexes.map(index => data.dates[index]);
  const filteredRSI = filteredIndexes.map(index => data.rsi14[index]);

  const chartData = filteredDates.map((date, index) => ({
    date,
    rsi: filteredRSI[index] ?? 0,
  }));

  return (
    <div className="w-full h-[400px]">
      <div className="chart-title">{title}</div>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
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
              domain={[0, 100]}
              ticks={[0, 30, 50, 70, 100]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  let status = 'Neutral';
                  const rsiValue = data.rsi ?? 0;
                  if (rsiValue >= 70) status = 'Overbought';
                  if (rsiValue <= 30) status = 'Oversold';
                  
                  return (
                    <div className="bg-[var(--card)] border border-[var(--border)] p-2 rounded shadow text-[var(--foreground)]">
                      <p className="text-sm opacity-70">{data.date}</p>
                      <p className="text-sm">RSI: {(data.rsi ?? 0).toFixed(2)}</p>
                      <p className="text-sm font-medium" style={{
                        color: rsiValue >= 70 ? 'var(--chart-bearish)' : rsiValue <= 30 ? 'var(--chart-bullish)' : 'var(--foreground)'
                      }}>
                        {status}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {/* Reference lines for overbought/oversold levels */}
            <ReferenceLine y={70} stroke="var(--chart-rsi-threshold)" strokeDasharray="3 3" />
            <ReferenceLine y={30} stroke="var(--chart-rsi-threshold)" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="rsi"
              stroke="var(--chart-rsi)"
              fill="var(--chart-rsi)"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </div>
  );
}
