import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CalculatorPage from "./pages/CalculatorPage";
import HistorialPage from "./pages/HistorialPage";
import { AnimatedGridPattern } from "./components/ui/animated-grid-pattern";
import { cn } from "./lib/utils";

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf7]">
        <div className="w-8 h-8 border-2 border-aether-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Grid Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.08}
        duration={3}
        repeatDelay={1}
        className={cn(
          "text-aether-500",
          "fill-aether-400/20 stroke-aether-300/30",
          "[mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />

      <div className="relative z-10">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
            />
            <Route
              path="/"
              element={isAuthenticated ? <CalculatorPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/historial"
              element={isAuthenticated ? <HistorialPage /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
