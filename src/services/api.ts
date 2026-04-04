import { City, Produk, RouteRate } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  const json = await res.json();
  return json.data ?? json;
}

// Ambil semua kota aktif dari antero_new (field: id, name)
export async function fetchCities(search = ''): Promise<City[]> {
  const params = new URLSearchParams({
    limit: '500',
    status: '1',
    ...(search ? { search } : {}),
  });
  const data = await get<{ rows: City[] }>(`/api/masterdata/city?${params}`);
  return data.rows;
}

// Ambil semua produk aktif dari antero_new (field: id, produk, volume_type, volume_divider)
export async function fetchProduk(): Promise<Produk[]> {
  const data = await get<{ rows: Produk[] }>('/api/masterdata/product?limit=100');
  return data.rows.filter((p) => p.status === 1 || p.status === null);
}

// Ambil rate untuk kombinasi rute+produk dari tabel routeprice
export async function fetchRouteRate(
  asalKotaId: number,
  tujuanKotaId: number,
  produkId: number,
  signal?: AbortSignal
): Promise<RouteRate | null> {
  try {
    const params = new URLSearchParams({
      asal_kota_id: String(asalKotaId),
      tujuan_kota_id: String(tujuanKotaId),
      produk_id: String(produkId),
      status: '1',
      limit: '1',
    });
    const res = await fetch(`${BASE_URL}/api/masterdata/route-price?${params}`, { signal });
    if (!res.ok) return null;
    const json = await res.json();
    const rows = (json.data ?? json).rows;
    if (!rows?.length) return null;
    const row = rows[0];
    return {
      hargaPerKg: Number(row.harga_kilo) || 0,
      hargaPerKoli: Number(row.harga_koli) || 0,
      legs: {
        firstMile: { vendor: '', items: [] },
        middleMile: { vendor: '', items: [] },
        lastMile: { vendor: '', items: [] },
      },
      extraCosts: [],
    };
  } catch {
    return null;
  }
}
