"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";

export const MyContext = createContext(undefined);

export const MyProvider = ({ children }) => {
  const [value, setValue] = useState("ZOMATO");
  const [socket, setSocket] = useState(null);
  const [stockData, setStockData] = useState({});
  const [error, setError] = useState(null);
  const [newTokens, setNewTokens] = useState([]);

  useEffect(() => {
    const newSocket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET);
    setSocket(newSocket);

    newSocket.onopen = () => {
      subscribeToTokens(newSocket);
    };

    newSocket.onmessage = (event) => {
      if (event.data === "pong") {
        console.log("Received pong response from server");
        return;
      }

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
        console.warn("Received non-JSON message:", event.data);
      }
    };

    newSocket.onerror = (error) => {
      setError("Failed to connect to WebSocket. Please try again later.");
      toast.error("WebSocket connection failed!");
    };

    newSocket.onclose = (event) => {
      setError("WebSocket connection closed.");
      toast.warn("WebSocket connection closed!");
    };

    const pingInterval = setInterval(() => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.send(JSON.stringify({ type: "ping" }));
      }
    }, 2500);

    return () => {
      clearInterval(pingInterval);
      newSocket.close();
    };
  }, []);

  const subscribeToTokens = (socket) => {
    const tokensToSubscribe = [
      128083204, 128108804, 256265, 260105, 139321604, 82945, 1756929, 4343041,
      128211204, 139109380, 1304833, 5215745, 128046084, ...newTokens,
    ];
    socket.send(JSON.stringify({ type: "subscribe", tokens: tokensToSubscribe }));
  };

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      subscribeToTokens(socket);
    }
  }, [newTokens, socket]);

  const sendBuyOrder = (orderData) => {
    return new Promise((resolve, reject) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        const message = {
          type: "buyorder",
          data: orderData,
        };
  

        socket.send(JSON.stringify(message));
  
        const responseHandler = (event) => {
          let response;
          
          try {
            response = JSON.parse(event.data);
          } catch (error) {
            console.warn("Received non-JSON response:", event.data);
            return; 
          }
  
          if (response.type === 'order') {
            socket.removeEventListener('message', responseHandler);
            resolve(response);
          }
        };
  
        socket.addEventListener('message', responseHandler);
      } else {
        reject("WebSocket not connected. Cannot send buy order.");
      }
    });
  };

  const sendSellOrder = (orderData) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "sellorder", data: orderData }));
      toast.success("Sell order sent!");
    } else {
      toast.error("WebSocket not connected. Cannot send sell order.");
    }
  };

  return (
    <MyContext.Provider
      value={{ value, setValue, socket, stockData, error, setNewTokens, sendBuyOrder, sendSellOrder }}
    >
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
