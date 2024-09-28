import React from 'react';

interface StockData {
  symbol: string;
  netQty: number;
  avgPrice: number;
  ltp: number; // Last Traded Price
  currentValue: number;
  dayPL: number; // Day Profit & Loss
}

const Holdings = ({ selectedStock }: any) => {
  const dummyHoldings: StockData[] = [
    {
      symbol: 'AAPL',
      netQty: 10,
      avgPrice: 150,
      ltp: 155,
      currentValue: 1550,
      dayPL: 50,
    },
    {
      symbol: 'MSFT',
      netQty: 5,
      avgPrice: 300,
      ltp: 305,
      currentValue: 1525,
      dayPL: 25,
    },
  ];

  const holdings = dummyHoldings;

  // Calculate totals
  const totalInvestment = holdings.reduce((total, stock) => total + (stock.avgPrice * stock.netQty), 0);
  const totalCurrentValue = holdings.reduce((total, stock) => total + stock.currentValue, 0);
  const overallPL = totalCurrentValue - totalInvestment;

  return (
    <div className="holdings-container  h-full bg-white shadow-md rounded-md">
      <div className="summary-box p-4 bg-gray-100 border border-gray-200 rounded-md mb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="summary-item p-3 bg-white border border-gray-300 rounded-md shadow-sm">
            <div className="text-sm text-gray-600">Total Investment</div>
            <div className="text-lg font-bold text-gray-800">
            ₹{totalInvestment.toFixed(2)}
            </div>
          </div>
          <div className="summary-item p-3 bg-white border border-gray-300 rounded-md shadow-sm">
            <div className="text-sm text-gray-600">Current Value</div>
            <div className="text-lg font-bold text-gray-800">
            ₹{totalCurrentValue.toFixed(2)}
            </div>
          </div>
          <div className="summary-item p-3 bg-white border border-gray-300 rounded-md shadow-sm">
            <div className="text-sm text-gray-600">Profit & Loss</div>
            <div className={`text-lg font-bold ${overallPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {overallPL >= 0 ? `+${overallPL.toFixed(2)}` : `${overallPL.toFixed(2)}`}
            </div>
          </div>
        </div>
      </div>

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

export default Holdings;
