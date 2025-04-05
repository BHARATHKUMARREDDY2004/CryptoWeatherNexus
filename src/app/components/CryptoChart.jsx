import React, { useEffect, useRef } from "react";
import { format } from "date-fns";

const CryptoChart = ({ data, timeRange, coinName, color = "#c547ff" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (
      !data ||
      !data.prices ||
      data.prices.length === 0 ||
      !canvasRef.current
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const prices = data.prices;

    // Get dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate min/max prices
    const minPrice = Math.min(...prices.map((p) => p[1])) * 0.98;
    const maxPrice = Math.max(...prices.map((p) => p[1])) * 1.02;
    const priceRange = maxPrice - minPrice;

    // Define chart area
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Draw axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;

    // X axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw Y axis labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "12px Arial";
    ctx.textAlign = "right";

    const numYLabels = 5;
    for (let i = 0; i <= numYLabels; i++) {
      const y = padding + chartHeight * (i / numYLabels);
      const price = maxPrice - (i / numYLabels) * priceRange;
      ctx.fillText(price.toFixed(2), padding - 10, y + 4);

      // Grid line
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw X axis labels
    ctx.textAlign = "center";
    const numXLabels = Math.min(6, prices.length);
    for (let i = 0; i < numXLabels; i++) {
      const x = padding + chartWidth * (i / (numXLabels - 1));
      const index = Math.floor((i / (numXLabels - 1)) * (prices.length - 1));
      const date = new Date(prices[index][0]);

      let dateLabel;
      if (timeRange <= 1) {
        dateLabel = format(date, "HH:mm");
      } else if (timeRange <= 7) {
        dateLabel = format(date, "E");
      } else {
        dateLabel = format(date, "MMM d");
      }

      ctx.fillText(dateLabel, x, height - padding + 20);
    }

    // Draw price line
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;

    // Move to first point
    const initialX = padding;
    const initialY =
      padding +
      chartHeight -
      (chartHeight * (prices[0][1] - minPrice)) / priceRange;
    ctx.moveTo(initialX, initialY);

    // Draw line to each point
    for (let i = 1; i < prices.length; i++) {
      const x = padding + (i / (prices.length - 1)) * chartWidth;
      const y =
        padding +
        chartHeight -
        (chartHeight * (prices[i][1] - minPrice)) / priceRange;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw a gradient fill below the line
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, "rgba(197, 71, 255, 0.4)");
    gradient.addColorStop(1, "rgba(197, 71, 255, 0)");

    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw dots for certain points
    const numDots = Math.min(12, prices.length);
    ctx.fillStyle = "white";

    for (
      let i = 0;
      i < prices.length;
      i += Math.floor(prices.length / numDots)
    ) {
      const x = padding + (i / (prices.length - 1)) * chartWidth;
      const y =
        padding +
        chartHeight -
        (chartHeight * (prices[i][1] - minPrice)) / priceRange;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw title
    ctx.fillStyle = "white";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `${coinName} Price Chart - ${timeRange} ${
        timeRange === 1 ? "Day" : "Days"
      }`,
      width / 2,
      20
    );
  }, [data, timeRange, coinName, color]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full h-auto bg-black/20 rounded-lg"
    />
  );
};

export default CryptoChart;
