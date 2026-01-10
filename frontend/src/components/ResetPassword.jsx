import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "../AuthPage.css";

function ResetPassword() {
    const [searchParams] = useSearchParams(); // Get URL parameters
    const navigate = useNavigate(); // For navigation
    const token = searchParams.get("token"); // Get token from URL

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [tokenValid, setTokenValid] = useState(false);

    const API_BASE_URL = "http://localhost:8080/api/auth";

    // Verify token when page loads
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setError("Invalid reset link");
                setVerifying(false);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/verify-reset-token`, {
                    params: { token }
                });

                if (response.data.valid) {
                    setTokenValid(true);
                } else {
                    setError(response.data.message || "Invalid or expired reset link");
                }
            } catch (err) {
                setError(
                    err.response?.data?.message || "Invalid or expired reset link"
                );
            } finally {
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        // Validation
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/reset-password`, {
                token: token,
                newPassword: newPassword
            });

            setMessage(response.data.message || "Password reset successfully!");
            setNewPassword("");
            setConfirmPassword("");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Failed to reset password");
            } else if (err.request) {
                setError("Cannot connect to server. Please try again later.");
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    // Loading state while verifying token
    if (verifying) {
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
                        <h2>Verifying Reset Link...</h2>
                        <p style={{ color: '#666', marginTop: '10px' }}>Please wait while we verify your reset link</p>
                    </div>
                </div>
            </div>
        );
    }

    // Invalid token state
    if (!tokenValid) {
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
                        <h2>Invalid Reset Link</h2>
                        <div className="message error-message" style={{ marginBottom: '20px' }}>
                            ✗ {error}
                        </div>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                            This reset link may have expired or already been used. Please request a new one.
                        </p>
                        <button
                            onClick={() => navigate("/forgot-password")}
                            style={{ marginBottom: '15px' }}
                        >
                            Request New Reset Link
                        </button>
                        <p className="signup">
                            Remember your password?
                            <span onClick={() => navigate("/login")}> Sign in</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Valid token - show reset form
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
                        Enter your new password below
                    </p>

                    {/* Success Message */}
                    {message && (
                        <div className="message success-message">
                            ✓ {message}
                            <p style={{ fontSize: '13px', marginTop: '8px', marginBottom: '0' }}>Redirecting to login...</p>
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
                            type="password"
                            name="newPassword"
                            placeholder="New Password (min 6 characters)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={loading}
                            minLength="6"
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading}
                            minLength="6"
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Resetting Password..." : "Reset Password"}
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

export default ResetPassword;