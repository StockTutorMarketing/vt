import axios from "axios";

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
let isFirstCall = true;

export async function makeApiRequest(from, to, instrumentKey, resolution, countBack) {
    try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/historical-data`;

        let interval;
        switch (resolution) {
            case '1':
                interval = 'minute';
                break;
            case '3':
                interval = '3minute';
                break;
            case '5':
                interval = '5minute';
                break;
            case '10':
                interval = '10minute';
                break;
            case '15':
                interval = '15minute';
                break;
            case '30':
                interval = '30minute';
                break;
            case '60':
                interval = '60minute';
                break;
            case '1D':
                interval = 'day';
                break;
            case '1W':
                interval = 'week';
                break;
            case '1M':
                interval = 'month';
                break;
            default:
                throw new Error('Unsupported resolution');
        }

        if (isFirstCall) {
            to = Math.floor(Date.now() / 1000) - 1;
            isFirstCall = false;
            console.log(to ,"this to")
        }
console.log(to,from ,"this is my time")

        const response = await axios.post(url, {
            instrument_token: instrumentKey,
            from,
            to,
            interval: interval,
            count: countBack
        });

        const data = await response.data.candles;

        return data;
    } catch (error) {
        console.error(`API request error: ${error}`);
        throw new Error(`API request error: ${error.message}`);
    }
}


export function generateSymbol(exchange, fromSymbol, toSymbol) {
    const short = `${fromSymbol}/${toSymbol}`;
    return {
        short,
        full: `${exchange}:${short}`,
    };
}

export function parseFullSymbol(fullSymbol) {
    const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
    if (!match) {
        return null;
    }
    return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
}
