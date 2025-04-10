import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
}

export function RSIChart({ data, title = 'RSI (14)' }: RSIChartProps) {
  const chartData = data.dates.map((date, index) => ({
    date,
    rsi: data.rsi14[index] ?? 0,
  }));

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
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
              domain={[0, 100]}
              ticks={[0, 30, 50, 70, 100]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  let status = 'Neutral';
                  if (data.rsi >= 70) status = 'Overbought';
                  if (data.rsi <= 30) status = 'Oversold';
                  
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded shadow">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{data.date}</p>
                      <p className="text-sm">RSI: {(data.rsi ?? 0).toFixed(2)}</p>
                      <p className="text-sm font-medium" style={{
                        color: data.rsi >= 70 ? '#ef4444' : data.rsi <= 30 ? '#22c55e' : '#6b7280'
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
            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
            <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="rsi"
              stroke="#8b5cf6"
              fill="#8b5cf680"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
