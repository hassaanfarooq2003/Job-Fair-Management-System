const handleLogout = () => {
  // Remove the user information from localStorage
  localStorage.removeItem('user');
  // Redirect to the homepage
  window.location.href = '/';
};

const SidebarConfig = {
  admin: [
    { label: 'Dashboard', link: '/admin/adminDashboard' },
    { label: 'Manage Users', link: '/admin/users' },
    { label: 'Manage Events', link: '/admin/events' },
    { label: 'View Reports', link: '/admin/reports' },
    { label: 'Logout', link: '/logout', onClick: handleLogout }, // Add the onClick event
  ],
  student: [
    { label: 'Dashboard', link: '/student/student_dashboard' },
    { label: 'Edit Profile', link: '/student/student_profile' },
    { label: 'Resources', link: '/student/student_resources' },
    { label: 'Job Listings', link: '/student/jobs_listing' },
    { label: 'Status', link: '/student/job_status' },
    { label: 'Discussion Board', link: '/student/discussion_board' },
    { label: 'Logout', link: '/logout', onClick: handleLogout }, // Add the onClick event
  ],
  employer: [
    { label: 'Dashboard', link: '/employer/employerdashboard' },
    { label: 'Post Jobs', link: '/employer/postjobs' },
    { label: 'Review Applications', link: '/employer/reviewapplications' },
    { label: 'Manage Interviews', link: '/employer/manageinterviews' },
    { label: 'Employer Profile', link: '/employer/employerprofile' },
    { label: 'Reserve Booth', link: '/employer/reservebooth' },
    { label: 'Manage Mockup', link: '/employer/managemockup' },
    { label: 'Logout', link: '/logout', onClick: handleLogout }, // Add the onClick event
  ]
};


export default SidebarConfig;