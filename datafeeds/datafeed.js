import { makeApiRequest } from './helper.js';
import { getAllSymbols } from './stocks.js';

// WebSocket connection
const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET);
let subscribers = {};
let liveData = {};

// Configuration for the datafeed
const configurationData = {
    supported_resolutions: ['2', '3', '5', '10', '15', '30', '60', '120', '1D', '1W', '1M'],
    exchanges: [
        { value: 'NSE', name: 'NSE', desc: 'National Stock Exchange of India' },
        { value: 'BSE', name: 'BSE', desc: 'Bombay Stock Exchange' }
    ],
    symbols_types: [
        { name: 'stock', value: 'stock' }
    ]
};

ws.onopen = () => {
    console.log('Connected to the WebSocket server');
};

// Handle WebSocket messages
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received WebSocket message:', data);

    if (data.type === 'live_feed') {
        processLiveFeed(data);
    }
};

// Process and store live data
function processLiveFeed(feeds) {
    Object.keys(subscribers).forEach(subscriberUID => {
        const { onRealtimeCallback, symbolInfo } = subscribers[subscriberUID];
        const symbolKey = symbolInfo.instrumentKey;

        if (feeds[symbolKey]) {
            const livePriceData = feeds[symbolKey].ff.marketFF.ltpc;

            if (livePriceData && livePriceData.ltp && livePriceData.ltt) {
                const timestamp = parseInt(livePriceData.ltt);
                const price = livePriceData.ltp;

                if (!isNaN(timestamp)) {
                    if (!liveData[symbolKey]) {
                        liveData[symbolKey] = [];
                    }
                    liveData[symbolKey].push({
                        time: timestamp,
                        close: price,
                    });

                    onRealtimeCallback({
                        time: timestamp,
                        close: price,
                    });
                } else {
                    console.error('Invalid timestamp:', livePriceData.ltt);
                }
            }
        }
    });
}

// Process historical OHLC data
function processBars(feed) {
    const ohlc = feed.ff.marketFF.marketOHLC.ohlc;

    if (!ohlc || !Array.isArray(ohlc)) {
        return {
            s: 'error',
            t: [],
            o: [],
            h: [],
            l: [],
            c: [],
            v: []
        };
    }

    const times = [];
    const opens = [];
    const highs = [];
    const lows = [];
    const closes = [];
    const volumes = [];

    ohlc.forEach(bar => {
        const barTime = validateTimestamp(parseInt(bar.ts));
        if (barTime === null) return;

        times.push(barTime);
        opens.push(bar.open);
        highs.push(bar.high);
        lows.push(bar.low);
        closes.push(bar.close);
        volumes.push(bar.volume);
    });

    return {
        s: 'ok',
        t: times,
        o: opens,
        h: highs,
        l: lows,
        c: closes,
        v: volumes
    };
}

// Validate timestamp
function validateTimestamp(timestamp) {
    return isNaN(timestamp) ? null : timestamp;
}

// Convert to GMT midnight
function convertToGMTMidnight(candleTime, resolution) {
    const date = new Date(candleTime);
    if (resolution.endsWith('D') || resolution.endsWith('W') || resolution.endsWith('M')) {
        date.setUTCHours(0, 0, 0, 0);
    }
    return date.getTime();
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
        console.log(symbolName, "this is my symbol name")
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
            const data = await makeApiRequest( from, to, instrumentKey, resolution ,countBack);

            const candles = data;
            let bars = [];
            const startTime = from * 1000;
            const endTime = to * 1000;

            candles.forEach(candle => {
                const candleTime = new Date(candle[0]).getTime();
                if (candleTime >= startTime && candleTime <= endTime) {
                    const barTime = convertToGMTMidnight(candle[0], resolution);
                    bars.push({
                        time: barTime,
                        low: candle[3],
                        high: candle[2],
                        open: candle[1],
                        close: candle[4],
                        volume: candle[5],
                    });
                }
            });
            onHistoryCallback(bars, { noData: bars.length === 0 });
        } catch (error) {
            console.error('[getBars]: Error occurred', error);
            onErrorCallback(error);
        }
    },

    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        subscribers[subscriberUID] = { onRealtimeCallback, symbolInfo };

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'subscribe', symbol: symbolInfo.ticker }));
        }
    },

    unsubscribeBars: (subscriberUID) => {
        const symbolInfo = subscribers[subscriberUID].symbolInfo;
        delete subscribers[subscriberUID];

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'unsubscribe', symbol: symbolInfo.ticker }));
        }
    }
};