import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.NEWSDATA_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=crypto&language=en&size=5`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`News API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({ news: data.results || [] });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news data" },
      { status: 500 }
    );
  }
}
