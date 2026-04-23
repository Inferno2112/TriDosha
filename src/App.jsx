import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Chat from "./pages/Chat"
import History from "./pages/History"
import Result from "./pages/Result"
import Settings from "./pages/Settings"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/chat"
        element={<ProtectedRoute><Chat /></ProtectedRoute>}
      />
      <Route
        path="/history"
        element={<ProtectedRoute><History /></ProtectedRoute>}
      />
      <Route
        path="/result"
        element={<ProtectedRoute><Result /></ProtectedRoute>}
      />
      <Route
        path="/settings"
        element={<ProtectedRoute><Settings /></ProtectedRoute>}
      />
      <Route path="/dashboard" element={<Navigate to="/chat" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
