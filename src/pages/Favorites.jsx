import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Favorites.css";

export default function Favorites() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    fetch(`http://localhost:8080/favorites/${user.id}`)
      .then((r) => r.json())
      .then((data) => setFavorites(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  async function handleRemove(listingId) {
    try {
      await fetch(`http://localhost:8080/favorites?userId=${user.id}&listingId=${listingId}`, { method: "DELETE" });
      setFavorites((prev) => prev.filter((f) => f.id !== listingId));
    } catch {}
  }

  return (
    <div className="page">
      <Navbar />
      <main className="page-content">
        <section className="page-hero">
          <p className="page-label">Saved Items</p>
          <h1>Favorites</h1>
          <p className="page-subtext">
            Keep track of listings you want to revisit or buy later.
          </p>
        </section>

        {loading ? (
          <div className="empty-state"><p>Loading favorites...</p></div>
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🤍</div>
            <h2>No favorites yet</h2>
            <p>Save listings while browsing and they'll appear here.</p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((item) => (
              <div key={item.id} className="fav-card">
                <div className="fav-card-top">
                  <span className="fav-category">{item.categoryName || "Uncategorized"}</span>
                  <button className="remove-btn" onClick={() => handleRemove(item.id)} title="Remove from favorites">
                    ♥
                  </button>
                </div>
                <h3 className="fav-title">{item.title}</h3>
                {item.description && <p className="fav-desc">{item.description}</p>}
                <div className="fav-footer">
                  <p className="fav-price">${item.price}</p>
                  <p className="fav-seller">by {item.sellerName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
