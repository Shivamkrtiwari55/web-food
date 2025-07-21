import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/api/order/user-orders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        console.error("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Set up periodic refresh
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="my-orders">
        <h2>My Orders</h2>
        <div className="container">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className='container'>
        {data.length === 0 ? (
          <p>No orders found. Start shopping to place your first order!</p>
        ) : (
          data.map((order) => (
            <div key={order._id} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="" />
              <div className="order-details">
                <p className="order-items">
                  {order.items.map((item, i) => (
                    <span key={i}>
                      {item.name} x {item.quantity}
                      {i < order.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
                <p className="order-amount">₹{order.amount.toFixed(2)}</p>
                <p className="order-date">
                  {new Date(order.date).toLocaleDateString()}
                </p>
                <p className="order-status">
                  <span className={`status-dot ${order.status.toLowerCase()}`}>
                    &#x25cf;
                  </span>
                  <b>{order.status}</b>
                </p>
              </div>
              <button 
                className={`track-button ${order.status.toLowerCase()}`}
                disabled={order.status === "Delivered"}
              >
                {order.status === "Delivered" ? "Delivered" : "Track Order"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;