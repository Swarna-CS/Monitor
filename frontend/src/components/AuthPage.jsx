import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../AuthPage.css";

function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE_URL = "http://localhost:8080/api/auth";

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setError("");
    setSuccess("");
  };

  // SIGN IN / SIGN UP HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isSignUp) {
        const response = await axios.post(`${API_BASE_URL}/signup`, {
          fullname: formData.name,
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userName", response.data.fullName);
        localStorage.setItem("userEmail", response.data.email);

        setSuccess(response.data.message);
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);

      } else {
        const response = await axios.post(`${API_BASE_URL}/signin`, {
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userName", response.data.fullName);
        localStorage.setItem("userEmail", response.data.email);
        
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        setSuccess(response.data.message);
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }

    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "An error occurred");
      } else if (err.request) {
        setError("Cannot connect to server. Please make sure the backend is running.");
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD HANDLER
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email: formData.email
      });

      setSuccess(response.data.message || "Password reset link sent to your email!");
      setFormData({ ...formData, email: "" });
      
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccess("");
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

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSuccess("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false
    });
  };

  const showForgotPasswordForm = () => {
    setShowForgotPassword(true);
    setError("");
    setSuccess("");
    setFormData({ ...formData, email: "", password: "" });
  };

  const backToLogin = () => {
    setShowForgotPassword(false);
    setError("");
    setSuccess("");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false
    });
  };

  // FORGOT PASSWORD PAGE
  if (showForgotPassword) {
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

            {success && (
              <div className="message success-message">
                ✓ {success}
              </div>
            )}

            {error && (
              <div className="message error-message">
                ✗ {error}
              </div>
            )}

            <form onSubmit={handleForgotPassword}>
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="signup" style={{ marginTop: '15px' }}>
              Remember your password? 
              <span onClick={backToLogin}> Sign in</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // MAIN LOGIN / SIGNUP PAGE
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
          <h2>{isSignUp ? "Sign up" : "Sign in"}</h2>

          {success && (
            <div className="message success-message">
              ✓ {success}
            </div>
          )}

          {error && (
            <div className="message error-message">
              ✗ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <input 
                type="text" 
                name="name"
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={loading}
                minLength={2}
              />
            )}
            
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              minLength={6}
              title="Password must be at least 6 characters"
            />

            {!isSignUp && (
              <div className="options">
                <label>
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    disabled={loading}
                  /> Remember me
                </label>
                <button
                  type="button"
                  onClick={showForgotPasswordForm}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4e3a18',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    padding: 0,
                    font: 'inherit',
                    fontSize: '14px'
                  }}
                  onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? (
                isSignUp ? "Creating account..." : "Signing in..."
              ) : (
                isSignUp ? "Sign up" : "Sign in"
              )}
            </button>
          </form>

          <p className="signup">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <span onClick={toggleAuthMode}>
              {isSignUp ? "Sign in" : "Sign up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;