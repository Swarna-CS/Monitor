import { useState } from "react";
import axios from "axios";
import "../AuthPage.css";

function ForgotPassword({ onBackToLogin }) {
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
      
      // Auto redirect back to login after 3 seconds
      setTimeout(() => {
        onBackToLogin();
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
        {/* LEFT SECTION */}
        <div className="left">
          <div className="text-overlay">
            <h1>WELCOME</h1>
            <h3>From Beans to Bytes</h3>
          </div>
          <div className="text-overlay-bottom">
            <p>A connected platform that monitors coffee machines remotely and keeps operations brewing smoothly.</p>
          </div>
        </div>
        
        {/* RIGHT SECTION */}
        <div className="right">
          <h2>Reset Password</h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* Success Message */}
          {message && (
            <div className="message success-message">
              ✓ {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="message error-message">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              name="email"
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
            <span onClick={onBackToLogin}> Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;