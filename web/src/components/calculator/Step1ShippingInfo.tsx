import React from 'react';
import { Card, SectionHeader, Select, InputField, InfoNote } from '../ui';
import { ShippingInfo } from '../../types';
import { KOTA_LIST, PRODUK_LIST } from '../../data/masterdata';

const kotaOptions = KOTA_LIST.map((k) => ({ label: k, value: k }));
const produkOptions = PRODUK_LIST.map((p) => ({
  label: `${p.nama} (${p.jenisAngkutan})`,
  value: p.id,
}));

export function Step1ShippingInfo({
  info,
  onChange,
}: {
  info: ShippingInfo;
  onChange: (f: Partial<ShippingInfo>) => void;
}) {
  const produk = PRODUK_LIST.find((p) => p.id === info.produkId);

  return (
    <Card>
      <SectionHeader icon="📦" title="Informasi Pengiriman" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <Select
          label="Asal"
          options={kotaOptions}
          value={info.asal}
          onChange={(v) => onChange({ asal: String(v) })}
        />
        <Select
          label="Tujuan"
          options={kotaOptions}
          value={info.tujuan}
          onChange={(v) => onChange({ tujuan: String(v) })}
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

      <Select
        label="Produk / Moda Angkutan"
        options={produkOptions}
        value={info.produkId}
        onChange={(v) => onChange({ produkId: Number(v) })}
      />

      {produk && (
        <InfoNote>
          ℹ️ Volume divider: <strong>{produk.volumeDivider.toLocaleString('id-ID')}</strong> cm³/kg
          ({produk.jenisAngkutan}) — digunakan untuk menghitung Volumetric Weight
        </InfoNote>
      )}
    </Card>
  );
}
