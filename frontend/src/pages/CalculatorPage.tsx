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
      <div className="glass-card p-4">
        <div className="flex items-center justify-between relative">
          {/* Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-carbon-800 mx-12" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-forest-600 to-forest-400 mx-12 transition-all duration-500"
            style={{ width: `${(step / 3) * (100 - 14)}%` }}
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
                    ? "bg-forest-500 text-white shadow-lg shadow-forest-500/30 scale-110"
                    : s.id < step
                      ? "bg-forest-600/30 text-forest-400 border border-forest-500/40"
                      : "bg-carbon-800 text-carbon-500 border border-carbon-700"
                  }`}
              >
                {s.emoji}
              </div>
              <span
                className={`text-[0.65rem] font-medium transition-colors ${s.id === step ? "text-forest-300" : "text-carbon-500"
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
