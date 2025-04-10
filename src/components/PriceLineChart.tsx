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
}

export function PriceLineChart({ data, title = 'Price Trend' }: PriceLineChartProps) {
  const chartData = data.historical.map((item, index) => ({
    date: data.dates[index],
    price: item.close ?? 0,
    sma20: data.sma20[index] ?? 0,
  }));

  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
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
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded shadow">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{payload[0].payload.date}</p>
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
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              name="Price"
            />
            <Line
              type="monotone"
              dataKey="sma20"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="20-day SMA"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
