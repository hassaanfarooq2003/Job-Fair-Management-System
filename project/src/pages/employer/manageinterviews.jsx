import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap'; // Import necessary components
// ]
import Sidebar from '../../components/Sidebar';
import './employeerstyling/employeer_card.css';
import './employeerstyling/employeer_form.css';
import './employeerstyling/up_button.css';
import FileIcon from '../../images/filecon.jpg';

const ManageInterviews = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [interviewDateTime, setInterviewDateTime] = useState('');
  const [feedback, setFeedback] = useState('');
  const [studentID, setStudentID] = useState('');
  const [interviewID,setInterviewID]=useState('')
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      const employerId = userInfo.id;
      fetchActiveJobs(employerId);
    }
  }, []);

  const fetchActiveJobs = async (employerId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/employer/${employerId}/jobactive`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setActiveJobs(data);
    } catch (error) {
      console.error('Error fetching active jobs:', error);
    }
  };

  const fetchCandidates = async (employerId, jobId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/employer/${employerId}/job/${jobId}/candidatesApproved`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleJobChange = (event) => {
    const selectedJobId = event.target.value;
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      const employerId = userInfo.id;
      setSelectedJob(selectedJobId);
      fetchCandidates(employerId, selectedJobId);
    }
  };

  const handleInterviewModalOpen = (studentID) => {
    setShowInterviewModal(true);
    setStudentID(studentID);
    //set the studentid 
  };

  const handleInterviewModalClose = () => {
    setShowInterviewModal(false);
    setInterviewDateTime('');
  };

  const handleInterviewSubmit = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      const employerId = userInfo.id;
    try {
        const response = await fetch('http://localhost:8081/api/employeer_interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datetime: interviewDateTime,
          employerId: employerId,
          studentId: studentID,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();  
      console.log(data); 
      
      // Store interviewId in state variable
      setInterviewID(data.interviewId);

      handleInterviewModalClose();
    } catch (error) {
      console.error('Error creating interview:', error);
    }
    }
  };
  const handleFeedbackModalOpen = (studentID) => {
    setShowFeedbackModal(true);
    setStudentID(studentID);
    // Set the studentId state if needed
  };

  const handleFeedbackModalClose = () => {
    setShowFeedbackModal(false);
    setFeedback('');
  };
  const handleUpdateInterview = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      const employerId = userInfo.id;
      try {
        const response = await fetch('http://localhost:8081/api/employeer-interviews-status', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employerId: employerId,
            studentId: studentID,
            interviewId: interviewID,
          }),
        });
        console.log(response.data);
        handleInterviewModalClose();
      } catch (error) {
        console.error('Error updating interview:', error);
      }
    }
  };
  const handleFeedbackSubmit = async () => {
   handleUpdateInterview();


  //Check if feedback is provided
  if(feedback===''){
    alert('Please provide feedback');
    return;
  }
  
   const userInfo = JSON.parse(localStorage.getItem('user'));
   if (userInfo) {
     const employerId = userInfo.id;
    try {
      const response = await fetch('http://localhost:8081/api/employeer_feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: feedback,
          employerId:employerId,
          studentId: studentID,
        }),
      });
      console.log(response.data);
      handleFeedbackModalClose();
    } catch (error) {
      console.error('Error providing feedback:', error);
    }
  }
  };

  return (
    <>
      <Sidebar role="employer" />
      <div className="container" style={{ marginTop: '-250px' }}>
        <div className="md-flex justify-content-end mb-3 w-100">
          <label htmlFor="jobSelect">Select a Job:</label>
          <select id="jobSelect" className="form-control" onChange={handleJobChange}>
            <option value="">Select a job</option>
            {activeJobs.map((job) => (
              <option key={job.OfferID} value={job.OfferID}>
                {job.jobTitle}
              </option>
            ))}
          </select>
        </div>
      </div>
     
        {selectedJob && (
          <div className="card-container d-flex flex-wrap justify-content-center"style={{marginTop: '200px'}} >
            {candidates.map((candidate) => (
              <div key={candidate.email} className="card m-3">
                <div className="card-image">
                  <img className="object-cover" src={FileIcon} alt="Job Image" />
                </div>
                <div className="card-content">
                  <h2 className="card-title">{candidate.Name}</h2>
                  <p className="card-text">{candidate.email}</p>
                </div>
                <div className="card-actions">
                  <a
                    onClick={() => handleInterviewModalOpen(candidate.studentID)}
                    className="btn"
                  >
                    Assign Interview
                  </a>
                </div>
                <div>
                  <div className="card-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleFeedbackModalOpen(candidate.studentID)}
                    >
                      Mark As Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
     
      {/* Interview Modal */}
      <Modal show={showInterviewModal} onHide={handleInterviewModalClose}>
        {/* <Modal.Header closeButton>
          <Modal.Title> </Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
        <div className="mockup_container">
        <h2 className="mockup_heading">Reserve Interview</h2>
          <Form>
            <Form.Group>
              <Form.Label>Interview Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={interviewDateTime}
                onChange={(e) => setInterviewDateTime(e.target.value)}
                
                className="mockup_input"
              />
            </Form.Group>
          
          <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleInterviewModalClose} className="mockup_button">
            Cancel
          </Button>
          </div>
          <div className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleInterviewSubmit} className="mockup_button">
            Reserve
          </Button>
          </div>
          </Form>
          </div>
          </Modal.Body>
        
      </Modal>

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={handleFeedbackModalClose}>
        {/* <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
        <div className="mockup_container">
        <h2 className="mockup_heading">Provide Feedback</h2>
          <Form>
            <Form.Group>
              <Form.Label>Feedback</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mockup_input"
              />
            </Form.Group>
         
          <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleFeedbackModalClose} className="mockup_button">
            Cancel
          </Button>
          </div>
          <div className="d-flex justify-content-end">
           <Button variant="primary" onClick={handleFeedbackSubmit} className="mockup_button">
            Submit
           </Button>
           </div>
          </Form>
          </div>
          </Modal.Body>
        
      </Modal>
    </>
  );
};

export default ManageInterviews;
