import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: 'USA'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          _id: item._id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod
      };

      await orderAPI.createOrder(orderData);
      clearCart();
      navigate('/my-orders', { state: { message: 'Order placed successfully!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const itemsPrice = cartTotal;
  const taxPrice = itemsPrice * 0.1;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="checkout-section">
          <h2>Shipping Address</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                value={shippingAddress.zipCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <div className="checkout-section">
          <h2>Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="payment-select"
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Card">Card</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <div className="checkout-section">
          <h2>Order Summary</h2>
          <div className="order-summary">
            {cartItems.map(item => (
              <div key={item._id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Tax:</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Shipping:</span>
              <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button type="submit" className="place-order-btn" disabled={loading}>
          {loading ? 'Placing Order...' : `Place Order - $${totalPrice.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
