import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets'; // Adjust path as necessary

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="Logo" />
          <p>
                This project focuses on developing an online food delivery system that enables users 
                to browse restaurant menus, place food orders, and have meals delivered to their 
                doorstep. It streamlines the process for both customers and restaurants through a 
                user-friendly web or mobile interface. Key features include real-time order tracking,
                 secure payment integration, and customer feedback. The system aims to enhance convenience, 
                 improve service efficiency, and support local food businesses.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.linkedin_icon} alt="LinkedIn" />
          </div>
        </div>
        <div className="footer-content-center">
         <h2>COMPANY</h2>
         <ul>
            <li>Home</li>
            <li>About us</li>
            <li>orders</li>
            <li>wishlist</li>
         </ul>
        </div>
        <div className="footer-content-right">
         <h2>GET IN TOUCH</h2>
         <ul>
            <li>+91 8229862782</li>
            <li>contact@tomato.com</li>
         </ul>
        </div>
      </div>
      <hr/>
      <p className="footer-copyright">Copyright 2025 © Tomato.com-All Right Reserved.</p>
    </div>
  );
};

export default Footer;
