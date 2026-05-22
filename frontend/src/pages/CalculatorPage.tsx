import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalculator } from "../context/CalculatorContext";
import ArtefactosStep from "../components/steps/ArtefactosStep";
import ClimaStep from "../components/steps/ClimaStep";
import TransporteStep from "../components/steps/TransporteStep";
import ResultadosStep from "../components/steps/ResultadosStep";
import { HiOutlineBolt, HiOutlineSun, HiOutlineTruck, HiOutlineChartBar } from "react-icons/hi2";

const STEPS = [
  { id: 0, label: "Artefactos", icon: HiOutlineBolt, emoji: "🔌" },
  { id: 1, label: "Clima", icon: HiOutlineSun, emoji: "🌡️" },
  { id: 2, label: "Transporte", icon: HiOutlineTruck, emoji: "🚗" },
  { id: 3, label: "Resultados", icon: HiOutlineChartBar, emoji: "📊" },
];

export default function CalculatorPage() {
  const [step, setStep] = useState(0);
  const { calcular, calculating, resultado } = useCalculator();

  const goNext = async () => {
    if (step < 2) {
      setStep(step + 1);
    } else if (step === 2) {
      await calcular();
      setStep(3);
    }
  };

  const goPrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="liquid-glass p-4">
        <div className="flex items-center justify-between relative">
          {/* Track line (spans center-to-center of first and last circles) */}
          <div className="absolute top-5 h-0.5 bg-surface-200" style={{ left: '1.25rem', right: '1.25rem' }} />
          <div
            className="absolute top-5 h-0.5 bg-gradient-to-r from-aether-600 to-aether-400 transition-all duration-500"
            style={{ left: '1.25rem', width: `calc(${(step / 3) * 100}% - ${(step / 3) * 2.5}rem)` }}
          />
          {STEPS.map((s) => (
            <button
              key={s.id}
              onClick={() => s.id <= (resultado ? 3 : step) && setStep(s.id)}
              className={`relative z-10 flex flex-col items-center gap-1.5 transition-all ${s.id <= step ? "cursor-pointer" : "cursor-default"
                }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-base transition-all duration-300 ${s.id === step
                    ? "bg-aether-500 text-white shadow-lg shadow-aether-500/30 scale-110"
                    : s.id < step
                      ? "bg-aether-100 text-aether-600 border border-aether-300"
                      : "bg-surface-100 text-surface-400 border border-surface-200"
                  }`}
              >
                {s.emoji}
              </div>
              <span
                className={`text-[0.65rem] font-medium transition-colors ${s.id === step ? "text-aether-700" : "text-surface-400"
                  }`}
              >
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {step === 0 && <ArtefactosStep />}
          {step === 1 && <ClimaStep />}
          {step === 2 && <TransporteStep />}
          {step === 3 && <ResultadosStep />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {step < 3 && (
        <div className="flex justify-between">
          <button onClick={goPrev} disabled={step === 0} className="btn-secondary text-sm disabled:opacity-30">
            ← Anterior
          </button>
          <button onClick={goNext} disabled={calculating} className="btn-primary text-sm">
            {step === 2
              ? calculating
                ? "Calculando..."
                : "Calcular mi huella 🌍"
              : "Siguiente →"}
          </button>
        </div>
      )}
    </div>
  );
}
