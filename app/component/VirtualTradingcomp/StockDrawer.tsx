import { MyContext } from "@/context/symbolecontext";
import React, { useEffect, useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface StockDrawerProps {
  action: "buy" | "sell" | null;
  stock: any | null;
  closeDrawer: () => void;
}

const StockDrawer: React.FC<StockDrawerProps> = ({
  action: initialAction,
  stock,
  closeDrawer,
}) => {
  const { value,sendBuyOrder, setValue, stockData, socket } = useContext<any>(MyContext);
  const [isVisible, setIsVisible] = useState(false);
  const [isIntraday, setIsIntraday] = useState(true);
  const [quantity, setQuantity] = useState<number | any>(0);
  const [price, setPrice] = useState<number | string>("");
  const [isMarketOrder, setIsMarketOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<"buy" | "sell" | any>(initialAction);
  const [marketPrice, setMarketPrice] = useState<number | any>(
    stock?.last_price
  );
  const [requireBalance, setRequireBalance] = useState<any>();

  useEffect(() => {
    setIsVisible(true);
    setRequireBalance(marketPrice * quantity);
  }, [quantity, marketPrice]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseInt(value) < 1 || isNaN(parseInt(value))) {
      setError("Invalid quantity.");
    } else {
      setError(null);
    }
    setQuantity(value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(parseFloat(value))) {
      setError("Invalid price.");
    } else {
      setError(null);
    }
    setPrice(value);
  };

  const handleOrderTypeChange = (type: "market" | "limit") => {
    setIsMarketOrder(type === "market");
    setPrice("");
  };

  const toggleAction = () => {
    setAction((prevAction: any) => (prevAction === "buy" ? "sell" : "buy"));
  };
  const handleTransaction = async () => {
    // Validation
    if (!quantity || (!isMarketOrder && !price)) {
      setError("Please fill in all required fields.");
      toast.error("Please provide valid quantity and price!");
      return;
    }
  
    // Ensure the stock is tradable
    if (!stock?.tradable) {
      toast.error("This stock is not tradable at the moment.");
      return;
    }
  
    const orderData = {
      userId: '66557e723a8280a59275d1d9',
      instrument_token: stock?.instrument_token,
      marketPrice: marketPrice,
      bought_qty: parseInt(quantity),
      symbol: value,
    };
  
    sendBuyOrder(orderData)
      .then((response:any) => {
        if (response.status === "success") {
          toast.success(response.message);
        } else {
          toast.error(`Order Error: ${response.message}`);
        }
        closeDrawer();
      })
      .catch((error:any) => {
        toast.error(error);
      });
  };
  

  const isButtonDisabled = quantity <= 0 || (!isMarketOrder && !price);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg">
        {/* Header */}
        <div
          className={`flex p-4 rounded-t-lg justify-between items-center ${action === "buy" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          <h2 className="text-xl font-semibold text-white">
            {action === "buy" ? "BUY" : "SELL"} {value || "N/A"}
          </h2>
          <div className="flex gap-4 items-center">
            <span className="text-white">Buy</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={toggleAction}
                checked={action === "buy"}
              />
              <div className="w-11 h-6 rounded-full bg-white transition-colors duration-300">
                <div
                  className={`absolute top-[2px] left-[2px] bg-${action === "buy" ? "green" : "red"
                    }-500 h-5 w-5 rounded-full transition-transform duration-300 ${action === "buy" ? "" : "translate-x-full"
                    }`}
                ></div>
              </div>
            </label>
            <span className="text-white">Sell</span>
          </div>
        </div>

        <div className="p-4">
          {/* Order Type (Intraday/Longterm) */}
          <div className="flex justify-between gap-4 pt-4">
            <label className="text-gray-600">
              <input
                type="radio"
                name="term"
                className="mr-2"
                checked={!isIntraday}
                onChange={() => setIsIntraday(false)}
              />
              Longterm
            </label>
            <label className="text-gray-600">
              <input
                type="radio"
                name="term"
                className="mr-2"
                checked={isIntraday}
                onChange={() => setIsIntraday(true)}
              />
              Intraday
            </label>
          </div>

          {/* Quantity and Price Input */}
          <div className="flex gap-4 mt-4">
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm">Quantity</label>
              <input
                type="text"
                className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="Enter Quantity"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 text-sm">Limit Price</label>
              <input
                type="text"
                className={`w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 ${isMarketOrder
                  ? "bg-gray-100 text-gray-400"
                  : "focus:ring-green-500"
                  }`}
                value={price}
                onChange={handlePriceChange}
                placeholder="Enter Limit Price"
                disabled={isMarketOrder}
              />
            </div>
          </div>

          {/* Order Type (Market/Limit) */}
          <div className="flex justify-between gap-4 pt-4">
            <label className="text-gray-600">
              <input
                type="radio"
                name="orderType"
                className="mr-2"
                checked={isMarketOrder}
                onChange={() => handleOrderTypeChange("market")}
              />
              Market
            </label>
            <label className="text-gray-600">
              <input
                type="radio"
                name="orderType"
                className="mr-2"
                checked={!isMarketOrder}
                onChange={() => handleOrderTypeChange("limit")}
              />
              Limit
            </label>
          </div>

          {/* Market Price and Required Price */}
          <div className="mt-4 flex justify-between text-sm">
            <div className="text-left text-gray-700">
              Market Price:{" "}
              <span className="font-bold text-green-600">₹ {marketPrice}</span>
              {action === "buy" && (
                <div>
                  Req Price:{" "}
                  <span className="font-bold text-green-600">
                    ₹ {requireBalance}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-between">
            <button
              className={`px-4 py-2 rounded text-white transition-colors ${action === "buy"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-500 hover:bg-red-600"
                } ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleTransaction}
              disabled={isButtonDisabled}
            >
              {action === "buy" ? "BUY" : "SELL"} NOW
            </button>
            <button
              className="px-4 py-2 rounded border-gray-200 border-2 hover:bg-gray-200 text-black"
              onClick={closeDrawer}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDrawer;
