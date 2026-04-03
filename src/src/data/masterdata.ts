// Master data ini bersumber dari database antero_new (shared DB).
// City dan Produk tidak lagi di-hardcode — difetch via API saat runtime.
// Lihat: src/services/api.ts

export const TARGET_MARGIN = 40; // persen — target margin minimum

// Label moda angkutan dari kode volume_type antero_new
export const VOLUME_TYPE_LABEL: Record<string, string> = {
  '9':  'Darat (Ground)',
  '15': 'Udara (Air)',
  '16': 'Global (Air)',
  '20': 'Laut (Sea)',
};

// Contoh item biaya tipikal per leg (untuk placeholder/suggestion)
export const CONTOH_BIAYA = {
  firstMile: ['Charter kendaraan', 'Manpower bongkar muat', 'Sewa forklift', 'Biaya tol', 'Biaya BBM'],
  middleMile: ['Kapal / cargo laut', 'Pesawat / cargo udara', 'Truk antar kota', 'Handling pelabuhan', 'Handling bandara', 'Asuransi transit'],
  lastMile: ['Kendaraan box pengiriman', 'Manpower antar', 'Biaya parkir / tol', 'COD handling', 'Biaya masuk kawasan'],
};
