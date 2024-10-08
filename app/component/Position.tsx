import React from 'react';

interface StockData {
  symbol: string;
  netQty: number;
  avgPrice: number;
  ltp: number; // Last Traded Price
  currentValue: number;
  dayPL: number; // Day Profit & Loss
}

const Position = ({ selectedStock }: any) => {
  const dummyHoldings: StockData[] = [

  ];

  const holdings = dummyHoldings; // You can replace this with your actual data fetching logic

  return (
    <div className="holdings-container  h-full bg-white shadow-md rounded-md">
      <div className="">
        <div className="header-stats flex justify-between items-center p-2 border-t-2 bg-gray-100 mb-2">
          <div className="stat">
            <span className="text-sm text-black">Symbol</span>
          </div>
          <div className="stat">
            <span className="text-sm text-black">Net Qty</span>
          </div>
          <div className="stat">
            <span className="text-sm text-black">Avg. Price</span>
          </div>
          <div className="stat">
            <span className="text-sm text-black">LTP</span>
          </div>
          <div className="stat">
            <span className="text-sm text-black">Current Value</span>
          </div>
          <div className="stat">
            <span className="text-sm text-black">Day P&L</span>
          </div>
        </div>
      </div>

      {/* If holdings data is found, display it, otherwise show the empty state */}
      {holdings.length > 0 ? (
        <div className="holdings-data">
          {holdings.map((stock, index) => (
            <div key={index} className="row flex justify-between items-center p-2 border-b-2">
              <div className="stat">
                <span className="text-sm text-black">{stock.symbol}</span>
              </div>
              <div className="stat">
                <span className="text-sm text-black">{stock.netQty}</span>
              </div>
              <div className="stat">
                <span className="text-sm text-black">{stock.avgPrice}</span>
              </div>
              <div className="stat">
                <span className="text-sm text-black">{stock.ltp}</span>
              </div>
              <div className="stat">
                <span className="text-sm text-black">{stock.currentValue}</span>
              </div>
              <div className="stat">
                <span className="text-sm text-black">{stock.dayPL}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state flex flex-col justify-center items-center text-center mt-[16%]">
          <div className="box-icon bg-purple-100 rounded-full p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-12 h-12 text-purple-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.375 7.5l8.25 4.95 8.25-4.95M3.375 7.5l8.25 4.95 8.25-4.95M3.375 16.5V9.75l8.25 4.95v6.75l8.25-4.95V9.75"
              />
            </svg>
          </div>
          <h3 className="text-black text-lg font-medium mt-6">It's empty in here.</h3>
          <p className="text-xs text-gray-400 mt-2">
            Keep an eye on Equity purchases you make that carry over to the next day.
          </p>
        </div>
      )}
    </div>
  );
};

export default Position;
