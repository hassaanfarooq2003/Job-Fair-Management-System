import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import './studentstyling/student_jobstatus.css'
import axios from 'axios'

const JobStatus = () => {
  const [student, setStudent] = useState(null)

  useEffect(() => {
    const studentId = JSON.parse(localStorage.getItem('user')).id

    axios
      .get(`http://localhost:8081/api/student/${studentId}/applications`)
      .then(response => {
        setStudent(response.data)
      })
      .catch(error => console.error(error))
  }, [])

  return (
    <>
      <Sidebar role={'student'} />
      {student ? (
        <div className='student_jobstatus-table-container'>
          <table className='student_jobstatus-table'>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Job Status</th>
                <th>Company Name</th>
                <th>Employer Name</th>
                <th>Booth</th>
                <th>Booth Time</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              <tr key={student.CadID}>
                <td>{student.jobTitle}</td>
                <td>{student.Status ? 'Open' : 'Closed'}</td>
                <td>{student.CompanyName}</td>
                <td>{student.EmployerName}</td>
                <td>
                  {student.Block && student.Number
                    ? `${student.Block} / ${student.Number}`
                    : '-'}
                </td>
                <td>{student.time || '-'}</td>
                <td>{student.comment || '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}

export default JobStatus