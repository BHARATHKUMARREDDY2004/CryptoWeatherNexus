import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const days = searchParams.get("days") || "7";
    
    if (!id) {
      return NextResponse.json(
        { error: "Coin ID is required" },
        { status: 400 }
      );
    }
    
    // Fetch historical market data
    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching historical crypto data:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical crypto data" },
      { status: 500 }
    );
  }
}
