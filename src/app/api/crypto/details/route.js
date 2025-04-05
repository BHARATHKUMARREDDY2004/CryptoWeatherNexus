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
    
    // Fetch detailed coin data
    const url = `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching crypto details:", error);
    return NextResponse.json(
      { error: "Failed to fetch crypto details" },
      { status: 500 }
    );
  }
}
