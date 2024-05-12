import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './adminstyling/admin_login.css';

const AdminSignup = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [passwordError, setPasswordError] = useState('');
  const [isAgreed, setIsAgreed] = useState(false); // New state variable
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const handleChange = (e) => {
    if (e.target.id === 'password') {
      if (!validatePassword(e.target.value)) {
        setPasswordError('Password must be at least 8 characters, include an uppercase letter, a number, and a special character');
      } else {
        setPasswordError('');
      }
    }
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAgreementChange = e => {
    setIsAgreed(e.target.checked);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordError) {
      try {
        const response = await fetch('http://localhost:8081/api/admin/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          navigate('/admin/adminlogin');
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error signing up:', error);
      }
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <div>
        <h3 className="heading">Admin Signup</h3>
        <Form className="form" onSubmit={handleSubmit}>
          <Form.Group className="inputForm">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control
              type="email"
              id="email"
              className="input"
              placeholder="Enter your email"
              required
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="inputForm">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              type="password"
              id="password"
              className="input"
              placeholder="Enter your password"
              required
              onChange={handleChange}
            />
            {passwordError && <div className="error">{passwordError}</div>}
          </Form.Group>
          <Form.Group className='inputForm'>
            <Form.Check 
              type='checkbox' 
              checked={isAgreed} 
              onChange={handleAgreementChange}
              label="I agree to terms and services"
            />
          </Form.Group>
          <Button type="submit" className="login-button" disabled={!isAgreed}>
            Sign Up
          </Button>
        </Form>
        <div className="d-flex justify-content-center form">
          <Button
            variant="link"
            className="login-button"
            onClick={() => navigate('/admin/adminlogin')}
          >
            Already have an account? Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;