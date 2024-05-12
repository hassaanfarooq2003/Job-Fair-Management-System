import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import SidebarConfig from './sidebarconfig';
import './sidebar.css';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const sidebarConfig = SidebarConfig[role];

  const handleLinkClick = (link, onClick) => {
    if (onClick) {
      onClick();
    } else {
      navigate(link);
    }
  };

  return (
    <div className="sidebar">
      {sidebarConfig.map((item, index) => (
        <NavLink
          key={index}
          to={item.link}
          onClick={() => handleLinkClick(item.link, item.onClick)}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;