import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import './employeerstyling/employeer_form.css';
import './employeerstyling/employeer_table.css';
import { Button, Form, Modal, Table } from 'react-bootstrap';

const ReserveBooth = () => {
  const [booths, setBooths] = useState([]);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState({});
  const [reserveDateTime, setReserveDateTime] = useState('');

  useEffect(() => {
    fetchBooths();
  }, []);

  const fetchBooths = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/employeer_booths');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBooths(data);
    } catch (error) {
      console.error('Error fetching booths:', error);
    }
  };

  const handleReserveClick = (booth) => {
    setSelectedBooth(booth);
    setShowReserveModal(true);
  };

  const handleReserveModalClose = () => {
    setShowReserveModal(false);
    setReserveDateTime('');
  };

  const handleReserveSubmit = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      const employerId = userInfo.id;
      try {
        const response = await fetch(`http://localhost:8081/api/booths/${selectedBooth.Block}/${selectedBooth.Number}/employeer_reserve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employerId,
            reserveDateTime,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        handleReserveModalClose();
        fetchBooths(); // Refresh the booths after successful reservation
      } catch (error) {
        console.error('Error reserving booth:', error);
      }
    }
  };

  return (
    <>
      <Sidebar role="employer" />
      <div style={{ marginTop: '100px' }}>
        <h2>Reserve Booth</h2>
        <Table striped bordered hover className="employer-table">
          <thead>
            <tr>
              <th>Block</th>
              <th>Number</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reserved</th>
              <th>Action</th>
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
                  <Button
                    onClick={() => handleReserveClick(booth)}
                    disabled={booth.ReserveStatus}
                  >
                    Reserve
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showReserveModal} onHide={handleReserveModalClose}>
        <Modal.Body>
          <div className="mockup_container" style={{ marginTop: '500px' }}>
            <h2 className="mockup_heading">Time Date</h2>
            <Form>
              <Form.Group>
                <Form.Label>Reserve Date and Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={reserveDateTime}
                  onChange={(e) => setReserveDateTime(e.target.value)}
                  className="mockup_input"
                />
              </Form.Group>
              <div className="d-flex justify-content-end" style={{ margin: '10px' }} >
                <Button variant="secondary" onClick={handleReserveModalClose}>
                  Cancel
                </Button>
              </div>
              <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={handleReserveSubmit}>
                  Reserve
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ReserveBooth;