import React from 'react';
import { Link } from 'react-router-dom';
import './SideBar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/">Dashboard Home</Link></li>
                <li><Link to="/search">Search Page</Link></li>
                <li><Link to="/about">About Page</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;