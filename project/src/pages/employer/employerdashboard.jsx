import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './employeerstyling/employeerdashboard.css'
import Sidebar from '../../components/Sidebar'
import welcomeImage from '../../images/hello.svg'

const EmployerDashboard = () => {
  return (
    <>
      <section className='employer-bg'>
        <Container fluid className='employer-dashboard'>
          <Row>
            <Col xs={2} className='sidebar'>
              <Sidebar role='employer' />
            </Col>
            <Col xs={10} className='content p-4'>
              <div className='hero-section'>
                <div className='hero-content'>
                  <h1 className='hero-content h1'>Welcome, Employer!</h1>
                  <p className='hero-content p'>
                    What would you like to do today?
                  </p>
                </div>
                <div className='hero-images'>
                  <img src={welcomeImage} alt='welcome' />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default EmployerDashboard
