import { NextRequest, NextResponse } from "next/server";

// API endpoint to fetch 5-day weather history for a specific city
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!city) {
    return NextResponse.json({ error: "City parameter is required" }, { status: 400 });
  }

  try {
    // Using OpenWeatherMap's 5-day/3-hour forecast API
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch weather history" }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching weather history:", error);
    return NextResponse.json({ error: "An error occurred while fetching data" }, { status: 500 });
  }
}
