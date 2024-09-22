// pages/index.js
import StockList from "./StockList";
import { Barlow } from 'next/font/google';

const barlow = Barlow({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

const HomePage = () => {
  return (
    <div className="max-h-screen">
        <StockList />
    </div>
  );
};

export default HomePage;
