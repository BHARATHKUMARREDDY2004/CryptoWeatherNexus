import { NextRequest, NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");
    const latitude = searchParams.get("lat");
    const longitude = searchParams.get("lon");
    
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    let url = "";
    if (address) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${apiKey}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    }
    
    const res = await fetch(url);
    const data = await res.json();
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
