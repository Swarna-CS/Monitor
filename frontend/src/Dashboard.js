import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName");

    if (!token) {
      // Redirect to login if not authenticated
      window.location.href = "/";
      return;
    }

    setUserName(name);
  }, []);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("rememberMe");

    // Redirect to login
    window.location.href = "/";
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {userName}! ☕</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="card-dashboard">
          <h2>Coffee Machine Monitor</h2>
          <p>Your connected coffee machines dashboard</p>
          <div className="stats">
            <div className="stat-item">
              <h3>5</h3>
              <p>Active Machines</p>
            </div>
            <div className="stat-item">
              <h3>124</h3>
              <p>Cups Today</p>
            </div>
            <div className="stat-item">
              <h3>98%</h3>
              <p>Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;