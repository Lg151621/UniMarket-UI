import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./MyListings.css";

export default function MyListings() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", price: "", categoryId: "" });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }

    Promise.all([
      fetch("http://localhost:8080/categories").then((r) => r.json()),
      fetch(`http://localhost:8080/listings?sellerId=${user.id}`).then((r) => r.json()),
    ]).then(([cats, lists]) => {
      setCategories(cats);
      setListings(lists);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user, navigate]);

  if (!user) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.title || !form.price || !form.categoryId) {
      setFormError("Title, price, and category are required.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: user.id,
          categoryId: parseInt(form.categoryId),
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || "Failed to create listing"); return; }
      setListings((prev) => [data, ...prev]);
      setForm({ title: "", description: "", price: "", categoryId: "" });
      setFormError("");
      setShowForm(false);
    } catch {
      setFormError("Unable to connect to the server");
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`http://localhost:8080/listings/${id}`, { method: "DELETE" });
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch {}
  }

  return (
    <div className="page">
      <Navbar />
      <main className="page-content">
        <section className="page-hero">
          <p className="page-label">Your Account</p>
          <h1>My Listings</h1>
          <p className="page-subtext">
            Manage everything you've posted for sale on campus.
          </p>
        </section>

        <div className="listings-toolbar">
          <button className="btn-white" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "+ New Listing"}
          </button>
        </div>

        {showForm && (
          <form className="listing-form" onSubmit={handleCreate}>
            <h3>Create a Listing</h3>
            <div className="form-group">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="What are you selling?" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the item..." rows={3} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price ($)</label>
                <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {formError && <p className="form-error">{formError}</p>}
            <button className="btn-white" type="submit">Post Listing</button>
          </form>
        )}

        {loading ? (
          <div className="empty-state"><p>Loading your listings...</p></div>
        ) : listings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h2>No listings yet</h2>
            <p>Post your first item and start selling to your campus community.</p>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <div key={listing.id} className="listing-card">
                <div className="listing-card-top">
                  <span className="listing-category">{listing.categoryName}</span>
                  <button className="delete-btn" onClick={() => handleDelete(listing.id)}>✕</button>
                </div>
                <h3 className="listing-title">{listing.title}</h3>
                {listing.description && <p className="listing-desc">{listing.description}</p>}
                <p className="listing-price">${listing.price}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
