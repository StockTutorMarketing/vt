"use client";
import React, { useState, useContext, useEffect } from "react";
import { MyContext } from "@/context/symbolecontext";
import StockSearchBox from "./StockSearchBox";
import { StockSkeleton } from "../Skeleton";
import StockDrawer from "../StockDrawer";
import { GetSymbolForDrawer } from "@/datafeeds/stocks";

export default function StocklistDrawer() {
  const { value, setValue, stockData } = useContext<any>(MyContext);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [selectedStockData, setSelectedStockData] = useState<any>(null);
  const [hoveredStock, setHoveredStock] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false); 
  const [action, setAction] = useState<"buy" | "sell" | null>(null);
  const [stocks, setStocks] = useState<any[]>([]);

  const fetchMoreStocks = async () => {
    try {
      const stockData = await GetSymbolForDrawer();
      setStocks(stockData);
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
      setError("Failed to fetch stock data");
    }
  };

  useEffect(() => {
    fetchMoreStocks();
  }, []);

  const handleStockClick = (instrumentKey: string, symbol: any) => {
    setSelectedStock(instrumentKey);
    setValue(symbol);

    const selectedStockInfo = stockData?.[instrumentKey] || {};
    const price = selectedStockInfo.last_price || "0.0";
    const openPrice = selectedStockInfo.ohlc?.close || 0;
    const totalGain = price !== "0.0" ? (parseFloat(price) - openPrice).toFixed(2) : "0.0";
    const percentageGain = openPrice !== 0 ? ((parseFloat(totalGain) / openPrice) * 100).toFixed(2) : "0.0";

    // Update selected stock data
    setSelectedStockData({
      symbol,
      price,
      openPrice,
      totalGain,
      percentageGain,
      ...selectedStockInfo,
    });

    // Set the document title
    document.title = `${symbol} ${price} (${totalGain}) (${percentageGain}%)`;

    setAction(null);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
  };

  const handleBuyStock = (e: React.MouseEvent, instrumentKey: string, symbol: any) => {
    e.stopPropagation();
    setAction("buy");
    handleStockClick(instrumentKey, symbol);
    setShowDrawer(true); 
  };

  const handleSellStock = (e: React.MouseEvent, instrumentKey: string, symbol: any) => {
    e.stopPropagation();
    setAction("sell");
    handleStockClick(instrumentKey, symbol);
    setShowDrawer(true); 
  };

  return (
    <div className="w-full border-r-2 bg-gray-50 shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Stock List</h2>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      <StockSearchBox />

      {stocks && stocks.length > 0 ? (
        stocks.map(({ symbol, instrumentKey, exchange }: any) => {
          const stockInfo = stockData?.[instrumentKey] || {};
          const price = stockInfo.last_price || "0.0";
          const openPrice = stockInfo.ohlc?.close || 0;
          const change =
            price !== "0.0" ? (parseFloat(price) - openPrice).toFixed(2) : "0";
          const percentage =
            openPrice !== 0
              ? ((Number(change) / openPrice) * 100).toFixed(2)
              : "0";

          const isStockSelected = symbol === selectedStock;
          const isPricePositive = Number(change) >= 0;

          return (
            <div
              key={instrumentKey}
              className={`stockcard p-2 py-2 flex justify-between items-center border-b hover:bg-gray-100 cursor-pointer ${
                isStockSelected ? "bg-gray-200" : ""
              }`}
              onMouseEnter={() => setHoveredStock(symbol)}
              onMouseLeave={() => setHoveredStock(null)}
              onClick={() => handleStockClick(instrumentKey, symbol)}
            >
              <div>
                <div className="font-normal text-xs">{symbol}</div>
                <div className="text-xs text-gray-500">{exchange} EQ</div>
              </div>
              <div className="text-right">
                <div className="text-sm">{price}</div>
                <div
                  className={`text-sm ml-2 ${
                    isPricePositive ? "text-green-500" : "text-red-600"
                  }`}
                >
                  {change} ({percentage}%)
                </div>
              </div>
              {hoveredStock === symbol && (
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded-full text-xs"
                    onClick={(e) => handleBuyStock(e, instrumentKey, symbol)}
                  >
                    Buy
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-full text-xs"
                    onClick={(e) => handleSellStock(e, instrumentKey, symbol)}
                  >
                    Sell
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-center py-4">
          <StockSkeleton />
          <StockSkeleton />
        </div>
      )}

      {showDrawer && (
        <StockDrawer
          closeDrawer={closeDrawer}
          action={action}
          stock={selectedStockData}
        />
      )}
    </div>
  );
}
