"use client";
import React, { useContext, useState } from "react";
import { FaAngleUp } from "react-icons/fa";
import TradingViewChart from "@/app/component/VirtualTrading.Chart";
import StockDrawer from "../StockDrawer";
import StockNewsDrawer from "../StockNewsDrawer";
import StocklistDrawer from "./StocklistDrawer";
import { MyContext } from "@/context/symbolecontext";
import Orders from "../../Orders";
import Holdings from "../../Holdings";
import Position from "../../Position";

const StockList = () => {
  const { value, setValue, stockData, selectedTab } = useContext<any>(MyContext);
  const [selectedStock, setSelectedStock] = useState<any>(value || null);
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [showNewsDrawer, setShowNewsDrawer] = useState<boolean>(false);
  const [action, setAction] = useState<"buy" | "sell" | null>(null);

  const handleStockClick = (instrumentKey: string, symbol: any) => {
    setSelectedStock(instrumentKey);
    setValue(symbol);
  };



  const closeDrawer = () => {
    setShowDrawer(false);
  };

  const renderSelectedComponent = () => {
    switch (selectedTab) {
      case "chart":
        return <TradingViewChart />;
      case "orders":
        return <Orders />;
      case "holdings":
        return <Holdings />;
      case "position":
        return <Position />;
      default:
        return <TradingViewChart />;
    }
  };
  return (
    <div className="flex flex-col h-[92vh] overflow-hidden">
      <div className="flex flex-grow">
        <div className="flex-grow overflow-hidden">
          {renderSelectedComponent()}
        </div>
      </div>

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
      </div>

      {/* News Drawer */}
      {showNewsDrawer && (
  <StockNewsDrawer isOpen={showNewsDrawer} closeDrawer={() => setShowNewsDrawer(false)} />
)}

    </div>
  );
};

export default StockList;
