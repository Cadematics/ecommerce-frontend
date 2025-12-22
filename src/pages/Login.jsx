import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Auth.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect away from login
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    setSubmitting(true);

    try {
      await login({ username, password });
      toast.success("Logged in successfully");
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Invalid username or password";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Avoid flicker while auth state is resolving
  if (loading) {
    return null;
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
