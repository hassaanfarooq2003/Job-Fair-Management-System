import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import ManageEvents from './ManageEvents';
import ViewReports from './ViewReport';
import AdminDashboard from './admindashboard';
import AdminLogin from './adminlogin'; 
import AdminSignup from './AdminSignup'
const adminroutes = () => {
    return (
        <Routes>
          <Route path="admindashboard" element={<AdminDashboard/>}/>
          <Route path="users" element={<ManageUsers />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="reports" element={<ViewReports />} />
          <Route path="adminlogin" element={<AdminLogin />} />
          <Route path="adminsignup" element={<AdminSignup />} />
        </Routes>
      );
};

export default adminroutes;