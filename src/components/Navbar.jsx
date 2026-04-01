import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/home" className="navbar-logo">
          UniMarket
        </Link>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          className="navbar-search"
          placeholder="Search listings, categories, or campus items"
        />
      </div>

      <div className="navbar-right">
        {user && <span className="navbar-user">Hi, {user.firstName}</span>}
        <button className="navbar-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}