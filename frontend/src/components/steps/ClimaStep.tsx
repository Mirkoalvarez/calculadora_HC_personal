import { useCalculator } from "../../context/CalculatorContext";
import type { CalefaccionInput, RefrigeracionInput } from "../../types";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";

export default function ClimaStep() {
  const { opciones, state, updateState } = useCalculator();
  if (!opciones) return null;

  /* ── Calefacción ── */
  const addCalef = () => {
    updateState({ calefaccion: [...state.calefaccion, { aparato: opciones.calefaccion[0], horas_dia: 1 }] });
  };
  const updateCalef = (i: number, patch: Partial<CalefaccionInput>) => {
    const items = [...state.calefaccion];
    items[i] = { ...items[i], ...patch };
    updateState({ calefaccion: items });
  };
  const removeCalef = (i: number) => updateState({ calefaccion: state.calefaccion.filter((_, idx) => idx !== i) });

  /* ── Refrigeración ── */
  const addRefrig = () => {
    updateState({ refrigeracion: [...state.refrigeracion, { aparato: opciones.refrigeracion[0], horas_dia: 1 }] });
  };
  const updateRefrig = (i: number, patch: Partial<RefrigeracionInput>) => {
    const items = [...state.refrigeracion];
    items[i] = { ...items[i], ...patch };
    updateState({ refrigeracion: items });
  };
  const removeRefrig = (i: number) => updateState({ refrigeracion: state.refrigeracion.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-6">
      {/* Calefacción */}
      <section className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-xl text-forest-300">🔥 Calefacción</h3>
            <p className="text-xs text-carbon-500 mt-0.5">Temporada de invierno — {opciones.constantes.dias_invierno} días</p>
          </div>
          <button onClick={addCalef} className="btn-primary text-xs flex items-center gap-1 py-1.5 px-3">
            <HiOutlinePlus className="w-3.5 h-3.5" /> Agregar
          </button>
        </div>

        {state.calefaccion.length === 0 && (
          <p className="text-carbon-500 text-sm text-center py-6 border border-dashed border-carbon-700 rounded-lg">
            Sin calefacción registrada.
          </p>
        )}

        <div className="space-y-3">
          {state.calefaccion.map((item, i) => (
            <div key={i} className="glass-card-light p-3 flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-[0.65rem] text-carbon-500 mb-1 uppercase">Aparato</label>
                <select value={item.aparato} onChange={(e) => updateCalef(i, { aparato: e.target.value })} className="input-field text-sm">
                  {opciones.calefaccion.map((a) => (<option key={a} value={a}>{a}</option>))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-[0.65rem] text-carbon-500 mb-1 uppercase">Hrs/día</label>
                <input type="number" min={0} step={0.5} value={item.horas_dia} onChange={(e) => updateCalef(i, { horas_dia: +e.target.value })} className="input-field text-sm text-center" />
              </div>
              <button onClick={() => removeCalef(i)} className="btn-danger flex items-center gap-1 mb-0.5">
                <HiOutlineTrash className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Refrigeración */}
      <section className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-xl text-forest-300">❄️ Refrigeración</h3>
            <p className="text-xs text-carbon-500 mt-0.5">Temporada de verano — {opciones.constantes.dias_verano} días</p>
          </div>
          <button onClick={addRefrig} className="btn-primary text-xs flex items-center gap-1 py-1.5 px-3">
            <HiOutlinePlus className="w-3.5 h-3.5" /> Agregar
          </button>
        </div>

        {state.refrigeracion.length === 0 && (
          <p className="text-carbon-500 text-sm text-center py-6 border border-dashed border-carbon-700 rounded-lg">
            Sin refrigeración registrada.
          </p>
        )}

        <div className="space-y-3">
          {state.refrigeracion.map((item, i) => (
            <div key={i} className="glass-card-light p-3 flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-[0.65rem] text-carbon-500 mb-1 uppercase">Aparato</label>
                <select value={item.aparato} onChange={(e) => updateRefrig(i, { aparato: e.target.value })} className="input-field text-sm">
                  {opciones.refrigeracion.map((a) => (<option key={a} value={a}>{a}</option>))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-[0.65rem] text-carbon-500 mb-1 uppercase">Hrs/día</label>
                <input type="number" min={0} step={0.5} value={item.horas_dia} onChange={(e) => updateRefrig(i, { horas_dia: +e.target.value })} className="input-field text-sm text-center" />
              </div>
              <button onClick={() => removeRefrig(i)} className="btn-danger flex items-center gap-1 mb-0.5">
                <HiOutlineTrash className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
