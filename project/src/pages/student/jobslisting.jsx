import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import './studentstyling/student_card.css';
import './studentstyling/studentfilter.css'
import FileIcon from '../../images/filecon.jpg';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJobTitles, setSelectedJobTitles] = useState([]);

  useEffect(() => {
    fetchJobListings();
  }, []);

  const fetchJobListings = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/jobs_stud');
      const data = await response.json();
      console.log(data);
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error('Error fetching job listings:', error);
    }
  };

  const handleJobTitleSelect = (jobTitle) => {
    setSelectedJobTitles((prevSelectedJobTitles) => {
      if (prevSelectedJobTitles.includes(jobTitle)) {
        return prevSelectedJobTitles.filter((title) => title !== jobTitle);
      } else {
        return [...prevSelectedJobTitles, jobTitle];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedJobTitles.length === 0) {
      setFilteredJobs(jobs);
    } else {
      const filteredJobs = jobs.filter((job) =>
        selectedJobTitles.includes(job.jobTitle)
      );
      setFilteredJobs(filteredJobs);
    }
  };

  const handleApply = async (jobId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const studentId = user.id;
      console.log('studentId:', studentId);
      const formData = new FormData();
      formData.append('jobId', jobId);

      const resumeInput = document.createElement('input');
      resumeInput.type = 'file';
      resumeInput.accept = '.pdf';

      resumeInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        formData.append('resume', file, file.name);

        const response = await fetch('http://localhost:8081/api/application_stud', {
          method: 'POST',
          headers: {
            Authorization: studentId,
          },
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          alert('Application submitted successfully');
        } else {
          alert('Application failed to submit');
        }
      });

      resumeInput.click();
    } catch (error) {
      console.error('Error handling application:', error);
    }
  };

  return (
    <>
      <Sidebar role={'student'} />
      <div className="filter-container">
        <h3>Filter by Job Title:</h3>
        <div className="filter-options">
          <label>
            <input
              type="checkbox"
              checked={selectedJobTitles.length === 0}
              onChange={() => setSelectedJobTitles([])}
            />
            All
          </label>
          {['Software Engineer', 'Web Developer', 'Sales Associate', 'Financial Analyst', 'Marketing Coordinator'].map((jobTitle) => (
            <label key={jobTitle}>
              <input
                type="checkbox"
                checked={selectedJobTitles.includes(jobTitle)}
                onChange={() => handleJobTitleSelect(jobTitle)}
              />
              {jobTitle}
            </label>
          ))}
        </div>
        <button className="btn" onClick={handleSubmit}>Submit</button>
      </div>


      <div className="card-container">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.OfferID} className="card">
              <div className="card-image">
                <img className="object-cover" src={FileIcon} alt="Job Image" />
              </div>
              <div className="card-content">
                <h2 className="card-title">{job.jobTitle}</h2>
                <p className="card-text">{job.CompanyDesp}</p>
                <p className="card-text">Salary: {job.salary}</p>
                <p className="card-text">Start Date: {new Date(job.StartDate).toLocaleDateString()}</p>
              </div>
              <div className="card-actions">
                <button className="btn" onClick={() => handleApply(job.OfferID)}>
                  Apply Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No job listings match the selected filters.</p>
        )}
      </div>
    </>
  );
};

export default JobListing;