import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { calculatorApi } from "../services/api";
import type {
  OpcionesResponse,
  ElectrodomesticoInput,
  LuminariaInput,
  CalefaccionInput,
  RefrigeracionInput,
  TransporteLaboralInput,
  TransporteEsporadicoInput,
  CalcularResponse,
} from "../types";

interface CalculatorState {
  electrodomesticos: ElectrodomesticoInput[];
  luminarias: LuminariaInput[];
  calefaccion: CalefaccionInput[];
  refrigeracion: RefrigeracionInput[];
  transporteLaboral: TransporteLaboralInput[];
  transporteEsporadico: TransporteEsporadicoInput[];
}

interface CalculatorContextType {
  opciones: OpcionesResponse | null;
  state: CalculatorState;
  resultado: CalcularResponse | null;
  calculating: boolean;
  error: string | null;
  updateState: (patch: Partial<CalculatorState>) => void;
  resetState: () => void;
  calcular: () => Promise<void>;
}

const INITIAL_STATE: CalculatorState = {
  electrodomesticos: [],
  luminarias: [],
  calefaccion: [],
  refrigeracion: [],
  transporteLaboral: [],
  transporteEsporadico: [],
};

const CalculatorContext = createContext<CalculatorContextType | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [opciones, setOpciones] = useState<OpcionesResponse | null>(null);
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE);
  const [resultado, setResultado] = useState<CalcularResponse | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    calculatorApi
      .opciones()
      .then((res) => setOpciones(res.data))
      .catch(() => setError("No se pudieron cargar las opciones."));
  }, []);

  const updateState = (patch: Partial<CalculatorState>) => {
    setState((prev) => ({ ...prev, ...patch }));
    setResultado(null);
  };

  const resetState = () => {
    setState(INITIAL_STATE);
    setResultado(null);
    setError(null);
  };

  const calcular = async () => {
    setCalculating(true);
    setError(null);
    try {
      const payload = {
        artefactos: {
          electrodomesticos: state.electrodomesticos,
          luminarias: state.luminarias,
        },
        clima: {
          calefaccion: state.calefaccion,
          refrigeracion: state.refrigeracion,
        },
        transporte: {
          laboral: state.transporteLaboral,
          esporadico: state.transporteEsporadico,
        },
      };
      const { data } = await calculatorApi.calcular(payload);
      setResultado(data);
    } catch (err: any) {
      const msg =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Error al calcular.";
      setError(msg);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <CalculatorContext.Provider
      value={{ opciones, state, resultado, calculating, error, updateState, resetState, calcular }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculator must be used within CalculatorProvider");
  return ctx;
}
