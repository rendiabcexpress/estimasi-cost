import React, { useState, useEffect, useRef } from 'react';
import { Card, SectionHeader, InputField, InfoNote } from '../ui';
import { ShippingInfo, City, Produk } from '../../types';
import { fetchCities, fetchProduk } from '../../services/api';
import { VOLUME_TYPE_LABEL } from '../../data/masterdata';

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
      try {
        const data = await fetchCities(query);
        setCities(data);
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
          {!loading && cities.length === 0 && (
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

// ─── Step 1 ───────────────────────────────────────────────────────────────────

export function Step1ShippingInfo({
  info,
  onChange,
}: {
  info: ShippingInfo;
  onChange: (f: Partial<ShippingInfo>) => void;
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
        <select
          value={info.produkId ?? ''}
          onChange={(e) => {
            const p = produkList.find((x) => x.id === Number(e.target.value));
            if (p) onChange({ produkId: p.id, produkName: p.produk, volumeDivider: p.volume_divider });
          }}
          disabled={loadingProduk}
          style={{
            width: '100%', height: 40,
            border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
            padding: '0 10px', background: 'white', fontSize: 14,
            color: info.produkId ? 'var(--text)' : 'var(--text-muted)',
            cursor: 'pointer', appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238890B5' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', paddingRight: 30,
          }}
        >
          <option value="" disabled>{loadingProduk ? 'Memuat...' : 'Pilih produk...'}</option>
          {produkList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.produk} — {VOLUME_TYPE_LABEL[p.volume_type] ?? p.volume_type} (÷{p.volume_divider.toLocaleString('id-ID')})
            </option>
          ))}
        </select>
      </div>

      {selectedProduk && (
        <InfoNote>
          ℹ️ Volume divider: <strong>{selectedProduk.volume_divider.toLocaleString('id-ID')}</strong> cm³/kg
          — {VOLUME_TYPE_LABEL[selectedProduk.volume_type] ?? selectedProduk.volume_type}
        </InfoNote>
      )}
    </Card>
  );
}
