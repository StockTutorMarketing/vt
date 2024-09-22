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
      interval: "2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ",
      container: chartContainerRef.current,
      datafeed: TradingViewDataFeed,
      library_path: "/static/charting_library/",
      fullscreen: false,
      autosize: true,
      symbol_search_request_delay: 1000,
      timezone: "exchange",
      debug: true,
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
      style={{display:"fixed",bottom:"40px", width: "100%", height: "80%" }}
    />
  );
};

export default TradingViewChart;
