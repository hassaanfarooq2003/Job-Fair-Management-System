import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './employeerstyling/employeer_profile.css';

const EmployerProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyType: '',
    companyName: '',
  });

  useEffect(() => {
    // Get the user information from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user'));

    if (userInfo) {
      // Make a fetch request to the server to get the user's data
      fetch(`http://localhost:8081/employer_profile/${userInfo.id}`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            name: data.name,
            email: data.email,
            companyType: data.companyType,
            companyName: data.companyName,
          });
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:8081/employer_profile/${userInfo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (data.error) {
        console.error('Error updating user data:', data.error);
      } else {
        console.log('User data updated:', data.message);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="emp_profile_body">
      <Sidebar role={'employer'} />
      <div className="emp_profile_container">
        <h2 className="emp_profile_heading">Employer Profile</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="emp_profile_input"
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="emp_profile_input"
            />
          </Form.Group>

          <Form.Group controlId="formCompanyType">
            <Form.Label>Company Type</Form.Label>
            <Form.Select
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              className="emp_profile_input"
            >
              <option value="">Select a company type</option>
              <option value="software company">Software Company</option>
              <option value="IT consulting">IT Consulting</option>
              <option value="tech startups">Tech Startups</option>
              <option value="finance and banking">Finance and Banking</option>
              <option value="healthcare technology">Healthcare Technology</option>
              <option value="e-commerce and retail">E-commerce and Retail</option>
              <option value="telecommunications">Telecommunications</option>
              <option value="gaming and entertainment">Gaming and Entertainment</option>
              <option value="manufacturing and engineering">Manufacturing and Engineering</option>
              <option value="education technology">Education Technology</option>
              <option value="government and public sector">Government and Public Sector</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formCompanyName">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="emp_profile_input"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="emp_profile_button">
            Update Profile
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EmployerProfile;