import { CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { HistoricalData } from '@/lib/fetchStockData';

interface VolumeChartProps {
  data: HistoricalData[];
  title?: string;
  dates: string[];
  dateRange?: { start: string; end: string } | null;
}

export function VolumeChart({ data, dates, title = 'Trading Volume', dateRange }: VolumeChartProps) {
  const startDate = dateRange ? new Date(dateRange.start) : null;
  const endDate = dateRange ? new Date(dateRange.end) : null;
  startDate?.setHours(0, 0, 0, 0);
  endDate?.setHours(23, 59, 59, 999);

  const filteredIndexes = dateRange
    ? dates.reduce<number[]>((acc, date, index) => {
        const currentDate = new Date(date);
        currentDate.setHours(0, 0, 0, 0);
        if (startDate && endDate && currentDate >= startDate && currentDate <= endDate) {
          acc.push(index);
        }
        return acc;
      }, [])
    : dates.map((_, index) => index);

  const filteredData = filteredIndexes.map(index => data[index]);
  const filteredDates = filteredIndexes.map(index => dates[index]);

  const chartData = filteredData.map((item, index) => ({
    date: filteredDates[index],
    volume: item.volume ?? 0,
  }));

  const formatVolume = (value: number | undefined) => {
    if (value === undefined) return '0';

    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}B`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="w-full h-[400px]">
      <div className="chart-title">{title}</div>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
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
              tickFormatter={formatVolume}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[var(--card)] border border-[var(--border)] p-2 rounded shadow text-[var(--foreground)]">
                      <p className="text-sm opacity-70">{data.date}</p>
                      <p className="text-sm">Volume: {formatVolume(data.volume)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="volume"
              fill="var(--chart-volume)"
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </div>
  );
}
