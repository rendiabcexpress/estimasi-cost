import { CalculatorState, RouteRate } from '../types';

const STORAGE_KEY = 'estcost_autofill_history';
const MAX_ENTRIES = 50;

interface HistoryEntry {
  key: string; // "asalId-tujuanId-produkId"
  timestamp: number;
  rate: RouteRate;
}

function buildKey(asalId: number, tujuanId: number, produkId: number): string {
  return `${asalId}-${tujuanId}-${produkId}`;
}

function loadAll(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(entries: HistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Simpan kalkulasi ke localStorage untuk auto-fill di masa depan */
export function saveToHistory(state: CalculatorState): void {
  const { asalKotaId, tujuanKotaId, produkId } = state.shippingInfo;
  if (!asalKotaId || !tujuanKotaId || !produkId) return;

  // Hanya simpan jika ada data bermakna (tarif > 0 atau ada leg costs)
  const hasTariff = state.tariff.hargaPerKg > 0 || state.tariff.hargaPerKoli > 0;
  const hasLegCosts =
    state.legs.firstMile.items.length > 0 ||
    state.legs.middleMile.items.length > 0 ||
    state.legs.lastMile.items.length > 0;

  if (!hasTariff && !hasLegCosts) return;

  const key = buildKey(asalKotaId, tujuanKotaId, produkId);
  const entry: HistoryEntry = {
    key,
    timestamp: Date.now(),
    rate: {
      hargaPerKg: state.tariff.hargaPerKg,
      hargaPerKoli: state.tariff.hargaPerKoli,
      legs: state.legs,
      extraCosts: state.extraCosts,
      deskripsi: state.shippingInfo.deskripsi || undefined,
    },
  };

  const entries = loadAll().filter((e) => e.key !== key);
  entries.unshift(entry);
  saveAll(entries.slice(0, MAX_ENTRIES));
}

/** Cari data history untuk kombinasi rute+produk */
export function findInHistory(
  asalKotaId: number,
  tujuanKotaId: number,
  produkId: number
): RouteRate | null {
  const key = buildKey(asalKotaId, tujuanKotaId, produkId);
  const entry = loadAll().find((e) => e.key === key);
  return entry?.rate ?? null;
}
