import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="liquid-glass glow-aether p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">🌿</span>
          <h2 className="font-heading text-3xl text-aether-800">Iniciar Sesión</h2>
          <p className="text-surface-500 text-sm mt-1">
            Calculá tu huella de carbono personal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-surface-500 mb-1.5 font-medium uppercase tracking-wider">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="tu_usuario"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs text-surface-500 mb-1.5 font-medium uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                {showPw ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm bg-red-500/10 px-3 py-2 rounded-xl"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-sm"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-surface-500 text-sm mt-6">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-aether-600 hover:text-aether-700 font-medium">
            Registrate
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
