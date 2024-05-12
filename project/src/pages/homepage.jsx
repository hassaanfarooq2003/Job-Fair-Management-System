import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import './homepage.css'

const Homepage = () => {
  return (
    <div className='homepage'>
      <div className='homepage__content'>
        <h1>Job Fair Portal</h1>
        <p>
          <strong>Welcome User!!</strong>
        </p>
        <br></br>
        <p>
          Introducing Fast first job fair website to facilate everyone
          particpating{' '}
        </p>
        <p>Choose your role to login</p>
      </div>
      <div className='homepage__buttons'>
        <Link to='/student/studentlogin'>
          <Button variant='primary'>Student</Button>
        </Link>
        <Link to='/employer/employerlogin'>
          <Button variant='primary'>Employeer</Button>
        </Link>
        <Link to='/admin/adminlogin'>
          <Button variant='primary'>Admin</Button>
        </Link>
      </div>
    </div>
  )
}

export default Homepage
