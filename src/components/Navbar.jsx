import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>

      {isAuthenticated ? (
        <>
          <span style={{ marginLeft: "1rem" }}>
            Hello, {user?.username}
          </span>
          <button
            onClick={handleLogout}
            style={{ marginLeft: "1rem" }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register" style={{ marginLeft: "1rem" }}>
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
