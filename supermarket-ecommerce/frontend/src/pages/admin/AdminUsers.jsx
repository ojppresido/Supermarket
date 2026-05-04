import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';
import './Admin.css';

const AdminUsers = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'customer', phone: '' });

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await authAPI.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await authAPI.updateUser(editingUser, formData);
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      alert('Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await authAPI.deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  if (!isAdmin) {
    return <div className="error">Access denied. Admin only.</div>;
  }

  return (
    <div className="admin-users">
      <h1>User Management</h1>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                {editingUser === user._id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="customer">Customer</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={handleUpdate} className="btn-save">Save</button>
                      <button onClick={handleCancel} className="btn-cancel">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>{user.role}</span>
                    </td>
                    <td>
                      <button onClick={() => handleEdit(user)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(user._id)} className="btn-delete">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
