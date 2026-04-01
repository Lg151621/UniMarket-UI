import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;