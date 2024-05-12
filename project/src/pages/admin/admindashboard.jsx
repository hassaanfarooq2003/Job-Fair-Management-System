import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import '../admin/adminstyling/admindashboard.css'
import Sidebar from '../../components/Sidebar'
import helloImage from '../../images/hello.svg'
import Image from 'react-bootstrap/Image'

const AdminDashboard = () => {
  return (
    <>
    <section className='admin-bg'>
      <Container fluid className='admin-dashboard'>
        <Row>
          <Col xs={2} className='sidebar'>
            <Sidebar role='admin' />
          </Col>
          <Col xs={10} className='content p-4'>
            <div className='hero-section'>
              <div className='hero-content'>
                <h1 className='hero-content h1'>Welcome, Admin!</h1>
                <p className='hero-content p'>
                  What would you like to do today?
                </p>
              </div>
              <div className='hero-images'>
                <img src={helloImage} alt='welcome' />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  </>
  )
}

export default AdminDashboard