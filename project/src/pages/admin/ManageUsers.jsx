import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import '../admin/adminstyling/admin_manageuser.css'

const ManageUsers = () => {
  const [users, setUsers] = useState({ students: [], employers: [] })
  const [studentSearchTerm, setStudentSearchTerm] = useState('')
  const [employerSearchTerm, setEmployerSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Fetch students
      const studentResponse = await fetch('http://localhost:8081/api/students')
      const students = await studentResponse.json()

      // Fetch employers
      const employerResponse = await fetch(
        'http://localhost:8081/api/employers'
      )
      const employers = await employerResponse.json()

      setUsers({ students, employers })
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleStudentSearch = e => {
    setStudentSearchTerm(e.target.value)
  }

  const handleEmployerSearch = e => {
    setEmployerSearchTerm(e.target.value)
  }

  const filteredStudents = users.students.filter(student =>
    student.Name.toLowerCase().includes(studentSearchTerm.toLowerCase())
  )

  const filteredEmployers = users.employers.filter(employer =>
    employer.Name.toLowerCase().includes(employerSearchTerm.toLowerCase())
  )

  const handleDeleteStudent = async studentId => {
    try {
      // Delete related data from other tables
      await fetch(
        `http://localhost:8081/api/delete-student-related-data/${studentId}`,
        {
          method: 'DELETE'
        }
      )

      // Delete the student
      const response = await fetch(
        `http://localhost:8081/api/students/${studentId}`,
        {
          method: 'DELETE'
        }
      )

      if (response.ok) {
        setUsers(prevUsers => ({
          ...prevUsers,
          students: prevUsers.students.filter(
            student => student.StdID !== studentId
          )
        }))
      } else {
        console.error('Error deleting student')
      }
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }

  const handleDeleteEmployer = async employerId => {
    try {
      // Delete related data from other tables
      await fetch(
        `http://localhost:8081/api/delete-employer-related-data/${employerId}`,
        {
          method: 'DELETE'
        }
      )

      // Delete the employer
      const response = await fetch(
        `http://localhost:8081/api/employers/${employerId}`,
        {
          method: 'DELETE'
        }
      )

      if (response.ok) {
        setUsers(prevUsers => ({
          ...prevUsers,
          employers: prevUsers.employers.filter(
            employer => employer.EmpID !== employerId
          )
        }))
      } else {
        console.error('Error deleting employer')
      }
    } catch (error) {
      console.error('Error deleting employer:', error)
    }
  }

  return (
    <>
      <div>
        <Sidebar role={'admin'} />
      </div>
      <div className='content'>
        <h1>Manage Users</h1>
        <h1>Manage Students</h1>
        <div className='search-container'>
          <div className='search-bar'>
            <input
              type='text'
              placeholder='Search students'
              value={studentSearchTerm}
              onChange={handleStudentSearch}
            />
            <button className='search-btn'>Search</button>
          </div>
        </div>

        <div className='admin-table'>
          <table className='admin_manage-users-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr key={student.StdID}>
                  <td>{student.Name}</td>
                  <td>{student.email}</td>
                  <td>
                    <button
                      className='btn-danger'
                      onClick={() => handleDeleteStudent(student.StdID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h1>Manage Employers</h1>
        <div className='search-container'>
          <div className='search-bar'>
            <input
              type='text'
              placeholder='Search employers'
              value={employerSearchTerm}
              onChange={handleEmployerSearch}
            />
            <button className='search-btn'>Search</button>
          </div>
        </div>
        <div className='admin-table'>
          <table className='admin_manage-users-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployers.map(employer => (
                <tr key={employer.EmpID}>
                  <td>{employer.Name}</td>
                  <td>{employer.email}</td>
                  <td>{employer.CompanyName}</td>
                  <td>
                    <button
                      className='btn-danger'
                      onClick={() => handleDeleteEmployer(employer.EmpID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ManageUsers
