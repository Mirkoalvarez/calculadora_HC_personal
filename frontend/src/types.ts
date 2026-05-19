/* ── Input Types ───────────────────────────── */

export interface ElectrodomesticoInput {
  aparato: string;
  cantidad: number;
  horas_dia: number;
}

export interface LuminariaInput {
  tipo: string;
  potencia: string;
  cantidad: number;
  uso_diario: string;
}

export interface CalefaccionInput {
  aparato: string;
  horas_dia: number;
}

export interface RefrigeracionInput {
  aparato: string;
  horas_dia: number;
}

export interface TransporteLaboralInput {
  vehiculo: string;
  km_ida: number;
  km_vuelta: number;
}

export interface TransporteEsporadicoInput {
  vehiculo: string;
  km_totales: number;
}

export interface CalcularPayload {
  artefactos: {
    electrodomesticos: ElectrodomesticoInput[];
    luminarias: LuminariaInput[];
  };
  clima: {
    calefaccion: CalefaccionInput[];
    refrigeracion: RefrigeracionInput[];
  };
  transporte: {
    laboral: TransporteLaboralInput[];
    esporadico: TransporteEsporadicoInput[];
  };
  label?: string;
}

/* ── Response Types ────────────────────────── */

export interface CalcularResponse {
  id: number;
  total_kgco2: number;
  total_arboles: number;
  detalle: {
    artefactos_kgco2: number;
    electrodomesticos_kgco2: number;
    luminarias_kgco2: number;
    clima_kgco2: number;
    calefaccion_kgco2: number;
    refrigeracion_kgco2: number;
    transporte_kgco2: number;
    transporte_laboral_kgco2: number;
    transporte_esporadico_kgco2: number;
  };
}

export interface OpcionesResponse {
  electrodomesticos: string[];
  calefaccion: string[];
  refrigeracion: string[];
  vehiculos: string[];
  luminarias: {
    tipos: string[];
    potencias_por_tipo: Record<string, string[]>;
  };
  horas_uso: string[];
  constantes: {
    dias_laborales: number;
    dias_invierno: number;
    dias_verano: number;
    arboles_factor: number;
  };
}

export interface HistorialItem {
  id: number;
  total_kgco2: number;
  total_arboles: number;
  label: string;
  created_at: string;
}

export interface HistorialDetail extends HistorialItem {
  artefactos_kgco2: number;
  clima_kgco2: number;
  transporte_kgco2: number;
  detalle: CalcularResponse["detalle"];
  input_data: CalcularPayload;
}

/* ── Auth Types ────────────────────────────── */

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  date_joined: string;
}
