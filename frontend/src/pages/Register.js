import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'phone') {
      const spacedFormat = /^07\d \d{3} \d{3}$/;
      const plainFormat = /^07\d{7}$/;
      if (value && !spacedFormat.test(value) && !plainFormat.test(value)) {
        setPhoneError('Phone must be either 07X XXX XXX or 07XXXXXXX');
      } else {
        setPhoneError('');
      }
    }

    if (name === 'password') {
      const hasNumber = /\d/.test(value);
      const isLongEnough = value.length >= 7;
      if (value && (!hasNumber || !isLongEnough)) {
        setPasswordError('Password must be at least 7 characters and include a number');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const spacedFormat = /^07\d \d{3} \d{3}$/;
    const plainFormat = /^07\d{7}$/;
    if (!spacedFormat.test(formData.phone) && !plainFormat.test(formData.phone)) {
      setPhoneError('Please enter a valid phone: 07X XXX XXX or 07XXXXXXX');
      return;
    }

    const hasNumber = /\d/.test(formData.password);
    const isLongEnough = formData.password.length >= 7;
    if (!hasNumber || !isLongEnough) {
      setPasswordError('Password must be at least 7 characters and include a number');
      return;
    }

    try {
      const cleanPhone = formData.phone.replace(/\s/g, '');
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        ...formData,
        phone: cleanPhone,
      });
      login(res.data);
      navigate('/patient-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-4">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className={`form-control ${phoneError ? 'is-invalid' : ''}`}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="ex. 071 234 567"
              required
            />
            {phoneError && <div className="invalid-feedback">{phoneError}</div>}
            <small className="form-text text-muted">
            </small>
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${passwordError ? 'is-invalid' : ''}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
            <small className="form-text text-muted">
              At least 7 characters, must include a number.
            </small>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
        <p className="mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;