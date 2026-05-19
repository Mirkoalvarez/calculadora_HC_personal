import axios from "axios";
import type {
  AuthTokens,
  RegisterPayload,
  UserProfile,
  OpcionesResponse,
  CalcularPayload,
  CalcularResponse,
  HistorialItem,
  HistorialDetail,
} from "../types";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ── Interceptor: adjuntar JWT automáticamente ──
api.interceptors.request.use((config) => {
  const tokens = localStorage.getItem("tokens");
  if (tokens) {
    const { access } = JSON.parse(tokens) as AuthTokens;
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// ── Interceptor: refresh automático en 401 ──
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const tokens = localStorage.getItem("tokens");
      if (tokens) {
        try {
          const { refresh } = JSON.parse(tokens) as AuthTokens;
          const { data } = await axios.post<AuthTokens>("/api/auth/token/refresh/", { refresh });
          const newTokens = { access: data.access, refresh: data.refresh || refresh };
          localStorage.setItem("tokens", JSON.stringify(newTokens));
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem("tokens");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

/* ── Auth ──────────────────────────────────── */

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post("/auth/register/", data),

  login: (data: { username: string; password: string }) =>
    api.post<AuthTokens>("/auth/token/", data),

  profile: () =>
    api.get<UserProfile>("/auth/profile/"),
};

/* ── Calculator ────────────────────────────── */

export const calculatorApi = {
  opciones: () =>
    api.get<OpcionesResponse>("/calculator/opciones/"),

  calcular: (data: CalcularPayload) =>
    api.post<CalcularResponse>("/calculator/calcular/", data),

  historial: () =>
    api.get<HistorialItem[]>("/calculator/historial/"),

  historialDetail: (id: number) =>
    api.get<HistorialDetail>(`/calculator/historial/${id}/`),

  historialDelete: (id: number) =>
    api.delete(`/calculator/historial/${id}/`),
};

export default api;
