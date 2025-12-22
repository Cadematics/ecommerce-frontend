import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Auth.css";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect away from register
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      await register(
        {
          username,
          email,
          password,
          password2: confirmPassword,
        }
      );

      


      toast.success("Account created successfully");
      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.detail ||
        "Registration failed";

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
        <h2>Register</h2>

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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
