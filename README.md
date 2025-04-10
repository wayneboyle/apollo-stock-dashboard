# Apollo Global Stock Dashboard

A real-time stock market dashboard for Apollo Global Management (APO) built with Next.js 14, featuring live price updates, historical data visualization, and company information.

## Features

- Real-time stock price monitoring
- Day's high, low, and percentage change tracking
- Interactive 7-day price history chart
- Company profile information
- Automatic data refresh every minute
- Responsive design with modern UI components

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- shadcn/ui for UI components
- Chart.js for data visualization
- Finnhub.io API for stock data

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory with your Finnhub API key:
   ```
   FINNHUB_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser

## Environment Variables

- `FINNHUB_API_KEY`: Your Finnhub API key (required)

## API Routes

- `/api/stock?symbol=APO`: Fetches stock data including:
  - Current quote
  - Company profile
  - 7-day price history

## Deployment

This project is ready to be deployed on Vercel:

1. Push your code to a Git repository
2. Import the project to Vercel
3. Add your `FINNHUB_API_KEY` to the environment variables
4. Deploy

## Future Enhancements

- Support for multiple stock symbols
- Additional technical indicators
- Real-time price updates via WebSocket
- Historical data range selection
- Price alerts and notifications
