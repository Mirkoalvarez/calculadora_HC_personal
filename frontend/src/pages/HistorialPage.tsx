import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { calculatorApi } from "../services/api";
import type { HistorialItem } from "../types";
import { HiOutlineTrash, HiOutlineArrowPath } from "react-icons/hi2";

export default function HistorialPage() {
  const [items, setItems] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistorial = () => {
    setLoading(true);
    calculatorApi
      .historial()
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHistorial(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este cálculo del historial?")) return;
    await calculatorApi.historialDelete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-forest-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl text-forest-300">📋 Historial</h2>
          <p className="text-carbon-500 text-sm mt-1">Tus cálculos guardados</p>
        </div>
        <button onClick={fetchHistorial} className="btn-secondary text-xs flex items-center gap-1.5">
          <HiOutlineArrowPath className="w-3.5 h-3.5" /> Actualizar
        </button>
      </div>

      {items.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <span className="text-5xl block mb-4">🌱</span>
          <p className="text-carbon-400">Aún no tenés cálculos guardados.</p>
          <p className="text-carbon-500 text-sm mt-1">Usá la calculadora para crear tu primer registro.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-forest-500/10 flex items-center justify-center text-xl shrink-0">
                  🌍
                </div>
                <div className="min-w-0">
                  <p className="text-carbon-200 font-medium truncate">
                    {item.label || `Cálculo #${item.id}`}
                  </p>
                  <p className="text-xs text-carbon-500">
                    {new Date(item.created_at).toLocaleDateString("es-AR", {
                      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-lg font-heading text-forest-400">
                  {item.total_kgco2.toLocaleString("es-AR", { maximumFractionDigits: 1 })}
                </p>
                <p className="text-[0.65rem] text-carbon-500">kgCO₂eq</p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm text-carbon-300">🌳 {item.total_arboles.toLocaleString("es-AR", { maximumFractionDigits: 1 })}</p>
                <p className="text-[0.65rem] text-carbon-500">árboles</p>
              </div>

              <button onClick={() => handleDelete(item.id)} className="btn-danger shrink-0">
                <HiOutlineTrash className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
