import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import './Admin.css';

const AdminOrders = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getAllOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await orderAPI.updateOrderStatus(orderId, status);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await orderAPI.deliverOrder(orderId);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, isDelivered: true, status: 'Delivered' });
      }
    } catch (error) {
      alert('Failed to mark as delivered');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f39c12',
      'Processing': '#3498db',
      'Shipped': '#9b59b6',
      'Delivered': '#27ae60',
      'Cancelled': '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  if (!isAdmin) {
    return <div className="error">Access denied. Admin only.</div>;
  }

  return (
    <div className="admin-orders">
      <h1>Order Management</h1>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <div className="orders-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id.slice(-8)}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td>{order.orderItems?.length || 0} items</td>
                  <td>${order.totalPrice?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => setSelectedOrder(order)} className="btn-view">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedOrder && (
            <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Order Details</h2>
                <div className="order-details">
                  <div className="detail-row">
                    <strong>Order ID:</strong> {selectedOrder._id}
                  </div>
                  <div className="detail-row">
                    <strong>Customer:</strong> {selectedOrder.user?.name} ({selectedOrder.user?.email})
                  </div>
                  <div className="detail-row">
                    <strong>Status:</strong> {selectedOrder.status}
                  </div>
                  <div className="detail-row">
                    <strong>Payment:</strong> {selectedOrder.isPaid ? 'Paid' : 'Not Paid'} ({selectedOrder.paymentMethod})
                  </div>
                  
                  <h3>Shipping Address</h3>
                  <p>
                    {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city}, 
                    {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                  </p>

                  <h3>Order Items</h3>
                  <ul className="order-items-list">
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <li key={idx}>
                        {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>

                  <div className="order-totals">
                    <div className="total-row">
                      <span>Items:</span>
                      <span>${selectedOrder.itemsPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="total-row">
                      <span>Tax:</span>
                      <span>${selectedOrder.taxPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="total-row">
                      <span>Shipping:</span>
                      <span>${selectedOrder.shippingPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="total-row total">
                      <span>Total:</span>
                      <span>${selectedOrder.totalPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>

                  <h3>Update Status</h3>
                  <div className="status-actions">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    
                    {!selectedOrder.isDelivered && selectedOrder.status !== 'Cancelled' && (
                      <button onClick={() => handleMarkDelivered(selectedOrder._id)} className="btn-deliver">
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="btn-cancel">Close</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
