import { useState } from "react";
import "./Login.css";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    universityId: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          universityId: Number(formData.universityId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      setMessage(data.message || "User registered");
      console.log("Registered user:", data.user);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        universityId: "",
      });
    } catch (err) {
      console.error("Register request failed:", err);
      setError("Unable to connect to the server");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h1>Create Account</h1>
          <p>Join UniMarket and start buying, selling, and connecting on campus.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">School Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your school email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="universityId">University ID</label>
            <input
              id="universityId"
              name="universityId"
              type="number"
              value={formData.universityId}
              onChange={handleChange}
              placeholder="Enter your university ID"
              required
            />
          </div>

          <button className="login-button" type="submit">
            Create Account
          </button>
        </form>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="login-footer">
          Already have an account? <a href="/login">Log in</a>
        </div>
      </div>
    </div>
  );
}