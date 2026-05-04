import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <Link to="/products" className="shop-btn">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price.toFixed(2)} / {item.unit}</p>
              </div>
              <div className="cart-item-quantity">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button onClick={() => removeFromCart(item._id)} className="remove-btn">
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%):</span>
            <span>${(cartTotal * 0.1).toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>{cartTotal > 100 ? 'FREE' : '$10.00'}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${(cartTotal + (cartTotal * 0.1) + (cartTotal > 100 ? 0 : 10)).toFixed(2)}</span>
          </div>
          
          <button onClick={handleCheckout} className="checkout-btn">
            Proceed to Checkout
          </button>
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
