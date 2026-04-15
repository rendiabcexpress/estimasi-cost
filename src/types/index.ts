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
  // Field sesuai tabel city antero_new
  asalKotaId: number | null;    // city.id
  asalKotaName: string;         // city.name (untuk display)
  tujuanKotaId: number | null;  // city.id
  tujuanKotaName: string;       // city.name (untuk display)
  deskripsi: string;
  // Field sesuai tabel produk antero_new
  produkId: number | null;
  produkName: string;           // produk.produk
  volumeDivider: number;        // produk.volume_divider (4000 atau 5000)
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
  discountCostPct: number;
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
  totalCostBeforeDiscount: number;
  discountCostNominal: number;
  totalCost: number;
  margin: number;
  marginPct: number;
  marginStatus: MarginStatus;
  targetDiscountFor40: number;
  targetDiscountPctFor40: number;
  discountGapFor40: number;
  minRevenueFor40: number;
  minHargaKgFor40: number;
  costReductionFor40: number;
}

// Sesuai dengan tabel produk di antero_new
export interface Produk {
  id: number;
  produk: string;        // nama produk (field: produk.produk)
  volume_type: string;   // kode moda: '9'=Ground, '15'=Air, '16'=Global, '20'=Sea
  volume_divider: number; // 4000 atau 5000
  status: number | null;
}

// Sesuai dengan tabel city di antero_new
export interface City {
  id: number;
  name: string;
  province_name?: string;
}

// Data rate untuk auto-fill dari backend atau localStorage
export interface RouteRate {
  hargaPerKg: number;
  hargaPerKoli: number;
  legs: {
    firstMile: Leg;
    middleMile: Leg;
    lastMile: Leg;
  };
  extraCosts: CostItem[];
  deskripsi?: string;
}

export type AutoFillStatus = 'idle' | 'loading' | 'applied' | 'not-found';
