import axios from "axios";

// Convert UNIX timestamp to Zerodha format (YYYY-MM-DD HH:mm:ss)
function convertUnixTimestampToZerodhaFormat(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Make API request to fetch historical data
export async function makeApiRequest(from, to, instrumentKey, resolution, countBack) {
    try {
        console.log(`Requesting with countBack: ${countBack}`);

        // Convert 'from' and 'to' UNIX timestamps to Zerodha format
        const fromFormatted = convertUnixTimestampToZerodhaFormat(from);
        const toFormatted = convertUnixTimestampToZerodhaFormat(to);

        // Send countBack to ensure we get enough bars
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/historical-data`;

        // Make the API request
        const response = await axios.post(url, {
            instrument_token: instrumentKey,
            from: fromFormatted,
            to: toFormatted,
            interval: "minute", // Use resolution for granularity ('minute', 'day', etc.)
            countBack: countBack   // Request the necessary number of bars
        });

        const data = response.data.candles;

        // If data is returned, return it; otherwise, return an empty array
        if (data && Array.isArray(data)) {
            return data;
        } else {
            return [];
        }
    } catch (error) {
        console.error(`API request error: ${error}`);
        throw new Error(`API request error: ${error.message}`);
    }
}


// Generates a symbol ID from a pair of symbols
export function generateSymbol(exchange, fromSymbol, toSymbol) {
    const short = `${fromSymbol}/${toSymbol}`;
    return {
        short,
        full: `${exchange}:${short}`,
    };
}

// Returns all parts of the symbol
export function parseFullSymbol(fullSymbol) {
    const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
    if (!match) {
        return null;
    }
    return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
}
