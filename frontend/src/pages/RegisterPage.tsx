import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

export default function RegisterPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await register(username, email, password);
    } catch (err: any) {
      const data = err.response?.data;
      const msg = data?.username?.[0] || data?.email?.[0] || data?.password?.[0] || "Error al registrar.";
      setError(msg);
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
        className="glass-card glow-green p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">🌱</span>
          <h2 className="font-heading text-3xl text-forest-300">Crear Cuenta</h2>
          <p className="text-carbon-400 text-sm mt-1">
            Registrate para guardar tus cálculos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-carbon-400 mb-1.5 font-medium uppercase tracking-wider">Usuario</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" placeholder="tu_usuario" required autoFocus />
          </div>
          <div>
            <label className="block text-xs text-carbon-400 mb-1.5 font-medium uppercase tracking-wider">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="tu@email.com" required />
          </div>
          <div>
            <label className="block text-xs text-carbon-400 mb-1.5 font-medium uppercase tracking-wider">Contraseña</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-10" placeholder="Mínimo 8 caracteres" required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-carbon-500 hover:text-carbon-300">
                {showPw ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-md">
              {error}
            </motion.p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full text-sm">
            {loading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>
        </form>

        <p className="text-center text-carbon-500 text-sm mt-6">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="text-forest-400 hover:text-forest-300 font-medium">Ingresá</Link>
        </p>
      </motion.div>
    </div>
  );
}
