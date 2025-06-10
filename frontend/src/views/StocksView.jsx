import React, { useEffect, useState } from "react";
import "./StocksView.css";

function StocksView() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    setStocks([
      { name: "Meta (Facebook, Instagram, WhatsApp)", symbol: "META", price: 480.92, change: 1.23 },
      { name: "Snapchat", symbol: "SNAP", price: 10.11, change: -0.56 },
      { name: "Pinterest", symbol: "PINS", price: 32.45, change: 0.88 },
      { name: "Alphabet (YouTube)", symbol: "GOOGL", price: 178.61, change: 2.02 },
      { name: "Tencent (WeChat, TikTok investor)", symbol: "TCEHY", price: 41.93, change: -1.14 }
    ]);
  }, []);

  return (
    <div className="stocks-container">
      <h2>Top Social Media Stocks</h2>
      <table className="stocks-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Symbol</th>
            <th>Price ($)</th>
            <th>Change (%)</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock, i) => (
            <tr key={i}>
              <td>{stock.name}</td>
              <td>{stock.symbol}</td>
              <td>{stock.price.toFixed(2)}</td>
              <td className={stock.change >= 0 ? "up" : "down"}>
                {stock.change > 0 ? "+" : ""}
                {stock.change.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StocksView;
