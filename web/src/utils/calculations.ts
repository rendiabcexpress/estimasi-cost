import {
  DimensionItem,
  DimensionItemCalculated,
  WeightSummary,
  ComputedValues,
  CalculatorState,
  MarginStatus,
} from '../types';
import { TARGET_MARGIN } from '../data/masterdata';

// --- Per baris dimensi ---

export function calcRow(item: DimensionItem, volumeDivider: number): DimensionItemCalculated {
  const { koli, panjang, lebar, tinggi, berat } = item;

  const actualWeight = berat;
  const volumetricWeight =
    koli > 0 && panjang > 0 && lebar > 0 && tinggi > 0
      ? (panjang * lebar * tinggi * koli) / volumeDivider
      : 0;
  const chargeableWeight = Math.ceil(Math.max(actualWeight, volumetricWeight));
  const cbm =
    koli > 0 && panjang > 0 && lebar > 0 && tinggi > 0
      ? (panjang * lebar * tinggi * koli) / 1_000_000
      : 0;

  return { ...item, actualWeight, volumetricWeight, chargeableWeight, cbm };
}

// --- Total berat dari baris dimensi ---

export function calcWeightSummary(items: DimensionItemCalculated[]): WeightSummary {
  return {
    totalKoli: items.reduce((s, i) => s + i.koli, 0),
    totalActualWeight: items.reduce((s, i) => s + i.actualWeight, 0),
    totalVolumetricWeight: items.reduce((s, i) => s + i.volumetricWeight, 0),
    totalChargeableWeight: items.reduce((s, i) => s + i.chargeableWeight, 0),
    totalCbm: items.reduce((s, i) => s + i.cbm, 0),
  };
}

// --- Margin status ---

export function getMarginStatus(marginPct: number): MarginStatus {
  if (marginPct < 0) return 'rugi';
  if (marginPct < TARGET_MARGIN) return 'warning';
  return 'ok';
}

// --- Semua computed values ---

export function computeAll(state: CalculatorState): ComputedValues {
  // volume_divider diambil dari produk yang dipilih (sudah difetch dari DB antero_new)
  const volumeDivider = state.shippingInfo.volumeDivider ?? 5000;

  // 1. Hitung per baris dimensi
  const itemsCalculated = state.items.map((item) => calcRow(item, volumeDivider));

  // 2. Weight summary (dari mode yang aktif)
  let weightSummary: WeightSummary;
  if (state.inputMode === 'dimensi') {
    weightSummary = calcWeightSummary(itemsCalculated);
  } else {
    const d = state.directInput;
    weightSummary = {
      totalKoli: d.koli,
      totalActualWeight: d.actualWeight,
      totalVolumetricWeight: d.volumetricWeight,
      totalChargeableWeight: d.chargeableWeight,
      totalCbm: d.cbm,
    };
  }

  const { totalKoli, totalChargeableWeight } = weightSummary;

  // 3. Revenue
  const revenueBerat = totalChargeableWeight * state.tariff.hargaPerKg;
  const revenueKoli = totalKoli * state.tariff.hargaPerKoli;
  const totalRevenue = revenueBerat + revenueKoli;

  // 4. Biaya operasional per leg
  const subtotalFirstMile = state.legs.firstMile.items.reduce((s, i) => s + i.biaya, 0);
  const subtotalMiddleMile = state.legs.middleMile.items.reduce((s, i) => s + i.biaya, 0);
  const subtotalLastMile = state.legs.lastMile.items.reduce((s, i) => s + i.biaya, 0);
  const totalOpsCost = subtotalFirstMile + subtotalMiddleMile + subtotalLastMile;

  // 5. Biaya tambahan
  const totalExtraCost = state.extraCosts.reduce((s, i) => s + i.biaya, 0);

  // 6. Total cost & margin
  const totalCost = totalOpsCost + totalExtraCost;
  const margin = totalRevenue - totalCost;
  const marginPct = totalRevenue > 0 ? (margin / totalRevenue) * 100 : 0;
  const marginStatus = getMarginStatus(marginPct);

  // 7. Saran pencapaian target 40%
  // Revenue minimum = totalCost / (1 - 0.40)
  const minRevenueFor40 = totalCost > 0 ? totalCost / (1 - TARGET_MARGIN / 100) : 0;
  // Harga/kg minimum = (minRevenue - revenueKoli) / CW
  const minHargaKgFor40 =
    totalChargeableWeight > 0
      ? (minRevenueFor40 - revenueKoli) / totalChargeableWeight
      : 0;
  // Pengurangan cost = totalCost - (totalRevenue * (1 - 0.40))
  const costReductionFor40 = totalCost - totalRevenue * (1 - TARGET_MARGIN / 100);

  return {
    itemsCalculated,
    weightSummary,
    revenueBerat,
    revenueKoli,
    totalRevenue,
    subtotalFirstMile,
    subtotalMiddleMile,
    subtotalLastMile,
    totalOpsCost,
    totalExtraCost,
    totalCost,
    margin,
    marginPct,
    marginStatus,
    minRevenueFor40,
    minHargaKgFor40,
    costReductionFor40,
  };
}

// --- Format angka ke Rupiah ---

export function formatRp(value: number, short = false): string {
  if (short) {
    if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
    if (Math.abs(value) >= 1_000) return `${Math.round(value / 1_000)}rb`;
    return `${Math.round(value)}`;
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPct(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatWeight(value: number, decimals = 1): string {
  return `${parseFloat(value.toFixed(decimals))} kg`;
}

export function formatCbm(value: number): string {
  return `${value.toFixed(3)} m³`;
}

// --- Generate unique ID ---
export function genId(): string {
  return Math.random().toString(36).substring(2, 9);
}
