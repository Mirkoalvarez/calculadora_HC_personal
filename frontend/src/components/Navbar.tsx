import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { HiOutlineCalculator, HiOutlineClock, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card mx-4 mt-4 px-6 py-3 flex items-center justify-between sticky top-4 z-50"
    >
      <Link to="/" className="flex items-center gap-3 group">
        <span className="text-2xl">🌿</span>
        <div>
          <h1 className="font-heading text-lg text-forest-300 group-hover:text-forest-200 transition-colors leading-tight">
            Calculadora HC
          </h1>
          <p className="text-[0.65rem] text-carbon-500 tracking-wider uppercase">
            Huella de Carbono Personal
          </p>
        </div>
      </Link>

      {isAuthenticated && (
        <div className="flex items-center gap-2">
          <NavLink to="/" active={location.pathname === "/"}>
            <HiOutlineCalculator className="w-4 h-4" />
            <span className="hidden sm:inline">Calculadora</span>
          </NavLink>
          <NavLink to="/historial" active={location.pathname === "/historial"}>
            <HiOutlineClock className="w-4 h-4" />
            <span className="hidden sm:inline">Historial</span>
          </NavLink>
          <div className="w-px h-6 bg-carbon-700 mx-1" />
          <span className="text-xs text-carbon-400 hidden md:block">{user?.username}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-carbon-400 hover:text-red-400 transition-colors px-2 py-1.5 rounded-md hover:bg-red-500/10"
            title="Cerrar sesión"
          >
            <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.nav>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
        active
          ? "bg-forest-500/15 text-forest-400"
          : "text-carbon-400 hover:text-carbon-200 hover:bg-carbon-800/50"
      }`}
    >
      {children}
    </Link>
  );
}
