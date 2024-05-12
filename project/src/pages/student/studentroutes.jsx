import React from 'react';
import { Route, Routes } from 'react-router-dom';
import StudentDashboard from './studentdashboard';
import StudentProfile from './studentprofile';
import StudentResources from './studentresources';
import JobsListing from './jobslisting';
import JobStatus from './jobstatus';
import DiscussionBoard from './discussionboard';
import StudentSignup from './studentsignup'
import StudentLogin from './studentlogin';
const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="student_dashboard" element={<StudentDashboard />} />
      <Route path="student_profile" element={<StudentProfile />} />
      <Route path="student_resources" element={<StudentResources />} />
      <Route path="jobs_listing" element={<JobsListing />} />
      <Route path="job_status" element={<JobStatus />} />
      <Route path="discussion_board" element={<DiscussionBoard />} />
      <Route path="studentlogin" element={<StudentLogin />} />
      <Route path="studentsignup" element={<StudentSignup />} />
    </Routes>
  );
};

export default StudentRoutes;