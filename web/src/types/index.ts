export interface DimensionItem {
  id: string;
  koli: number;
  panjang: number;
  lebar: number;
  tinggi: number;
  berat: number;
}

export interface DimensionItemCalculated extends DimensionItem {
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  cbm: number;
}

export interface DirectInput {
  koli: number;
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  cbm: number;
}

export interface WeightSummary {
  totalKoli: number;
  totalActualWeight: number;
  totalVolumetricWeight: number;
  totalChargeableWeight: number;
  totalCbm: number;
}

export interface CostItem {
  id: string;
  deskripsi: string;
  biaya: number;
}

export interface Leg {
  vendor: string;
  items: CostItem[];
}

export interface ShippingInfo {
  asal: string;
  tujuan: string;
  deskripsi: string;
  produkId: number;
}

export interface Tariff {
  hargaPerKg: number;
  hargaPerKoli: number;
}

export type InputMode = 'dimensi' | 'langsung';

export type MarginStatus = 'rugi' | 'warning' | 'ok';

export interface CalculatorState {
  shippingInfo: ShippingInfo;
  inputMode: InputMode;
  items: DimensionItem[];
  directInput: DirectInput;
  tariff: Tariff;
  legs: {
    firstMile: Leg;
    middleMile: Leg;
    lastMile: Leg;
  };
  extraCosts: CostItem[];
}

export interface ComputedValues {
  itemsCalculated: DimensionItemCalculated[];
  weightSummary: WeightSummary;
  revenueBerat: number;
  revenueKoli: number;
  totalRevenue: number;
  subtotalFirstMile: number;
  subtotalMiddleMile: number;
  subtotalLastMile: number;
  totalOpsCost: number;
  totalExtraCost: number;
  totalCost: number;
  margin: number;
  marginPct: number;
  marginStatus: MarginStatus;
  minRevenueFor40: number;
  minHargaKgFor40: number;
  costReductionFor40: number;
}

export interface Produk {
  id: number;
  nama: string;
  volumeDivider: number;
  jenisAngkutan: string;
}
