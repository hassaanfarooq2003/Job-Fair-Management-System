// PostJobs.jsx
import React, { useState, useEffect } from 'react';
import './employeerstyling/employeer_card.css';
import './employeerstyling/up_button.css';
import Sidebar from '../../components/Sidebar';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import FileIcon from '../../images/filecon.jpg';
import JobForm from './JobForm';

const PostJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [noJobs, setNoJobs] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [formSubmitted]);

  const fetchJobs = () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      const employerId = userInfo.id;
      fetch(`http://localhost:8081/api/employer/${employerId}/jobs`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.length === 0) {
            setNoJobs(true);
          } else {
            setJobs(data);
            setNoJobs(false);
          }
        })
        .catch(error => console.error('Error fetching jobs:', error));
    }
  };

  const handleDelete = async job => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      try {
        await fetch(`http://localhost:8081/api/employer/${userInfo.id}/jobs/${job.OfferID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: false })
        });
        // Update the UI by removing the deleted job from the jobs state
        setJobs(jobs.filter(j => j.OfferID !== job.OfferID));
        // Fetch jobs after deletion
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };
const handleJobSubmission = async (jobData) => {
  const userInfo = JSON.parse(localStorage.getItem('user'));
  if (userInfo) {
    try {
      const response = await fetch(`http://localhost:8081/api/employer/${userInfo.id}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      });
      const data = await response.json();
      if (data.success) {
        // Close the form
        setShowForm(false);
        // Set formSubmitted to trigger useEffect and fetch jobs after a delay
        setFormSubmitted(prev => !prev);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error('Error posting job:', error);
    }
  }
};

useEffect(() => {
  const timer = setTimeout(() => {
    fetchJobs();
  }, 1000); // Fetch jobs after 1 second

  return () => clearTimeout(timer); // Clean up timer
}, [formSubmitted]);

  return (
    <>
      <Sidebar role='employer' />
      <div className='up_button-container'>
        <div className='d-flex justify-content-end mb-3'>
          <Button
            variant='primary'
            className='add-job-btn'
            onClick={() => setShowForm(true)}
          >
            <FaPlus /> Post Job
          </Button>
        </div>
      </div>

      {showForm && <JobForm onSubmit={handleJobSubmission} />}

      {noJobs ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className='card-container d-flex flex-wrap justify-content-center'>
          {jobs.map((job, index) => (
            <div key={index} className='card m-3'>
              <div className='card-image'>
                <img className='object-cover' src={FileIcon} alt='Job Image' />
              </div>
              <div className='card-content'>
                <h2 className='card-title'>{job.jobTitle}</h2>
                <p className='card-text'>Job Description: {job.JobDescription}</p>
                <p className='card-text'>Status: {job.status ? 'Open' : 'Closed'}</p>
                <p className='card-text'>Start Date/Time: {job.StartDate}</p>
                <p className='card-text'>Salary: ${job.salary}</p>
                <p className='card-text'>Application Deadline: {job.submissionDate}</p>
                <button onClick={() => handleDelete(job)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PostJobs;