import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin, isManager } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🛒 Mini Supermarket
        </Link>
        
        <div className="navbar-menu">
          <Link to="/products" className="navbar-link">Products</Link>
          
          {user ? (
            <>
              <Link to="/cart" className="navbar-link">
                Cart ({cartCount})
              </Link>
              <Link to="/profile" className="navbar-link">Profile</Link>
              <Link to="/my-orders" className="navbar-link">My Orders</Link>
              
              {isAdmin && (
                <>
                  <Link to="/admin/users" className="navbar-link admin">Admin</Link>
                  <Link to="/admin/products" className="navbar-link admin">Products</Link>
                  <Link to="/admin/orders" className="navbar-link admin">Orders</Link>
                </>
              )}
              
              {isManager && !isAdmin && (
                <Link to="/admin/products" className="navbar-link manager">Manage Products</Link>
              )}
              
              <button onClick={logout} className="navbar-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-btn register-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
