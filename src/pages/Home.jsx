import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="home-page">
      <Navbar />

      <main className="home-content">
        <section className="home-hero">
          <p className="home-label">Campus Marketplace</p>
          <h1>Welcome back, {user.firstName}</h1>
          <p className="home-subtext">
            Buy, sell, and connect with students in your university community.
          </p>
        </section>

        <section className="home-grid">
          <div className="home-card">
            <h2>Browse Listings</h2>
            <p>Explore items posted by students across campus.</p>
          </div>

          <div className="home-card">
            <h2>My Listings</h2>
            <p>Manage the products and items you have posted.</p>
          </div>

          <div className="home-card">
            <h2>Messages</h2>
            <p>Stay in touch with buyers and sellers in one place.</p>
          </div>

          <div className="home-card">
            <h2>Favorites</h2>
            <p>Keep track of listings you want to revisit later.</p>
          </div>
        </section>
      </main>
    </div>
  );
}