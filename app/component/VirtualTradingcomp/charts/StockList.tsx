"use client";
import React, { useContext, useState, useEffect, useRef } from "react";
import { GetSymbolForDrawer } from "@/datafeeds/stocks";
import TradingViewChart from "@/app/component/VirtualTrading.Chart";
import StockDrawer from "../StockDrawer";
import StockNewsDrawer from "../StockNewsDrawer";
import { FaAngleUp } from "react-icons/fa";
import Holdings from "@/app/component/Holdings";
import Orders from "@/app/component/Orders";
import Position from "@/app/component/Position";
import Image from "next/image";
import { StockSkeleton } from "../Skeleton";
import StockSearchBox from "./StockSearchBox";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import InfiniteScroll from 'react-infinite-scroll-component';
import { MyContext } from "@/context/symbolecontext";

const StockList = () => {
   //@ts-ignore
   const { value, setValue, stockData } = useContext<any>(MyContext); 
   const [stocks, setStocks] = useState<any[]>([]);
   const [selectedStock, setSelectedStock] = useState<any>(value || null);
   const [showDrawer, setShowDrawer] = useState<boolean>(false);
   const [showNewsDrawer, setShowNewsDrawer] = useState<boolean>(false);
   const [action, setAction] = useState<"buy" | "sell" | null>(null);
   const [hoveredStock, setHoveredStock] = useState<string | null>(null);
   const [error, setError] = useState<string | null>(null);
   const [selectedTab, setSelectedTab] = useState<"chart" | "orders" | "holdings" | "position">("chart");
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(true);
 
   const fetchMoreStocks = async () => {
     try {
       const stockData = await GetSymbolForDrawer();
       setStocks((prevStocks) => [...prevStocks, ...stockData]);
       if (stockData.length === 0) {
         setHasMore(false);
       } else {
         setPage(page + 1);
       }
     } catch (error) {
       console.error("Failed to fetch stock data:", error);
     }
   };
 
   useEffect(() => {
     fetchMoreStocks();
   }, []);
 
   const handleStockClick = (instrumentKey: string, symbol: any) => {
    setSelectedStock(instrumentKey); 
    setValue(symbol); 
  };
  
 
   const handleBuyStock = () => {
     setAction("buy");
     setShowDrawer(true);
   };
 
   const handleSellStock = () => {
     setAction("sell");
     setShowDrawer(true);
   };
 
   const closeDrawer = () => {
     setShowDrawer(false);
   };
 
   const renderSelectedComponent = () => {
     switch (selectedTab) {
       case "chart":
         return <TradingViewChart />;
       case "orders":
         return <Orders selectedStock={selectedStock} />;
       case "holdings":
         return <Holdings selectedStock={selectedStock} />;
       case "position":
         return <Position selectedStock={selectedStock} />;
       default:
         return <TradingViewChart />;
     }
   };
 
   const selectedStockData = stockData[selectedStock] || {};
   const price = selectedStockData.last_price || "N/A";
   
  return (
    <div className="flex flex-col h-screen overflow-hidden" >
      <div className="flex flex-grow" >
        <div className="w-full md:w-1/4 border-r-2 bg-gray-50 shadow-lg px-1 sm:px-1 md:px-1 lg:px-4 py-1 sm:py-1 md:py-1 lg:py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xl font-bold">Watchlist</div>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <StockSearchBox />

          <InfiniteScroll
            dataLength={stocks.length}
            next={fetchMoreStocks}
            hasMore={hasMore}
            loader={<StockSkeleton />} 
            height={900}
            endMessage={<p className="text-center py-4">No more stocks to load</p>}
          >
            {stocks.length > 0 ? (
              stocks.map(({ symbol, instrumentKey, exchange }, index) => {
                const stockInfo = stockData[instrumentKey] || {};
                const price = stockInfo.last_price || "N/A";
                const openPrice = stockInfo.ohlc?.close || 0;
                const change = price !== "N/A" ? (price - openPrice).toFixed(2) : "0";
                const percentage =
                  openPrice !== 0
                    ? ((Number(change) / openPrice) * 100).toFixed(2)
                    : "0";

                return (
                  <div
                    key={symbol}
                    className={`stockcard px-0 md:px-1 lg:px-2 py-2 flex justify-between items-center border-b hover:bg-gray-100 cursor-pointer ${symbol === selectedStock ? "bg-gray-200" : ""
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
                        className={`text-sm ml-2 ${Number(change) >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                      >
                        {change} ({percentage}%)
                      </div>
                    </div>
                    {hoveredStock === symbol && (
                      <div className="mt-1 sm:mt-1 md:mt-1 lg:mt-2 flex sm:flex md:flex-wrap lg:flex gap-0 sm:gap-0 md:gap-1 lg:gap-2 md:justify-end w-[20%] md:w-[25%] lg:w-[30%]">
                        <button
                          className="bg-green-500 text-white px-2 py-1 md:py-0.5 lg:py-1 rounded-full text-xs"
                          onClick={handleBuyStock}
                        >
                          Buy
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 md:py-0.5 lg:py-1 rounded-full text-xs"
                          onClick={handleSellStock}
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
          </InfiniteScroll>
        </div>

        <div className="w-full md:w-3/4 h-full flex flex-col">
          <div className="bg-gray-100 border-2 border-gray-200 h-fit shadow-lg p-2 flex items-center justify-between">
            <ul className="flex gap-8 text-lg font-semibold">
              <li
                className="flex flex-col items-center cursor-pointer hover:scale-95"
                onClick={() => setSelectedTab("chart")}
              >
                <Image src="/chart.svg" priority width={20} height={20} alt="icon" />
                <span className="mt-1 text-gray-600 text-xs">Chart</span>
              </li>

              <li
                className="flex flex-col items-center cursor-pointer hover:scale-95"
                onClick={() => setSelectedTab("orders")}
              >
                <Image src="/cart.svg" priority width={20} height={20} alt="icon" />
                <span className="mt-1 text-gray-600 text-xs">Orders</span>
              </li>

              <li
                className="flex flex-col items-center cursor-pointer hover:scale-95"
                onClick={() => setSelectedTab("holdings")}
              >
                <Image src="/bag.svg" priority width={20} height={20} alt="icon" />
                <span className="mt-1 text-gray-600 text-xs">Holdings</span>
              </li>

              <li
                className="flex flex-col items-center cursor-pointer hover:scale-95"
                onClick={() => setSelectedTab("position")}
              >
                <Image src="/holdings.svg" priority width={20} height={20} alt="icon" />
                <span className="mt-1 text-gray-600 text-xs">Position</span>
              </li>
            </ul>

            {/* Fetch dynamic Nifty, Sensex, and Nifty Bank values */}
            <ul className="flex gap-10 text-xs">
              <li>
                <p className="text-sm">Nifty50</p>
                <span className={`text-green-600`}>{stockData['Nifty50']?.last_price || "19,600"} ↑</span>
              </li>
              <li>
                <p className="text-sm">Sensex</p>
                <span className={`text-red-600`}>{stockData['Sensex']?.last_price || "65,000"} ↓</span>
              </li>
              <li>
                <p className="text-sm">Nifty Bank</p>
                <span className={`text-green-600`}>{stockData['NiftyBank']?.last_price || "45,300"} ↑</span>
              </li>
            </ul>
          </div>

          <div className="flex-grow overflow-hidden">
            {renderSelectedComponent()}
          </div>
        </div>
      </div>

      {showDrawer && (
        <StockDrawer closeDrawer={closeDrawer} action={action} stock={selectedStockData} />
      )}

      <div className="relative">
        <div className="fixed min-h-12 bottom-0 left-0 w-[25%] px-2 border-2 border-gray-200 bg-white shadow-lg flex items-center justify-between">
          <h1 className="text-md text-center font-semibold pl-3">Latest Stock News</h1>
          <button
            className="text-black p-2 rounded-full hover:border-2 hover:rounded-lg hover:p-[0.40rem]"
            onClick={() => setShowNewsDrawer(true)}
          >
            <FaAngleUp size={20} />
          </button>
        </div>
        {showNewsDrawer && (
          <StockNewsDrawer isOpen={showNewsDrawer} closeDrawer={() => setShowNewsDrawer(false)} />
        )}
      </div>
    </div>
  );
};

export default StockList;
