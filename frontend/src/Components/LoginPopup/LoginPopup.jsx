import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  const [authMode, setAuthMode] = useState("Login"); // "Login" or "Sign Up"
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();

    const endpoint = authMode === "Login" ? "/api/user/login" : "/api/user/register";

    try {
      const response = await axios.post(`${url}${endpoint}`, data);
      const resData = response.data;

      if (resData.success) {
        localStorage.setItem("token", resData.token); // ✅ Save JWT
        setToken(resData.token);                      // ✅ Set in context
        setShowLogin(false);                          // ✅ Close popup
      } else {
        alert(resData.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert(err.response?.data?.message || "Server error. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={handleAuth} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{authMode}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className="login-popup-inputs">
          {authMode === "Sign Up" && (
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={data.name}
              onChange={handleInputChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={data.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">
          {authMode === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the Terms of Use & Privacy Policy.</p>
        </div>

        <p>
          {authMode === "Login" ? (
            <>New here? <span onClick={() => setAuthMode("Sign Up")}>Create an account</span></>
          ) : (
            <>Already have an account? <span onClick={() => setAuthMode("Login")}>Login here</span></>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;
