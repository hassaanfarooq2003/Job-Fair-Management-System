import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/homepage.jsx';
import AdminRoutes from './pages/admin/adminroutes.jsx';
import StudentRoutes from './pages/student/studentroutes.jsx';
import EmployerRoutes from './pages/employer/employerroutes.jsx';
import './App.css'
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/student/*" element={<StudentRoutes />} />
          <Route path="/employer/*" element={<EmployerRoutes />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;