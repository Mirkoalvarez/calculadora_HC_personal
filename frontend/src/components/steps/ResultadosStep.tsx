import { motion } from "framer-motion";
import { useCalculator } from "../../context/CalculatorContext";
import { useNavigate } from "react-router-dom";

export default function ResultadosStep() {
  const { resultado, error, resetState } = useCalculator();
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <span className="text-5xl block mb-4">⚠️</span>
        <h3 className="font-heading text-2xl text-red-400 mb-2">Error en el cálculo</h3>
        <p className="text-carbon-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!resultado) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-8 h-8 border-2 border-forest-500 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const d = resultado.detalle;
  const total = resultado.total_kgco2;
  const segments = [
    { label: "Artefactos", value: d.artefactos_kgco2, color: "bg-emerald-500", emoji: "🔌" },
    { label: "Clima", value: d.clima_kgco2, color: "bg-sky-500", emoji: "🌡️" },
    { label: "Transporte", value: d.transporte_kgco2, color: "bg-amber-500", emoji: "🚗" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Result */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="glass-card glow-green p-8 text-center"
      >
        <p className="text-carbon-400 text-sm uppercase tracking-widest mb-2">Tu huella de carbono anual</p>
        <h2 className="font-heading text-6xl text-forest-300 mb-1">
          {total.toLocaleString("es-AR", { maximumFractionDigits: 1 })}
        </h2>
        <p className="text-carbon-400 text-lg">kgCO₂eq / año</p>

        <div className="mt-6 pt-6 border-t border-carbon-800 flex items-center justify-center gap-3">
          <span className="text-3xl">🌳</span>
          <div>
            <p className="text-2xl font-heading text-forest-400">
              {resultado.total_arboles.toLocaleString("es-AR", { maximumFractionDigits: 1 })}
            </p>
            <p className="text-xs text-carbon-500">árboles necesarios para compensar</p>
          </div>
        </div>
      </motion.div>

      {/* Distribution Bar */}
      <div className="glass-card p-6">
        <h3 className="font-heading text-lg text-carbon-200 mb-4">Distribución por categoría</h3>
        <div className="h-4 rounded-full overflow-hidden flex bg-carbon-800">
          {segments.map((seg) => {
            const pct = total > 0 ? (seg.value / total) * 100 : 0;
            return pct > 0 ? (
              <motion.div
                key={seg.label}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`${seg.color} relative group`}
                title={`${seg.label}: ${pct.toFixed(1)}%`}
              />
            ) : null;
          })}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {segments.map((seg) => {
            const pct = total > 0 ? (seg.value / total) * 100 : 0;
            return (
              <div key={seg.label} className="text-center">
                <span className="text-2xl">{seg.emoji}</span>
                <p className="text-sm text-carbon-300 font-medium mt-1">{seg.label}</p>
                <p className="text-lg font-heading text-carbon-100">
                  {seg.value.toLocaleString("es-AR", { maximumFractionDigits: 1 })}
                </p>
                <p className="text-xs text-carbon-500">{pct.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <button onClick={() => { resetState(); }} className="btn-secondary text-sm">
          🔄 Nuevo cálculo
        </button>
        <button onClick={() => navigate("/historial")} className="btn-primary text-sm">
          📋 Ver historial
        </button>
      </div>
    </div>
  );
}
