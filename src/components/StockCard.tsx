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

  const isPositiveChange = quote.d >= 0;
  const changeColor = isPositiveChange ? 'text-green-600' : 'text-red-600';
  const ChangeIcon = isPositiveChange ? ArrowUpIcon : ArrowDownIcon;

  const calculateDayProgress = () => {
    const range = quote.h - quote.l;
    const current = quote.c - quote.l;
    return (current / range) * 100;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {profile.name} ({profile.ticker})
        </CardTitle>
        {profile.logo && (
          <div className="relative w-8 h-8">
            <Image
              src={profile.logo}
              alt={`${profile.name} logo`}
              fill
              className="object-contain"
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${quote.c.toFixed(2)}</div>
        <div className={`flex items-center space-x-2 ${changeColor}`}>
          <ChangeIcon className="h-4 w-4" />
          <span>
            ${Math.abs(quote.d).toFixed(2)} ({Math.abs(quote.dp).toFixed(2)}%)
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Day High</p>
            <p className="font-medium">${quote.h.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Day Low</p>
            <p className="font-medium">${quote.l.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Open</p>
            <p className="font-medium">${quote.o.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Previous Close</p>
            <p className="font-medium">${quote.pc.toFixed(2)}</p>
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
