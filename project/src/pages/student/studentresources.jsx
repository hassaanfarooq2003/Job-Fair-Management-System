import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import './studentstyling/student_card.css'
import Fileicon from '../../images/filecon.jpg'
const StudentResources = () => {
  const [mockups, setMockups] = useState([])

  useEffect(() => {
    const fetchMockups = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/mockups')
        const data = await response.json()
        console.log(data)
        setMockups(data)
      } catch (error) {
        console.error('Error fetching mock-up interviews:', error)
      }
    }

    fetchMockups()
  }, [])
  const downloadFile = async (mockupId, title) => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/mockups/${mockupId}`
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      console.log(url)
      console.log(title)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title}.pdf`
      document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
      a.click()
      a.remove() //afterwards we remove the element again
    } catch (error) {
      console.error('Error:', error)
    }
  }
  return (
    <>
      <Sidebar role={'student'} />
      <div className='card-container'>
        {mockups.map(mockup => (
          <div className='card' key={mockup.mockID}>
            <div className='card-image'>
              <img
                src={Fileicon}
                alt='Placeholder'
                className='object-cover'
              />
            </div>
            <div className='card-content'>
              <h2 className='card-title'>{mockup.jobTitle}</h2>
              <p className='card-text'>PDF</p>
            </div>
            <div className='card-actions'>
              <a
                onClick={() => downloadFile(mockup.mockID, mockup.jobTitle)}
                className='btn'
              >
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default StudentResources
