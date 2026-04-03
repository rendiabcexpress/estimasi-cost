import { City, Produk } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

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
