import { makeApiRequest } from './helper.js';
import { getAllSymbols } from './stocks.js';

const ws = new WebSocket('ws://localhost:8000/virtual');
let subscribers = {};
let liveData = {};

const pingIntervalDuration = 2000;
let pingInterval;

function sendPing() {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
        console.log("Sent ping to server");
    } else {
        console.log("WebSocket is not open, cannot send ping");
    }
}

ws.onopen = () => {
    console.log("WebSocket connection established");
    pingInterval = setInterval(sendPing, pingIntervalDuration);
};

ws.onclose = () => {
    clearInterval(pingInterval);
    console.log("WebSocket connection closed");
};

ws.onmessage = (event) => {
    if (event.data === "pong") {
        console.log("Received pong response from server");
        return;
    }

    try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);
        processLiveFeed(data);
    } catch (error) {
        console.error('Error parsing message:', event.data, error);
    }
};

const configurationData = {
    supported_resolutions: ['1', '3', '5', '10', '15', '30', '60', '1D'],
    exchanges: [
        { value: 'NSE', name: 'NSE', desc: 'National Stock Exchange of India' },
        { value: 'BSE', name: 'BSE', desc: 'Bombay Stock Exchange' }
    ],
    symbols_types: [
        { name: 'stock', value: 'stock' }
    ]
};
function processLiveFeed(feeds) {
    const timestamp = new Date(feeds.exchange_timestamp).getTime();
    const price = feeds.last_price;

    Object.keys(subscribers).forEach(subscriberUID => {
        const { onRealtimeCallback, symbolInfo } = subscribers[subscriberUID];
        const symbolKey = symbolInfo.instrumentKey;

        const lastBar = liveData[symbolKey]?.[liveData[symbolKey].length - 1];
        const newBarTime = Math.floor(timestamp / 1000) * 1000; 

        if (lastBar && lastBar.time === newBarTime) {
            lastBar.close = price;
            lastBar.high = Math.max(lastBar.high, price);
            lastBar.low = Math.min(lastBar.low, price);
            lastBar.volume += feeds.volume_traded || 0;
        } else {
            const newBar = {
                time: newBarTime,
                open: price,
                close: price,
                high: price,
                low: price,
                volume: feeds.volume_traded || 0
            };
            if (!liveData[symbolKey]) {
                liveData[symbolKey] = [];
            }
            liveData[symbolKey].push(newBar);
        }

        // Trigger the realtime update for the chart
        onRealtimeCallback({
            time: newBarTime,
            close: price,
            open: lastBar ? lastBar.open : price,
            high: lastBar ? Math.max(lastBar.high, price) : price,
            low: lastBar ? Math.min(lastBar.low, price) : price,
            volume: feeds.volume_traded || 0
        });
    });
}




export default {
    onReady: (callback) => {
        setTimeout(() => callback(configurationData));
    },

    searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
        const symbols = await getAllSymbols(userInput, exchange);
        const filteredSymbols = symbols.filter(symbol => {
            const isExchangeValid = exchange === '' || symbol.exchange === exchange;
            const isSymbolContainsInput = symbol.ticker.toLowerCase().includes(userInput.toLowerCase());
            return isExchangeValid && isSymbolContainsInput;
        });
        onResultReadyCallback(filteredSymbols);
    },

    resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        const symbols = await getAllSymbols(symbolName);
        const symbolItem = symbols.find(({ ticker }) => ticker === symbolName);
        if (!symbolItem) {
            onResolveErrorCallback('Cannot resolve symbol');
            return;
        }

        const symbolInfo = {
            ticker: symbolItem.ticker,
            instrumentKey: symbolItem.instrumentKey,
            name: symbolItem.symbol,
            description: symbolItem.description,
            type: symbolItem.type,
            session: '0915-1530',
            timezone: 'Asia/Kolkata',
            exchange: symbolItem.exchange,
            minmov: 1,
            pricescale: 100,
            has_intraday: true,
            visible_plots_set: 'ohlc',
            has_weekly_and_monthly: true,
            supported_resolutions: configurationData.supported_resolutions,
            volume_precision: 2,
            data_status: 'streaming',
        };

        onSymbolResolvedCallback(symbolInfo);
    },

    getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) => {
        const { from, to, countBack } = periodParams;

        try {
            const instrumentKey = symbolInfo.instrumentKey;
            const data = await makeApiRequest(from, to, instrumentKey, resolution, countBack);

            const candles = data;
            let bars = [];
            candles.forEach(candle => {
                bars.push({
                    time: candle[0],
                    low: candle[3],
                    high: candle[2],
                    open: candle[1],
                    close: candle[4],
                    volume: candle[5],
                });
            });
            onHistoryCallback(bars, { noData: bars.length === 0 });
        } catch (error) {
            console.error('[getBars]: Error occurred', error);
            onErrorCallback(error);
        }
    },

    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        subscribers[subscriberUID] = { onRealtimeCallback, symbolInfo };
        const tokens = symbolInfo.instrumentKey;
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(`{ "type": "subscribe", "tokens": [${tokens}] }`);
        } else {
            ws.onopen = () => {
                ws.send(JSON.stringify({ type: 'subscribe', tokens: [tokens] }));
            };
        }
    },

    unsubscribeBars: (subscriberUID) => {
        const symbolInfo = subscribers[subscriberUID].symbolInfo;
        delete subscribers[subscriberUID];

        if (ws.readyState === WebSocket.OPEN) {
            // ws.send(JSON.stringify({ type: 'unsubscribe', symbol: symbolInfo.ticker }));
        }
    }
};
