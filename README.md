# CryptoWeather Nexus

[CryptoWeather Nexus](https://crypto-weather-nexus-gray.vercel.app/)

A modern, multi-page dashboard combining real-time weather data, cryptocurrency information, and news in one comprehensive application.

## Overview

CryptoWeather Nexus is a Next.js application that integrates multiple data sources to provide users with a unified platform for tracking weather conditions, cryptocurrency markets, and crypto-related news. The application features real-time updates, personalization options, and detailed analytics.

## Purpose

CryptoWeather Nexus addresses the needs of users interested in both meteorological data and cryptocurrency markets by:

- Providing real-time weather information for multiple global cities
- Tracking cryptocurrency prices, market trends, and performance metrics
- Delivering the latest crypto-related news
- Offering personalization through favorite cities and cryptocurrencies
- Delivering real-time alerts for significant price movements and weather events
- Enabling detailed historical analysis for both domains

## Technology Stack

### Core Technologies

| Technology                                                                    | Purpose                                                           |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [Next.js](https://nextjs.org/)                                                | React framework with server-side rendering and file-based routing |
| [React](https://reactjs.org/)                                                 | UI component library for building interactive interfaces          |
| [Redux](https://redux.js.org/)                                                | State management with Redux Thunk for asynchronous operations     |
| [Tailwind CSS](https://tailwindcss.com/)                                      | Utility-first CSS framework for responsive design                 |
| [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) | Real-time data updates for cryptocurrency prices                  |

### External APIs

| API                                              | Purpose                                |
| ------------------------------------------------ | -------------------------------------- |
| [OpenWeatherMap](https://openweathermap.org/api) | Weather data for cities worldwide      |
| [CoinGecko](https://www.coingecko.com/en/api)    | Cryptocurrency market data             |
| [NewsData.io](https://newsdata.io/)              | Crypto-related news articles           |
| [CoinCap WebSocket](https://docs.coincap.io/)    | Real-time cryptocurrency price updates |

### Technology Benefits

- **Next.js**: Provides improved performance through server-side rendering, simplified routing with its file system-based router, and optimized image delivery.
- **Redux + Thunk**: Enables predictable state management across the application, making it easier to manage complex data flows and asynchronous operations.
- **Tailwind CSS**: Accelerates UI development with utility classes while ensuring consistent design patterns and fully responsive layouts.
- **WebSockets**: Delivers real-time data updates without constant API polling, reducing latency and server load.

## Features

### Dashboard

- Unified view of weather, cryptocurrency, and news data
- Quick access to detailed sections
- Summary statistics and visualizations

### Weather Tracking

- Current conditions for multiple cities (New Delhi, Hyderabad, Chennai, New York, London, Tokyo)
- Temperature, humidity, and weather state display
- City-specific detailed weather pages
- Historical weather data and charts
- Personalized favorites list

### Cryptocurrency Monitoring

- Live prices, 24h change percentages, and market caps
- Top 5 trending cryptocurrencies
- Real-time price updates via WebSocket
- Detailed coin pages with historical charts
- Price prediction visualizations
- Custom price alerts

### News Feed

- Top five crypto-related headlines
- Article summaries and source information
- Keyword tagging and categorization

### Notifications System

- Real-time alerts for significant price movements
- Weather alerts for extreme conditions
- Alert history and management

### User Preferences

- Favorite cities and cryptocurrencies
- Persistent storage between sessions
- Customizable views and filters

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher) or yarn (v1.22.0 or higher)
- API keys for:
  - OpenWeatherMap
  - NewsData.io
- Git (for version control and deployment)

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/BHARATHKUMARREDDY2004/CryptoWeatherNexus/
   cd cryptoweather-nexus
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```
   NEWSDATA_API_KEY=your_newsdata_io_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production**

   ```bash
   npm run build
   # or
   yarn build
   ```

6. **Start the production server**
   ```bash
   npm run start
   # or
   yarn start
   ```

## Usage Guide

### Navigation

The application features a comprehensive navigation system with sections for:

- Dashboard (home page)
- Weather
- Cryptocurrency
- News
- Favorites
- Notifications

### Weather Section

- View weather for multiple cities
- Search for specific cities
- Add/remove cities from favorites
- Access detailed weather information and forecasts

### Cryptocurrency Section

- Track prices, changes, and market caps
- View trending cryptocurrencies
- Filter by all/favorites/trending
- Set price alerts
- Access detailed cryptocurrency information with charts

### News Section

- Browse latest crypto headlines
- Read article summaries
- Access full articles via source links

### Favorites

- View all saved cities and cryptocurrencies
- Quick access to your most important data

### Notifications

- View all alerts and notifications
- Track price movements and weather alerts

## API Documentation

### Internal API Routes

#### Weather API

- **Endpoint**: `/api/weather`
- **Parameters**:
  - `address`: City name (string)
  - `lat` & `lon`: Coordinates (numbers)
- **Response**: Weather data object

#### Cryptocurrency API

- **Endpoint**: `/api/crypto`
- **Parameters**:
  - `ids`: Comma-separated crypto IDs (string)
- **Response**: Array of cryptocurrency data objects

#### Cryptocurrency History API

- **Endpoint**: `/api/crypto/history`
- **Parameters**:
  - `id`: Cryptocurrency ID (string)
  - `days`: History period (number)
- **Response**: Historical price data

#### News API

- **Endpoint**: `/api/news`
- **Response**: Array of news articles

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository

2. Import your project in Vercel:

   - Sign up/login at [vercel.com](https://vercel.com)
   - Click "New Project" and import your repository
   - Configure environment variables
   - Deploy

3. Your application will be available at a Vercel-generated URL

### Environment Variables for Production

Ensure these variables are set in your Vercel project settings:

- `NEWSDATA_API_KEY`
- `OPENWEATHER_API_KEY`

## Troubleshooting

### Common Issues

**API Rate Limits**

- Symptom: "Failed to fetch" errors
- Solution: Implement caching, reduce update frequency

**WebSocket Connection Issues**

- Symptom: Missing real-time updates
- Solution: Check network connectivity, ensure the WebSocket server is accessible

**Data Not Loading**

- Symptom: Blank sections or loading spinners that never resolve
- Solution: Check API keys, network connectivity, and browser console for errors
