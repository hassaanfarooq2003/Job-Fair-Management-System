import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../student/studentstyling/studentdashboard.css';
import Sidebar from '../../components/Sidebar';
import welcomeImage from '../../images/hello.svg';

const StudentDashboard = () => {
  return (
    <>
    <section className='student-bg'>
    <Container fluid className='student-dashboard'>
        <Row>
          <Col xs={2} className='sidebar'>
            <Sidebar role='student' />
          </Col>
          <Col xs={10} className='content p-4'>
            <div className="hero-section">
              <div className="hero-content">
                <h1 className="hero-content h1">Welcome, Student!</h1>
                <p className="hero-content p">What would you like to do today?</p>
              </div>
              <div className="hero-images">
                <img src={welcomeImage} alt='welcome' />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
    </>
  );
};

export default StudentDashboard;