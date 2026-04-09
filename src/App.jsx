import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import BrowseListings from "./pages/BrowseListings";
import MyListings from "./pages/MyListings";
import Messages from "./pages/Messages";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route → go to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/browse" element={<BrowseListings />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;