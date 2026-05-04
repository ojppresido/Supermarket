import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderAPI, productAPI } from '../utils/api';
import './Admin.css';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        orderAPI.getAllOrders(),
        productAPI.getProducts({})
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || { products: [], total: 0 };

      const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
      const revenue = orders.filter(o => o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0);

      setStats({
        totalOrders: orders.length,
        pendingOrders,
        totalProducts: products.total || products.products?.length || 0,
        totalUsers: 0, // Would need a separate endpoint
        revenue
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return <div className="error">Access denied. Admin only.</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}!</p>

      {loading ? (
        <div className="loading">Loading stats...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Orders</h3>
            <p className="stat-value warning">{stats.pendingOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
          <div className="stat-card">
            <h3>Revenue</h3>
            <p className="stat-value success">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="quick-links">
        <h2>Quick Actions</h2>
        <div className="links-grid">
          <a href="/admin/products" className="quick-link">Manage Products</a>
          <a href="/admin/orders" className="quick-link">Manage Orders</a>
          <a href="/admin/users" className="quick-link">Manage Users</a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
