import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Artilharia from "./pages/Artilharia";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Artilharia />} />
        <Route path="/artilharia" element={<Artilharia />} />
        <Route path="/admin" element={<Admin />} />
        {/* Caso queira redirecionar rotas desconhecidas para artilharia */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
