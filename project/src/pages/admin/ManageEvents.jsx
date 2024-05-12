import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import '../admin/adminstyling/admin_manageuser.css'
// import '../employer/employerstyling/ManageEvents.css'


const ManageEvents = () => {
  const [booths, setBooths] = useState([]);
  const [searchBlock, setSearchBlock] = useState('');
  const [searchNumber, setSearchNumber] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    block: '',
    number: '',
    date: '',
    time: '',
  });

  useEffect(() => {
    fetchBooths();
  }, []);

  const fetchBooths = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/admin_booths', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch booths');
      }
      const data = await response.json();  
      setBooths(data);  
    } catch (error) {
      console.error('Error fetching booths:', error);
    }
  };
  

  const handleSearch = async () => {
    try {
      if (searchBlock === '' && searchNumber === '') {
        fetchBooths(); // Fetch all booths if search criteria is empty
      } else {
        const response = await fetch('http://localhost:8081/api/admin_booths', {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch booths');
        }
        const data = await response.json();  
        const filteredBooths = data.filter(
          (booth) =>
            (searchBlock === '' || booth.Block === searchBlock) &&
            (searchNumber === '' || booth.Number === parseInt(searchNumber))
        );
        setBooths(filteredBooths);
      }
    } catch (error) {
      console.error('Error fetching booths:', error);
    }
  };
  
  

  const handleDelete = async (block, number) => {
    try {
      await fetch(`http://localhost:8081/api/admin_booths/${block}/${number}`,
        { method: 'DELETE'}
      );
      fetchBooths();
    } catch (error) {
      console.error('Error deleting booth:', error);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await fetch('http://localhost:8081/api/admin_booths', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      setShowForm(false);
      fetchBooths();
    } catch (error) {
      console.error('Error adding booth:', error);
    }
  };
  

  return (
    <>
     <div>
      <Sidebar role={'admin'} />
      </div>
      <div className="content">
        <div className="search-container">
          <div className='search-bar'>
          <input
            type="text"
            placeholder="Search Block"
            value={searchBlock}
            onChange={(e) => setSearchBlock(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search Number"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
        <div>
        <button  className="search-btn" onClick={() => setShowForm(true)}>Insert</button>
        </div>
        </div>
        {showForm && (
          <div className="mock-container">
            <h2 className='mockup_heading'>Insert Booth</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="block"
                placeholder="Block"
                value={formData.block}
                onChange={handleFormChange}
                required
                className='mockup_input'
              />
              <input
                type="number"
                name="number"
                placeholder="Number"
                value={formData.number}
                onChange={handleFormChange}
                required
                className='mockup_input'
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                required
                className='mockup_input'
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleFormChange}
                required
                className='mockup_input'
              />
              <div className="d-flex justify-content-end">
              <button className='mockup_button' type="submit">Submit</button>
              </div>
            </form>
          </div>
        )}
        <div className="table-container">
        <table className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>Block</th>
              <th>Number</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reserve Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {booths.map((booth) => (
              <tr key={`${booth.Block}-${booth.Number}`}>
                <td>{booth.Block}</td>
                <td>{booth.Number}</td>
                <td>{booth.date}</td>
                <td>{booth.time}</td>
                <td>{booth.ReserveStatus ? 'Reserved' : 'Available'}</td>
                <td>
                  <button  className='btn-danger' onClick={() => handleDelete(booth.Block, booth.Number)}>
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
  );
};

export default ManageEvents;