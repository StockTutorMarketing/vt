"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify"; 


export const MyContext = createContext(undefined);

export const MyProvider = ({ children }) => {
  const [value, setValue] = useState("ZOMATO");
  const [socket, setSocket] = useState(null);
  const [stockData, setStockData] = useState ({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET);
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      newSocket.send(
        '{   "type": "subscribe", "tokens": [128083204,128108804,139321604,82945,1756929,4343041,128211204,139109380,1304833,5215745]}'
      );
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.instrument_token !== undefined) {
          setStockData((prevData) => ({
            ...prevData,
            [data.instrument_token]: data,
          }));
        } else {
          console.warn("instrument_token not found in data:", data);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("Failed to connect to WebSocket. Please try again later.");
      toast.error("WebSocket connection failed!");
    };

    newSocket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
      setError("WebSocket connection closed.");
      toast.warn("WebSocket connection closed!");
    };

    const pingInterval = setInterval(() => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.send(JSON.stringify({ "type": "ping" })); 
      }
    }, 2500);
    

    return () => {
      clearInterval(pingInterval);
      newSocket.close();
    };
  }, []);

  return (
    <MyContext.Provider value={{ value, setValue, socket, stockData, error }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};
