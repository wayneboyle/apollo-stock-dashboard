import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { CompanyProfile, StockQuote } from '@/lib/fetchStockData';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';

interface StockCardProps {
  quote: StockQuote;
  profile: CompanyProfile;
  isLoading?: boolean;
}

export function StockCard({ quote, profile, isLoading = false }: StockCardProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const marketChange = quote.regularMarketChange ?? 0;
  const isPositiveChange = (quote.regularMarketChange ?? 0) >= 0;
  const changeColor = isPositiveChange ? 'text-green-600' : 'text-red-600';
  const ChangeIcon = isPositiveChange ? ArrowUpIcon : ArrowDownIcon;

  const calculateDayProgress = () => {
    const high = quote.regularMarketDayHigh ?? 0;
    const low = quote.regularMarketDayLow ?? 0;
    const current = quote.regularMarketPrice ?? 0;
    const range = high - low;
    if (range === 0) return 0;
    const progress = current - low;
    return (progress / range) * 100;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {profile.longName} ({profile.symbol})
        </CardTitle>
        {profile.logo_url && (
          <div className="relative w-8 h-8">
            <Image
              src={profile.logo_url}
              alt={`${profile.longName} logo`}
              fill
              className="object-contain"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${(quote.regularMarketPrice ?? 0).toFixed(2)}</div>
        <div className={`flex items-center space-x-2 ${changeColor}`}>
          <ChangeIcon className="h-4 w-4" />
          <span>
            ${Math.abs(quote.regularMarketChange ?? 0).toFixed(2)} ({Math.abs(quote.regularMarketChangePercent ?? 0).toFixed(2)}%)
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Day High</p>
            <p className="font-medium">${(quote.regularMarketDayHigh ?? 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Day Low</p>
            <p className="font-medium">${(quote.regularMarketDayLow ?? 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Open</p>
            <p className="font-medium">${(quote.regularMarketOpen ?? 0).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Previous Close</p>
            <p className="font-medium">${(quote.regularMarketPreviousClose ?? 0).toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-muted-foreground mb-2">Day Range Progress</p>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${calculateDayProgress()}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
