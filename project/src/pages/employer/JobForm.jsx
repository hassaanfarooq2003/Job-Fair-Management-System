import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './employeerstyling/employeer_form.css';

const JobForm = ({ onSubmit }) => {
  const [newJob, setNewJob] = useState({
    jobTitle: '',
    jobDescription: '',
    status: false,
    startDatetime: '',
    salary: '',
    applicationDeadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobData = {
      jobTitle: newJob.jobTitle,
      jobDescription: newJob.jobDescription,
      status: newJob.status,
      startDatetime: newJob.startDatetime,
      salary: newJob.salary,
      applicationDeadline: newJob.applicationDeadline
    };

    // Call the onSubmit prop function with the job data
    const success = await onSubmit(jobData);

    // Reset the form fields if the submission is successful
    if (success) {
      setNewJob({
        jobTitle: '',
        jobDescription: '',
        status: false,
        startDatetime: '',
        salary: '',
        applicationDeadline: ''
      });
    }
  };

  const handleChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  return (
    <div className='modal-container'>
      <h2 className='mockup_heading'>Post a Job</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='formJobTitle'>
          <Form.Label>Job Title</Form.Label>
          <Form.Control
            type='text'
            name='jobTitle'
            value={newJob.jobTitle}
            onChange={handleChange}
            required
            className='mockup_input'
          />
        </Form.Group>
        <Form.Group controlId='formJobDescription'>
          <Form.Label>Job Description</Form.Label>
          <Form.Control
            as='textarea'
            name='jobDescription'
            value={newJob.jobDescription}
            onChange={handleChange}
            required
            className='mockup_input'
          />
        </Form.Group>
        <Form.Group controlId='formStatus'>
          <Form.Label>Status (true/false)</Form.Label>
          <Form.Control
            type='text'
            name='status'
            value={newJob.status}
            onChange={handleChange}
            required
            className='mockup_input'
          />
        </Form.Group>
        <Form.Group controlId='formStartDatetime'>
          <Form.Label>Start Date/Time</Form.Label>
          <Form.Control
            type='datetime-local'
            name='startDatetime'
            value={newJob.startDatetime}
            onChange={handleChange}
            required
            className='mockup_input'
          />
        </Form.Group>
        <Form.Group controlId='formSalary'>
          <Form.Label>Salary</Form.Label>
          <Form.Control
            type='number'
            name='salary'
            value={newJob.salary}
            onChange={handleChange}
            required
            className='mockup_input'
          />
        </Form.Group>
        <Form.Group controlId='formApplicationDeadline'>
          <Form.Label>Application Deadline</Form.Label>
          <Form.Control
            type='date'
            name='applicationDeadline'
            value={newJob.applicationDeadline}
            onChange={handleChange}
            required
            className='mockup_input'
          />
        </Form.Group>
        <div className='d-flex justify-content-end'>
          {' '}
          <Button variant='primary' type='submit' className='mockup_button'>
            {' '}
            Submit{' '}
          </Button>{' '}
        </div>{' '}
      </Form>{' '}
    </div>
  )
}
export default JobForm
