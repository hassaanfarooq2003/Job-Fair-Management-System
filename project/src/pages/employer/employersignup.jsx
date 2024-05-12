import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './employeerstyling/employeer_login.css'

const EmployerSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    companyType: '',
    companyName: ''
  })
  const [isAgreed, setIsAgreed] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const navigate = useNavigate()

  const validatePassword = password => {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return re.test(password)
  }

  const handleChange = e => {
    if (e.target.id === 'password') {
      if (!validatePassword(e.target.value)) {
        setPasswordError(
          'Password must be at least 8 characters, include an uppercase letter, a number, and a special character'
        )
      }else {
        setPasswordError('')
      }
    }
    else if(e.target.id === 'username') {
          //if target.id is username then check if the value is only alphabets
      if(!/^[a-zA-Z]+$/.test(e.target.value)){
        alert('Only alphabets are allowed');
        e.target.value = "";
        return;
      }
      }

    setFormData({ ...formData, [e.target.id]: e.target.value })
  }
  const handleAgreementChange = e => {
    setIsAgreed(e.target.checked)
  }
  const handleSubmit = async e => {
    e.preventDefault()

    //Check if email is valid
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Invalid email address');
      return;
    }

    if (!passwordError) {
      try {
        const response = await fetch(
          'http://localhost:8081/api/employer/signup',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          }
        )
        const data = await response.json()
        if (data.success) {
          navigate('/employer/employerlogin')
        } else {
          console.error(data.message)
        }
      } catch (error) {
        alert("An error occurred. Please try again later.")
        console.error('Error:', error)
      }
    }
  }

  return (
    <div
      className='container d-flex justify-content-center align-items-center'
      style={{ height: '100vh' }}
    >
      <div>
        <h3 className='heading'>Employer Signup</h3>
        <Form className='form' onSubmit={handleSubmit}>
          <Form.Group className='inputForm'>
            <Form.Label htmlFor='username'>Full Name</Form.Label>
            <Form.Control
              type='text'
              id='username'
              className='input'
              placeholder='Enter your username'
              required
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='inputForm'>
            <Form.Label htmlFor='email'>Email</Form.Label>
            <Form.Control
              type='email'
              id='email'
              className='input'
              placeholder='Enter your email'
              required
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='inputForm'>
            <Form.Label htmlFor='password'>Password</Form.Label>
            <Form.Control
              type='password'
              id='password'
              className='input'
              placeholder='Enter your password'
              required
              onChange={handleChange}
            />
            {passwordError && <div className='error'>{passwordError}</div>}
          </Form.Group>
          <Form.Group className='inputForm'>
            <Form.Label htmlFor='companyName'>Company Name</Form.Label>
            <Form.Control
              type='text'
              id='companyName'
              className='input'
              placeholder='Enter your company name'
              required
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='inputForm'>
            <Form.Label htmlFor='companyType'>Company Type</Form.Label>
            <Form.Select id='companyType' required onChange={handleChange}>
              <option value=''>Select a company type</option>
              <option value='software company'>Software Company</option>
              <option value='IT consulting'>IT Consulting</option>
              <option value='tech startups'>Tech Startups</option>
              <option value='finance and banking'>Finance and Banking</option>
              <option value='healthcare technology'>
                Healthcare Technology
              </option>
              <option value='e-commerce and retail'>
                E-commerce and Retail
              </option>
              <option value='telecommunications'>Telecommunications</option>
              <option value='gaming and entertainment'>
                Gaming and Entertainment
              </option>
              <option value='manufacturing and engineering'>
                Manufacturing and Engineering
              </option>
              <option value='education technology'>Education Technology</option>
              <option value='government and public sector'>
                Government and Public Sector
              </option>
            </Form.Select>
          </Form.Group>
          <Form.Group className='inputForm'>
            <Form.Check
              type='checkbox'
              checked={isAgreed}
              onChange={handleAgreementChange}
              label='I agree to terms and services'
            />
          </Form.Group>
          <Button type='submit' className='login-button' disabled={!isAgreed}>
            Sign Up
          </Button>
        </Form>
        <div className='d-flex justify-content-center form'>
          <Button
            variant='link'
            className='login-button'
            onClick={() => navigate('/employer/employerlogin')}
          >
            Already have an account? Login
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EmployerSignup
