import React from 'react';

interface OrderData {
  orderId: string;
  type: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  price: number;
  status: 'pending' | 'completed' | 'cancelled';
}

const dummyOrders: OrderData[] = [
  {
    orderId: '12345',
    type: 'buy',
    symbol: 'ANGELONE',
    quantity: 10,
    price: 2532.3,
    status: 'completed',
  },
  {
    orderId: '12346',
    type: 'buy',
    symbol: 'PAYTM',
    quantity: 5,
    price: 672.4,
    status: 'pending',
  },
  {
    orderId: '12347',
    type: 'buy',
    symbol: 'ZOMATO',
    quantity: 8,
    price: 278.15,
    status: 'cancelled',
  },
];

const Orders = ({ selectedStock }: any) => {
  return (
    <div className="orders-container  h-full bg-white shadow-md rounded-md">
      <div className="header-stats flex justify-between items-center p-2 border-t-2 bg-gray-100 mb-2">
        <div className="stat">
          <span className="text-sm text-black">Order ID</span>
        </div>
        <div className="stat">
          <span className="text-sm text-black">Type</span>
        </div>
        <div className="stat">
          <span className="text-sm text-black">Symbol</span>
        </div>
        <div className="stat">
          <span className="text-sm text-black">Quantity</span>
        </div>
        <div className="stat">
          <span className="text-sm text-black">Price</span>
        </div>
        <div className="stat">
          <span className="text-sm text-black">Status</span>
        </div>
      </div>

      <div className="orders-data">
        {dummyOrders.length > 0 ? (
          dummyOrders.map((order) => (
            <div key={order.orderId} className="row flex justify-between items-center p-2 border-b-2">
              <div className="stat">
                <span className="text-sm text-black">{order.orderId}</span>
              </div>
              <div className="stat">
                <span className={`text-sm ${order.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                  {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
                </span>
              </div>
              <div className="stat">
                <span className="text-sm text-black">{order.symbol}</span>
              </div>
              <div className="stat">
                <span className="text-sm text-black">{order.quantity}</span>
              </div>
              <div className="stat">
                <span className="text-sm text-black"> ₹ {order.price*order.quantity}</span>
              </div>
              <div className="stat">
                <span className={`text-sm ${order.status === 'completed' ? 'text-green-600' : order.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state flex flex-col justify-center items-center text-center mt-16">
            <div className="box-icon bg-purple-100 rounded-full p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-12 h-12 text-purple-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.375 7.5l8.25 4.95 8.25-4.95M3.375 7.5l8.25 4.95 8.25-4.95M3.375 16.5V9.75l8.25 4.95v6.75l8.25-4.95V9.75"
                />
              </svg>
            </div>
            <h3 className="text-black text-lg font-medium mt-6">No Orders Found</h3>
            <p className="text-xs text-gray-400 mt-2">
              You don’t have any orders yet. Place some orders to see them listed here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
