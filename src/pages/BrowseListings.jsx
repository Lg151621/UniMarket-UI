import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./BrowseListings.css";

export default function BrowseListings() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    Promise.all([
      fetch("http://localhost:8080/categories").then((r) => r.json()),
      fetch("http://localhost:8080/listings").then((r) => r.json()),
      fetch(`http://localhost:8080/favorites/${user.id}`).then((r) => r.json()),
    ]).then(([cats, lists, favs]) => {
      setCategories(cats);
      setListings(lists);
      setFavorites(new Set(favs.map((f) => f.id)));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  async function toggleFavorite(listingId) {
    const isFav = favorites.has(listingId);
    const url = `http://localhost:8080/favorites?userId=${user.id}&listingId=${listingId}`;
    try {
      await fetch(url, { method: isFav ? "DELETE" : "POST" });
      setFavorites((prev) => {
        const next = new Set(prev);
        isFav ? next.delete(listingId) : next.add(listingId);
        return next;
      });
    } catch {}
  }

  const filtered = listings.filter((l) => {
    const matchesCategory = selectedCategory === null || l.categoryId === selectedCategory;
    const matchesSearch = search === "" || l.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page">
      <Navbar />
      <main className="page-content">
        <section className="page-hero">
          <p className="page-label">Marketplace</p>
          <h1>Browse Listings</h1>
          <p className="page-subtext">
            Explore items posted by students across your campus community.
          </p>
        </section>

        <div className="browse-search-bar">
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="browse-search-input"
          />
        </div>

        {categories.length > 0 && (
          <div className="category-chips">
            <button
              className={`chip ${selectedCategory === null ? "chip-active" : ""}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`chip ${selectedCategory === cat.id ? "chip-active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="empty-state"><p>Loading listings...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛍️</div>
            <h2>No listings found</h2>
            <p>{listings.length === 0 ? "Be the first to post something for sale on campus." : "Try a different search or category."}</p>
          </div>
        ) : (
          <div className="listings-grid">
            {filtered.map((listing) => (
              <div key={listing.id} className="listing-card">
                <div className="listing-card-top">
                  <span className="listing-category">{listing.categoryName}</span>
                  <button
                    className={`fav-btn ${favorites.has(listing.id) ? "fav-active" : ""}`}
                    onClick={() => toggleFavorite(listing.id)}
                    title={favorites.has(listing.id) ? "Remove from favorites" : "Save to favorites"}
                  >
                    {favorites.has(listing.id) ? "♥" : "♡"}
                  </button>
                </div>
                <h3 className="listing-title">{listing.title}</h3>
                {listing.description && <p className="listing-desc">{listing.description}</p>}
                <div className="listing-footer">
                  <p className="listing-price">${listing.price}</p>
                  <p className="listing-seller">by {listing.sellerName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
