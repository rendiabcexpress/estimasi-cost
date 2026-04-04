import React, { useState, useEffect, useRef } from 'react';
import { Card, SectionHeader, InputField, InfoNote } from '../ui';
import { ShippingInfo, City, Produk, AutoFillStatus } from '../../types';
import { fetchCities, fetchProduk } from '../../services/api';
import { VOLUME_TYPE_LABEL } from '../../data/masterdata';

// ─── Indonesian province names for sorting ──────────────────────────────────

const INDONESIAN_PROVINCES = new Set([
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi',
  'Sumatera Selatan', 'Bengkulu', 'Lampung', 'Kepulauan Bangka Belitung',
  'Kepulauan Riau', 'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah',
  'DI Yogyakarta', 'Jawa Timur', 'Banten', 'Bali', 'Nusa Tenggara Barat',
  'Nusa Tenggara Timur', 'Kalimantan Barat', 'Kalimantan Tengah',
  'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan',
  'Sulawesi Tenggara', 'Gorontalo', 'Sulawesi Barat', 'Maluku',
  'Maluku Utara', 'Papua', 'Papua Barat', 'Papua Barat Daya',
  'Papua Tengah', 'Papua Pegunungan', 'Papua Selatan',
]);

function isIndonesianCity(city: City): boolean {
  return !!city.province_name && INDONESIAN_PROVINCES.has(city.province_name);
}

function sortCitiesIndonesiaFirst(cities: City[]): City[] {
  return [...cities].sort((a, b) => {
    const aIsIndo = isIndonesianCity(a);
    const bIsIndo = isIndonesianCity(b);
    if (aIsIndo && !bIsIndo) return -1;
    if (!aIsIndo && bIsIndo) return 1;
    return a.name.localeCompare(b.name);
  });
}

// ─── Searchable City Dropdown ─────────────────────────────────────────────────

function CitySelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: { id: number | null; name: string };
  onChange: (city: City) => void;
}) {
  const [query, setQuery] = useState(value.name);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch saat query berubah (debounce 300ms)
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const data = await fetchCities(query);
        setCities(sortCitiesIndonesiaFirst(data));
      } catch {
        setFetchError(true);
        setCities([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, open]);

  // Sync display saat value berubah dari luar
  useEffect(() => {
    setQuery(value.name);
  }, [value.name]);

  const handleSelect = (city: City) => {
    onChange(city);
    setQuery(city.name);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ flex: 1, position: 'relative' }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
        {label}
      </div>
      <input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Cari kota..."
        style={{
          width: '100%',
          height: 40,
          border: `1.5px solid ${open ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '0 10px',
          fontSize: 14,
          color: 'var(--text)',
          background: 'white',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(26,29,58,0.12)',
          zIndex: 200,
          maxHeight: 260,
          overflowY: 'auto',
          marginTop: 4,
        }}>
          {loading && (
            <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>Memuat...</div>
          )}
          {!loading && fetchError && (
            <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--danger)' }}>Gagal memuat data — periksa koneksi server</div>
          )}
          {!loading && !fetchError && cities.length === 0 && (
            <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>Kota tidak ditemukan</div>
          )}
          {!loading && cities.map((city) => (
            <div
              key={city.id}
              onMouseDown={() => handleSelect(city)}
              style={{
                padding: '9px 14px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border)',
                background: city.id === value.id ? 'var(--primary-light)' : 'white',
              }}
              onMouseEnter={(e) => { if (city.id !== value.id) e.currentTarget.style.background = 'var(--bg)'; }}
              onMouseLeave={(e) => { if (city.id !== value.id) e.currentTarget.style.background = 'white'; }}
            >
              <div style={{ fontSize: 13, fontWeight: city.id === value.id ? 700 : 400, color: city.id === value.id ? 'var(--primary)' : 'var(--text)' }}>
                {city.name}
              </div>
              {city.province_name && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{city.province_name}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Produk Dropdown ─────────────────────────────────────────────────────────

function ProdukSelect({
  produkList,
  loading,
  value,
  onChange,
}: {
  produkList: Produk[];
  loading: boolean;
  value: { id: number | null; name: string };
  onChange: (p: Produk) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = produkList.find((p) => p.id === value.id);

  const modeIcon: Record<string, string> = {
    '9': '🚛', '15': '✈️', '16': '🌐', '20': '🚢',
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => !loading && setOpen((o) => !o)}
        style={{
          width: '100%', height: 40,
          border: `1.5px solid ${open ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '0 36px 0 12px',
          background: 'white',
          fontSize: 14,
          color: selected ? 'var(--text)' : 'var(--text-muted)',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          userSelect: 'none',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {loading ? (
          <span style={{ color: 'var(--text-muted)' }}>Memuat...</span>
        ) : selected ? (
          <>
            <span>{modeIcon[selected.volume_type] ?? '📦'}</span>
            <span style={{ fontWeight: 600 }}>{selected.produk}</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              — {VOLUME_TYPE_LABEL[selected.volume_type] ?? selected.volume_type}
            </span>
          </>
        ) : (
          <span>Pilih produk...</span>
        )}
        {/* chevron */}
        <svg
          style={{ position: 'absolute', right: 10, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform 0.15s' }}
          width="12" height="12" viewBox="0 0 12 12"
        >
          <path fill="var(--text-secondary)" d="M6 8L1 3h10z" />
        </svg>
      </div>

      {open && !loading && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: 'white',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 8px 24px rgba(26,29,58,0.14)',
          zIndex: 200,
          overflow: 'hidden',
        }}>
          {produkList.map((p) => {
            const isSelected = p.id === value.id;
            return (
              <div
                key={p.id}
                onMouseDown={() => { onChange(p); setOpen(false); }}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  background: isSelected ? 'var(--primary-light)' : 'white',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--bg)'; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'white'; }}
              >
                <span style={{ fontSize: 18 }}>{modeIcon[p.volume_type] ?? '📦'}</span>
                <div>
                  <div style={{ fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--primary)' : 'var(--text)', fontSize: 14 }}>
                    {p.produk}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>
                    {VOLUME_TYPE_LABEL[p.volume_type] ?? p.volume_type} · ÷{p.volume_divider.toLocaleString('id-ID')} cm³/kg
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

export function Step1ShippingInfo({
  info,
  onChange,
  autoFillStatus = 'idle',
  onDismissAutoFill,
}: {
  info: ShippingInfo;
  onChange: (f: Partial<ShippingInfo>) => void;
  autoFillStatus?: AutoFillStatus;
  onDismissAutoFill?: () => void;
}) {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [loadingProduk, setLoadingProduk] = useState(true);

  useEffect(() => {
    fetchProduk()
      .then(setProdukList)
      .finally(() => setLoadingProduk(false));
  }, []);

  const selectedProduk = produkList.find((p) => p.id === info.produkId);

  return (
    <Card>
      <SectionHeader icon="📦" title="Informasi Pengiriman" />

      {/* Asal & Tujuan — searchable, dari tabel city antero_new */}
      <div style={{ display: 'grid', gap: 12, marginBottom: 12 }} className="card-grid-2">
        <CitySelect
          label="Asal"
          value={{ id: info.asalKotaId, name: info.asalKotaName }}
          onChange={(city) => onChange({ asalKotaId: city.id, asalKotaName: city.name })}
        />
        <CitySelect
          label="Tujuan"
          value={{ id: info.tujuanKotaId, name: info.tujuanKotaName }}
          onChange={(city) => onChange({ tujuanKotaId: city.id, tujuanKotaName: city.name })}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <InputField
          label="Deskripsi Pengiriman"
          value={info.deskripsi}
          onChange={(v) => onChange({ deskripsi: v })}
          placeholder="Contoh: Elektronik 5 karton"
          rows={2}
        />
      </div>

      {/* Produk — dari tabel produk antero_new */}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
          Produk / Moda Angkutan
        </div>
        <ProdukSelect
          produkList={produkList}
          loading={loadingProduk}
          value={{ id: info.produkId, name: info.produkName }}
          onChange={(p) => onChange({ produkId: p.id, produkName: p.produk, volumeDivider: p.volume_divider })}
        />
      </div>

      {selectedProduk && (
        <InfoNote>
          ℹ️ Volume divider: <strong>{selectedProduk.volume_divider.toLocaleString('id-ID')}</strong> cm³/kg
          — {VOLUME_TYPE_LABEL[selectedProduk.volume_type] ?? selectedProduk.volume_type}
        </InfoNote>
      )}

      {/* Auto-fill status banner */}
      {autoFillStatus === 'loading' && (
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 'var(--radius-sm)',
          background: 'var(--primary-light)', color: 'var(--primary)',
          fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
          Mencari data rute...
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
      {autoFillStatus === 'applied' && (
        <div style={{
          marginTop: 12, padding: '10px 14px', borderRadius: 'var(--radius-sm)',
          background: '#DCFCE7', border: '1px solid #16A34A40',
          fontSize: 13, fontWeight: 500, color: '#15803D',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>Data ditemukan — tarif & biaya diisi otomatis dari riwayat</span>
          {onDismissAutoFill && (
            <button
              onClick={onDismissAutoFill}
              style={{
                background: 'none', border: 'none', color: '#15803D',
                cursor: 'pointer', fontWeight: 700, fontSize: 16, lineHeight: 1, padding: '0 4px',
              }}
            >
              ×
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
