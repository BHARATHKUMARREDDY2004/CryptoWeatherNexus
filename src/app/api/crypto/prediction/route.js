import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Coin ID is required" },
        { status: 400 }
      );
    }
    
    // Fetch historical price data for prediction
    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    const prices = data.prices;
    const lastPrice = prices[prices.length - 1][1];
    
    // Calculates simple moving averages
    const sma7 = calculateSMA(prices, 7);
    const sma14 = calculateSMA(prices, 14);
    const sma30 = calculateSMA(prices, 30);
    
    // Generates "predictions" for next 7 days
    const predictions = [];
    const startDate = prices[prices.length - 1][0];
    
    // Trend determination based on moving averages
    const trend = sma7 > sma14 ? "bullish" : "bearish";
    const momentum = Math.abs((sma7 / sma14 - 1) * 100);
    
    // Generates prediction points
    for (let i = 1; i <= 7; i++) {
      const date = startDate + i * 24 * 60 * 60 * 1000; // Add days in milliseconds
      let predictedPrice;
      
      if (trend === "bullish") {
        // Bullish prediction with some randomness
        const growthFactor = 1 + (momentum / 100) * (1 + (Math.random() * 0.5 - 0.25));
        predictedPrice = lastPrice * Math.pow(growthFactor, i/7);
      } else {
        // Bearish prediction with some randomness
        const decreaseFactor = 1 - (momentum / 100) * (1 + (Math.random() * 0.5 - 0.25));
        predictedPrice = lastPrice * Math.pow(decreaseFactor, i/7);
      }
      
      predictions.push([date, predictedPrice]);
    }
    
    return NextResponse.json({ 
      data: {
        // Return last 30 days of actual data
        prices: prices.slice(-30),
        predictions,
        trend,
        momentum: momentum.toFixed(2),
        lastPrice,
        movingAverages: {
          sma7,
          sma14,
          sma30
        }
      }
    });
  } catch (error) {
    console.error("Error generating prediction:", error);
    return NextResponse.json(
      { error: "Failed to generate prediction" },
      { status: 500 }
    );
  }
}

// To calculate Simple Moving Average
function calculateSMA(prices, period) {
  if (prices.length < period) {
    return null;
  }
  
  const relevantPrices = prices.slice(-period).map(p => p[1]);
  const sum = relevantPrices.reduce((acc, price) => acc + price, 0);
  return sum / period;
}
