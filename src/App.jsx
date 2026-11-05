import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/401" element={<ErrorPage status={401} />} />
        <Route path="/403" element={<ErrorPage status={403} />} />
        <Route path="/500" element={<ErrorPage status={500} />} />
        <Route path="*" element={<ErrorPage status={404} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
