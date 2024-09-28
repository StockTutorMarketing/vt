"use client";
import React, { useContext, useEffect, useRef } from 'react';
import TradingViewDataFeed from '../../datafeeds/datafeed';
import { MyContext } from '@/context/symbolecontext';

const TradingViewChart = () => {
  const { value: symbol } = useContext<any>(MyContext);

  const chartContainerRef = useRef(null);
  const tvWidgetRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const widgetOptions = {
      symbol: symbol || 'ZOMATO',
      interval: "1",
      container: chartContainerRef.current,
      datafeed: TradingViewDataFeed,
      library_path: "/static/charting_library/",
      fullscreen: false,
      autosize: true,
      symbol_search_request_delay: 1000,
      buy_sell_buttons:true,
      timezone: "exchange",
      debug: true,
      session_holidays:["1726906623,1726993023,1727049600,1704153600,1730419200,1706822400,1709836800,1712793600,1731609600,1713312000,1718582400,1721385600,1716163200,1705900800,1711324800,1735084800,1706227200,1711670400"]
    };

    const script = document.createElement("script");
    script.src = "/static/charting_library/charting_library.js";
    script.onload = () => {
      // @ts-ignore
      tvWidgetRef.current = new TradingView.widget(widgetOptions);
    };

    
    document.body.appendChild(script);

    return () => {
      if (tvWidgetRef.current) {
        // @ts-ignore
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
      }
      document.body.removeChild(script);
    };
  }, [symbol]);

  return (
    <div
      ref={chartContainerRef}
      style={{display:"fixed",width: "100%", height: "100%" }}
    />
  );
};

export default TradingViewChart;
