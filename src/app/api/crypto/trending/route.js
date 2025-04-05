import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetchs trending cryptocurrencies from CoinGecko
    const url = "https://api.coingecko.com/api/v3/search/trending";
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Returns only the coins array from the trending data
    return NextResponse.json({ coins: data.coins });
  } catch (error) {
    console.error("Error fetching trending crypto data:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending crypto data" },
      { status: 500 }
    );
  }
}
