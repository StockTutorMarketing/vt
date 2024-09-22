import { getMarketAuxLatestNews } from "@/service/newsService";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

const StockNewsDrawer = ({ isOpen, closeDrawer }: { isOpen: boolean, closeDrawer: () => void }) => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMarketAuxLatestNews();
        setNews(response.data.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 bg-white shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? "translate-y-0" : "translate-y-full"} w-full md:w-[24%] ml-5 h-[50%] md:h-[60%] overflow-hidden z-50`}
    >
      <div className="p-4 border-b border-gray-200 bg-gray-100 flex justify-between items-center h-16">
        <h3 className="text-xl font-semibold text-gray-800">Latest Stock News</h3>
        <button
          className="text-red-500 hover:border-2 hover:rounded-lg hover:border-white"
          onClick={closeDrawer}
        >
          <IoMdClose size={24} />
        </button>
      </div>
      <div className="p-4 h-full overflow-auto">
        {news.length > 0 ? (
          <ul className="space-y-4">
            {news.map((item) => (
              <li key={item.uuid} className="flex flex-col border-b border-gray-200 pb-4">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />
                )}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {item.title}
                </a>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(item.published_at).toLocaleDateString("en-IN")}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No news available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default StockNewsDrawer;
