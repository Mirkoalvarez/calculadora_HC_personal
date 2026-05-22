import { useCalculator } from "../../context/CalculatorContext";
import type { TransporteLaboralInput, TransporteEsporadicoInput } from "../../types";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";

export default function TransporteStep() {
  const { opciones, state, updateState } = useCalculator();
  if (!opciones) return null;

  const addLaboral = () => {
    updateState({ transporteLaboral: [...state.transporteLaboral, { vehiculo: opciones.vehiculos[0], km_ida: 0, km_vuelta: 0 }] });
  };
  const updateLaboral = (i: number, patch: Partial<TransporteLaboralInput>) => {
    const items = [...state.transporteLaboral];
    items[i] = { ...items[i], ...patch };
    updateState({ transporteLaboral: items });
  };
  const removeLaboral = (i: number) => updateState({ transporteLaboral: state.transporteLaboral.filter((_, idx) => idx !== i) });

  const addEsporadico = () => {
    updateState({ transporteEsporadico: [...state.transporteEsporadico, { vehiculo: opciones.vehiculos[0], km_totales: 0 }] });
  };
  const updateEsporadico = (i: number, patch: Partial<TransporteEsporadicoInput>) => {
    const items = [...state.transporteEsporadico];
    items[i] = { ...items[i], ...patch };
    updateState({ transporteEsporadico: items });
  };
  const removeEsporadico = (i: number) => updateState({ transporteEsporadico: state.transporteEsporadico.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-6">
      <section className="liquid-glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-xl text-aether-800">🚗 Transporte Laboral</h3>
            <p className="text-xs text-surface-400 mt-0.5">Ida y vuelta diaria — {opciones.constantes.dias_laborales} días/año</p>
          </div>
          <button onClick={addLaboral} className="btn-primary text-xs flex items-center gap-1 py-1.5 px-3">
            <HiOutlinePlus className="w-3.5 h-3.5" /> Agregar
          </button>
        </div>
        {state.transporteLaboral.length === 0 ? (
          <p className="text-surface-400 text-sm text-center py-6 border border-dashed border-surface-200 rounded-2xl">Sin transporte laboral registrado.</p>
        ) : (
          <div className="space-y-3">
            {state.transporteLaboral.map((item, i) => (
              <div key={i} className="liquid-glass-strong p-3 flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[0.65rem] text-surface-500 mb-1 uppercase">Vehículo</label>
                  <select value={item.vehiculo} onChange={(e) => updateLaboral(i, { vehiculo: e.target.value })} className="input-field text-sm">
                    {opciones.vehiculos.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-[0.65rem] text-surface-500 mb-1 uppercase">Km ida</label>
                  <input type="number" min={0} step={0.5} value={item.km_ida} onChange={(e) => updateLaboral(i, { km_ida: +e.target.value })} className="input-field text-sm text-center" />
                </div>
                <div className="w-24">
                  <label className="block text-[0.65rem] text-surface-500 mb-1 uppercase">Km vuelta</label>
                  <input type="number" min={0} step={0.5} value={item.km_vuelta} onChange={(e) => updateLaboral(i, { km_vuelta: +e.target.value })} className="input-field text-sm text-center" />
                </div>
                <button onClick={() => removeLaboral(i)} className="btn-danger flex items-center gap-1 mb-0.5"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="liquid-glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-xl text-aether-800">✈️ Transporte Esporádico</h3>
            <p className="text-xs text-surface-400 mt-0.5">Viajes puntuales</p>
          </div>
          <button onClick={addEsporadico} className="btn-primary text-xs flex items-center gap-1 py-1.5 px-3">
            <HiOutlinePlus className="w-3.5 h-3.5" /> Agregar
          </button>
        </div>
        {state.transporteEsporadico.length === 0 ? (
          <p className="text-surface-400 text-sm text-center py-6 border border-dashed border-surface-200 rounded-2xl">Sin viajes esporádicos.</p>
        ) : (
          <div className="space-y-3">
            {state.transporteEsporadico.map((item, i) => (
              <div key={i} className="liquid-glass-strong p-3 flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-[0.65rem] text-surface-500 mb-1 uppercase">Vehículo</label>
                  <select value={item.vehiculo} onChange={(e) => updateEsporadico(i, { vehiculo: e.target.value })} className="input-field text-sm">
                    {opciones.vehiculos.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div className="w-28">
                  <label className="block text-[0.65rem] text-surface-500 mb-1 uppercase">Km totales</label>
                  <input type="number" min={0} value={item.km_totales} onChange={(e) => updateEsporadico(i, { km_totales: +e.target.value })} className="input-field text-sm text-center" />
                </div>
                <button onClick={() => removeEsporadico(i)} className="btn-danger flex items-center gap-1 mb-0.5"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
