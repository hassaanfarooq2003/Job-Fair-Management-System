import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import './studentstyling/student_profile.css';

const DiscussionBoard = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Check if comment is empty
    if (!comment) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment, studentId: user.id }),
      });

      const data = await response.json();

      if (data.success) {
        setComment('');
        fetchComments();
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div>
      <Sidebar role="student" />
      <div className="std_profile_body">
        <div className="std_profile_container" style={{ margin: '20px 0' }}>
          <h2 className="std_profile_heading">Discussion Board</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="std_profile_input"
              placeholder="Enter your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" className="std_profile_button">
              Submit
            </button>
          </form>
        </div>
        <div className="std_profile_container" style={{ margin: '20px' }}>
          <h3>Comments</h3>
          {comments.map((c) => (
            <div key={c.CommentID}>
              <p>
                <strong>{c.Name}</strong>: {c.Comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscussionBoard;