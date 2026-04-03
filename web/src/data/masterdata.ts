import { Produk } from '../types';

// Produk dari tabel produk antero_new
// volume_divider: 5000 = Udara (Air), 4000 = Darat/Laut
export const PRODUK_LIST: Produk[] = [
  { id: 1, nama: 'Express Cargo',   volumeDivider: 5000, jenisAngkutan: 'Udara' },
  { id: 3, nama: 'Priority Cargo',  volumeDivider: 5000, jenisAngkutan: 'Udara' },
  { id: 2, nama: 'Regular Cargo',   volumeDivider: 4000, jenisAngkutan: 'Darat/Laut' },
  { id: 4, nama: 'Sea Cargo',       volumeDivider: 4000, jenisAngkutan: 'Laut' },
  { id: 5, nama: 'Land Cargo',      volumeDivider: 4000, jenisAngkutan: 'Darat' },
];

// Kota-kota aktif sebagai origin (dari import-tarif.js antero_new)
// + kota tujuan populer dari routeprice
export const KOTA_LIST = [
  'Jakarta',
  'Surabaya',
  'Makassar',
  'Balikpapan',
  'Banjarmasin',
  'Bandung',
  'Medan',
  'Semarang',
  'Palembang',
  'Pekanbaru',
  'Manado',
  'Kendari',
  'Palu',
  'Jayapura',
  'Sorong',
  'Ambon',
  'Ternate',
  'Kupang',
  'Mataram',
  'Denpasar',
  'Pontianak',
  'Samarinda',
  'Tarakan',
  'Biak',
  'Timika',
  'Merauke',
  'Gorontalo',
  'Mamuju',
  'Pare-Pare',
  'Yogyakarta',
];

// Jenis layanan dari tabel jenis_layanan antero_new
export const JENIS_LAYANAN = [
  { id: 1, nama: 'To Door' },
  { id: 2, nama: 'To Office' },
  { id: 3, nama: 'Pickup' },
];

// Contoh item biaya tipikal per leg (untuk suggestion/placeholder)
export const CONTOH_BIAYA = {
  firstMile: [
    'Charter kendaraan',
    'Manpower bongkar muat',
    'Sewa forklift',
    'Biaya tol',
    'Biaya BBM',
  ],
  middleMile: [
    'Kapal / cargo laut',
    'Pesawat / cargo udara',
    'Truk antar kota',
    'Handling pelabuhan',
    'Handling bandara',
    'Asuransi transit',
  ],
  lastMile: [
    'Kendaraan box pengiriman',
    'Manpower antar',
    'Biaya parkir / tol',
    'COD handling',
    'Biaya masuk kawasan',
  ],
};

export const TARGET_MARGIN = 40; // persen
