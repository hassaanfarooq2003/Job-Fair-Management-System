// reviewapplications.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import './employeerstyling/employeer_card.css';
import './employeerstyling/employeer_form.css';
import './employeerstyling/up_button.css';
import FileIcon from '../../images/filecon.jpg';

const ReviewApplications = () => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);

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
      console.log(data);
      setActiveJobs(data);
    } catch (error) {
      console.error('Error fetching active jobs:', error);
    }
  };
  const fetchCandidates = async (employerId, jobId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/employer/${employerId}/job/${jobId}/candidates`);
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

  const handleApproveCandidate = async (candidateId) => {
    console.log('Approving candidate:', candidateId);
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      const employerId = userInfo.id;
      try {
        const response = await fetch(`http://localhost:8081/api/employer/${employerId}/candidate/${candidateId}/approvecandidate`, {
          method: 'PUT'
        });
        const data = await response.json();
        if (data.success) {
          // Refresh the candidates list after approving a candidate
          fetchCandidates(employerId, selectedJob);
        } else {
          console.error('Error approving candidate:', data.error);
        }
      } catch (error) {
        console.error('Error approving candidate:', error);
      }
    }
  };
  const downloadFile = async (candidateId, title) => {
    try {
      const response = await fetch(`http://localhost:8081/api/candidates/${candidateId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.pdf`;
      document.body.appendChild(a); // We need to append the element to the DOM -> otherwise it will not work in Firefox
      a.click();
      a.remove(); // Afterward, we remove the element again
    } catch (error) {
      console.error('Error:', error);
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
        <div style={{ marginTop:'200px'}}>
        {selectedJob && (
          <div className="card-container d-flex flex-wrap justify-content-center">
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
                    onClick={() => downloadFile(candidate.CadID, candidate.Name)}
                    className='btn'
                    >
                      Download Resume
                    </a>
                    </div>
                    <div>
                      <div className='card-actions'>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleApproveCandidate(candidate.CadID)}
                      disabled={candidate.approved_status}
                    >
                      {candidate.approved_status ? 'Approved' : 'Approve'}
                    </button>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewApplications;