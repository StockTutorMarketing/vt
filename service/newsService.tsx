import axios from "axios";

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
let yesterdayISOString = yesterday.toISOString().slice(0, 16);

const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() -7);
const weekAgoISOString = weekAgo.toISOString().slice(0, 16);

export const getMarketAuxLatestNews = async () => {
    return await axios.get(encodeURI(`https://api.marketaux.com/v1/news/all?countries=in&filter_entities=true&limit=3&published_after=${yesterdayISOString}&api_token=o8IasSs32WOOPKJ7XzSxNawbmoPR7rCWyEvt07Ro`));
}                

export const getMarketAuxTopNews = async () => {
    return await axios.get(encodeURI(``));
}


