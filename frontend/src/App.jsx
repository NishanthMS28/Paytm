import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
