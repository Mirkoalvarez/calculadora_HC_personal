import { useCalculator } from "../../context/CalculatorContext";
import type { ElectrodomesticoInput, LuminariaInput } from "../../types";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";

export default function ArtefactosStep() {
  const { opciones, state, updateState } = useCalculator();
  if (!opciones) return <p className="text-surface-400">Cargando opciones...</p>;

  const addElectro = () => {
    updateState({
      electrodomesticos: [
        ...state.electrodomesticos,
        { aparato: opciones.electrodomesticos[0], cantidad: 1, horas_dia: 1 },
      ],
    });
  };

  const updateElectro = (i: number, patch: Partial<ElectrodomesticoInput>) => {
    const items = [...state.electrodomesticos];
    items[i] = { ...items[i], ...patch };
    updateState({ electrodomesticos: items });
  };

  const removeElectro = (i: number) => {
    updateState({ electrodomesticos: state.electrodomesticos.filter((_, idx) => idx !== i) });
  };

  const addLuminaria = () => {
    const tipo = opciones.luminarias.tipos[0];
    const potencia = opciones.luminarias.potencias_por_tipo[tipo][0];
    updateState({
      luminarias: [
        ...state.luminarias,
        { tipo, potencia, cantidad: 1, uso_diario: "1 Hora" },
      ],
    });
  };

  const updateLuminaria = (i: number, patch: Partial<LuminariaInput>) => {
    const items = [...state.luminarias];
    const updated = { ...items[i], ...patch };
    // Si cambia el tipo, resetear potencia al primer valor válido
    if (patch.tipo && patch.tipo !== items[i].tipo) {
      updated.potencia = opciones.luminarias.potencias_por_tipo[patch.tipo][0];
    }
    items[i] = updated;
    updateState({ luminarias: items });
  };

  const removeLuminaria = (i: number) => {
    updateState({ luminarias: state.luminarias.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-6">
      {/* Electrodomésticos */}
      <section className="liquid-glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-xl text-aether-800">🔌 Electrodomésticos</h3>
            <p className="text-xs text-surface-400 mt-0.5">Equipos de oficina y hogar</p>
          </div>
          <button onClick={addElectro} className="btn-primary text-xs flex items-center gap-1 py-1.5 px-3">
            <HiOutlinePlus className="w-3.5 h-3.5" /> Agregar
          </button>
        </div>

        {state.electrodomesticos.length === 0 && (
          <p className="text-surface-400 text-sm text-center py-6 border border-dashed border-surface-200 rounded-2xl">
            Sin electrodomésticos. Hacé click en "Agregar" para empezar.
          </p>
        )}

        <div className="space-y-3">
          {state.electrodomesticos.map((item, i) => (
            <div key={i} className="liquid-glass-strong p-3 flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-[0.65rem] text-surface-500 mb-1 uppercase">Aparato</label>
                <select value={item.aparato} onChange={(e) => updateElectro(i, { aparato: e.target.value })} className="input-field text-sm">
                  {opciones.electrodomesticos.map((a) => (<option key={a} value={a}>{a}</option>))}
                </select>
              </div>
              <div className="w-20">
                <label className="block text-[0.65rem] text-surface-500 mb-1 uppercase">Cantidad</label>
                <input type="number" min={0} value={item.cantidad} onChange={(e) => updateElectro(i, { cantidad: +e.target.value })} className="input-field text-sm text-center" />
              </div>
              <div className="w-24">
                <label className="block text-[0.65rem] text-surface-500 mb-1 uppercase">Hrs/día</label>
                <input type="number" min={0} step={0.5} value={item.horas_dia} onChange={(e) => updateElectro(i, { horas_dia: +e.target.value })} className="input-field text-sm text-center" />
              </div>
              <button onClick={() => removeElectro(i)} className="btn-danger flex items-center gap-1 mb-0.5">
                <HiOutlineTrash className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Luminarias */}
      <section className="liquid-glass p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-xl text-aether-800">💡 Luminarias</h3>
            <p className="text-xs text-surface-400 mt-0.5">Lámparas y tubos</p>
          </div>
          <button onClick={addLuminaria} className="btn-primary text-xs flex items-center gap-1 py-1.5 px-3">
            <HiOutlinePlus className="w-3.5 h-3.5" /> Agregar
          </button>
        </div>

        {state.luminarias.length === 0 && (
          <p className="text-surface-400 text-sm text-center py-6 border border-dashed border-surface-200 rounded-2xl">
            Sin luminarias. Hacé click en "Agregar" para empezar.
          </p>
        )}

        <div className="space-y-3">
          {state.luminarias.map((item, i) => (
            <div key={i} className="liquid-glass-strong p-3 flex flex-wrap items-end gap-3">
              <div className="min-w-[120px] flex-1">
                <label className="block text-[0.65rem] text-surface-500 mb-1 uppercase">Tipo</label>
                <select value={item.tipo} onChange={(e) => updateLuminaria(i, { tipo: e.target.value })} className="input-field text-sm">
                  {opciones.luminarias.tipos.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-[0.65rem] text-surface-500 mb-1 uppercase">Potencia</label>
                <select value={item.potencia} onChange={(e) => updateLuminaria(i, { potencia: e.target.value })} className="input-field text-sm">
                  {(opciones.luminarias.potencias_por_tipo[item.tipo] || []).map((p) => (<option key={p} value={p}>{p}</option>))}
                </select>
              </div>
              <div className="w-20">
                <label className="block text-[0.65rem] text-surface-500 mb-1 uppercase">Cant.</label>
                <input type="number" min={0} value={item.cantidad} onChange={(e) => updateLuminaria(i, { cantidad: +e.target.value })} className="input-field text-sm text-center" />
              </div>
              <div className="min-w-[110px]">
                <label className="block text-[0.65rem] text-surface-500 mb-1 uppercase">Uso diario</label>
                <select value={item.uso_diario} onChange={(e) => updateLuminaria(i, { uso_diario: e.target.value })} className="input-field text-sm">
                  {opciones.horas_uso.map((h) => (<option key={h} value={h}>{h}</option>))}
                </select>
              </div>
              <button onClick={() => removeLuminaria(i)} className="btn-danger flex items-center gap-1 mb-0.5">
                <HiOutlineTrash className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
