import axios from "axios";

export const getAllSymbols = async (symbol, exchange) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/virtual-trading`;
    if (symbol) {
      url += `?symbol=${encodeURIComponent(symbol)}`;
    }
    if (exchange) {
      url += symbol ? `&exchange=${encodeURIComponent(exchange)}` : `?exchange=${encodeURIComponent(exchange)}`;
    }

    const response = await axios.get(url);

    if(!response.data){
      return "Something went wrong "
    }


    return response.data;
  } catch (error) {
    throw error;
  }
};




//now this will for Drawer stock data
export const GetSymbolForDrawer = async () => {
  return [
    {
      "symbol": "RELIANCE",
      "ticker": "RELIANCE",
      "description": "RELIANCE INDUSTRIES",
      "exchange": "BSE",
      "type": "stock",
      "instrumentKey": "128083204"
    },
    {
      "symbol": "AMBUJACEM",
      "ticker": "AMBUJACEM",
      "description": "AMBUJA CEMENTS",
      "exchange": "BSE",
      "type": "stock",
      "instrumentKey": "128108804"
    },
    {
      "symbol": "OLAELEC",
      "ticker": "OLAELEC",
      "description": "OLA ELECTRIC MOBILITY ",
      "exchange": "BSE",
      "type": "stock",
      "instrumentKey": "139321604"
    },

    {
      "symbol": "ANGELONE",
      "ticker": "ANGELONE",
      "description": "ANGEL ONE",
      "exchange": "NSE",
      "type": "stock",
      "instrumentKey": "82945"
    },
    {
      "symbol": "BAJAJHCARE",
      "ticker": "BAJAJHCARE",
      "description": "BAJAJ HEALTHCARE",
      "exchange": "NSE",
      "type": "stock",
      "instrumentKey": "1756929"
    },
    {
      "symbol": "HDFCBANK",
      "ticker": "HDFCBANK",
      "description": "HDFC BANK",
      "exchange": "BSE",
      "type": "stock",
      "instrumentKey": "128046084"
  },
    {
      "symbol": "BRITANNIA",
      "ticker": "BRITANNIA",
      "description": "BRITANNIA INDUSTRIES",
      "exchange": "BSE",
      "type": "stock",
      "instrumentKey": "128211204"
    },
    {
      "symbol": "PAYTM",
      "ticker": "PAYTM",
      "description": "ONE 97 COMMUNICATIONS ",
      "exchange": "BSE",
      "type": "stock",
      "instrumentKey": "139109380"
    },
    {
      "symbol": "ZOMATO",
      "ticker": "ZOMATO",
      "description": "ZOMATO",
      "exchange": "NSE",
      "type": "stock",
      "instrumentKey": "1304833"
    }, {
      "symbol": "COALINDIA",
      "ticker": "COALINDIA",
      "description": "COAL INDIA",
      "exchange": "NSE",
      "type": "stock",
      "instrumentKey": "5215745"
    },
    {
      "symbol": "BAJAJFINSV",
      "ticker": "BAJAJFINSV",
      "description": "BAJAJ FINSERV",
      "exchange": "NSE",
      "type": "stock",
      "instrumentKey": "4268801"
    },
    {
      "symbol": "RENUKA",
      "ticker": "RENUKA",
      "description": "SHREE RENUKA SUGARS",
      "exchange": "BSE",
      "type": "stock",
      "instrumentKey": "136363524"
    },
  ]
}