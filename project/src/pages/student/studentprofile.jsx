import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FormLabel from 'react-bootstrap/FormLabel'
import './studentstyling/student_profile.css'
const StudentProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gradYear: '',
    major: '',
    resume: null
  })

  useEffect(() => {
    // Get the user information from localStorage
    const userInfo = JSON.parse(localStorage.getItem('user'))

    if (userInfo) {
      // Make a fetch request to the server to get the user's data
      fetch(`http://localhost:8081/api/student/${userInfo.id}`)
        .then(response => response.json())
        .then(data => {
          setFormData({
            name: data.name,
            email: data.email,
            gradYear: data.gradYear,
            major: data.major,
            resume: data.resume
          })
        })
        .catch(error => {
          console.error('Error fetching user data:', error)
        })
    }
  }, [])

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = e => {
    setFormData({ ...formData, resume: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('gradYear', formData.gradYear);
      formDataToSend.append('major', formData.major);
      if (formData.resume) {
        formDataToSend.append('resume', formData.resume);
      } else {
        // Use the resume stored in the formData state
        formDataToSend.append('resume', formData.resume);
      }
      const userInfo = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:8081/api/student/${userInfo.id}`, {
        method: 'PUT',
        body: formDataToSend,
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
    <div className='std_profile_body'>
      <Sidebar role={'student'} />
      <div className='std_profile_container'>
        <h2 className='std_profile_heading'>Student Profile</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='formName'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='std_profile_input'
            />
          </Form.Group>

          <Form.Group controlId='formEmail'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='std_profile_input'
            />
          </Form.Group>

          <Form.Group controlId='formGradYear'>
            <Form.Label>Graduation Year</Form.Label>
            <Form.Control
              type='number'
              name='gradYear'
              value={formData.gradYear}
              onChange={handleChange}
              className='std_profile_input'
            />
          </Form.Group>

          <Form.Group controlId='formMajor'>
            <Form.Label>Major</Form.Label>
            <Form.Control
              type='text'
              name='major'
              value={formData.major}
              onChange={handleChange}
              className='std_profile_input'
            />
          </Form.Group>

          <Form.Group controlId='formResume'>
            <Form.Label>Resume</Form.Label>
            <Form.Control
              type='file'
              name='resume'
              onChange={handleFileChange}
              className='std_profile_input'
            />
          </Form.Group>

          <Button
            variant='primary'
            type='submit'
            className='std_profile_button'
          >
            Update Profile
          </Button>
        </Form>
      </div>
    </div>
  )
}

export default StudentProfile
