import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../AuthPage.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:8080/api/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email: email
      });

      setMessage(response.data.message || "Password reset link sent to your email!");
      setEmail("");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "An error occurred");
      } else if (err.request) {
        setError("Cannot connect to server. Please try again later.");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="left">
          <div className="text-overlay">
            <h1>WELCOME</h1>
            <h3>From Beans to Bytes</h3>
          </div>
          <div className="text-overlay-bottom">
            <p>A connected platform that monitors coffee machines remotely and keeps operations brewing smoothly.</p>
          </div>
        </div>
        
        <div className="right">
          <h2>Reset Password</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {message && (
            <div className="message success-message">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="message error-message">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="signup" style={{ marginTop: '15px' }}>
            Remember your password? 
            <span onClick={() => navigate("/login")}> Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;