import { useState, useEffect } from 'react';
import { orderAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: '#f39c12',
      Processing: '#3498db',
      Shipped: '#9b59b6',
      Delivered: '#27ae60',
      Cancelled: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  return (
    <div className="my-orders-page">
      <h1>My Orders</h1>
      
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{order._id.slice(-8)}</span>
                <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                <span 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>
              
              <div className="order-items">
                {order.orderItems.map(item => (
                  <div key={item.product} className="order-item">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="order-item-info">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                    <span className="order-item-total">${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: ${order.totalPrice.toFixed(2)}</strong>
                </div>
                <div className="order-payment">
                  Payment: {order.paymentMethod} - {order.isPaid ? 'Paid' : 'Pending'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
