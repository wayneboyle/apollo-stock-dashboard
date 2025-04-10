import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ComposedChart,
  Line,
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
}

export function CandlestickChart({ data, dates, title = 'Stock Price' }: CandlestickChartProps) {
  const formattedData = data.map((item, index) => ({
    date: dates[index],
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    color: item.close > item.open ? '#22c55e' : '#ef4444',
  }));

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={formattedData} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickLine={false}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded shadow">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{data.date}</p>
                      <p className="text-sm">Open: ${data.open.toFixed(2)}</p>
                      <p className="text-sm">High: ${data.high.toFixed(2)}</p>
                      <p className="text-sm">Low: ${data.low.toFixed(2)}</p>
                      <p className="text-sm">Close: ${data.close.toFixed(2)}</p>
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
            {formattedData.map((entry, index) => (
              <ReferenceLine
                key={`hl-${index}`}
                segment={[
                  { x: index, y: entry.high },
                  { x: index, y: entry.low }
                ]}
                stroke={entry.color}
                strokeWidth={1}
              />
            ))}
            {/* Open-Close line */}
            {formattedData.map((entry, index) => (
              <ReferenceLine
                key={`oc-${index}`}
                segment={[
                  { x: index, y: entry.open },
                  { x: index, y: entry.close }
                ]}
                stroke={entry.color}
                strokeWidth={6}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
