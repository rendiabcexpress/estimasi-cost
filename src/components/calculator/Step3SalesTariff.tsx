import React from 'react';
import { Card, SectionHeader, NumberInput, Divider } from '../ui';
import { Tariff } from '../../types';
import { formatRp } from '../../utils/calculations';

export function Step3SalesTariff({
  tariff,
  onChangeTariff,
  totalCW,
  totalKoli,
  revenueBerat,
  revenueKoli,
  totalRevenue,
}: {
  tariff: Tariff;
  onChangeTariff: (f: keyof Tariff, v: number) => void;
  totalCW: number;
  totalKoli: number;
  revenueBerat: number;
  revenueKoli: number;
  totalRevenue: number;
}) {
  return (
    <Card>
      <SectionHeader icon="💰" title="Tarif Penjualan" />

      <div style={{ display: 'grid', gap: 12, marginBottom: 16 }} className="card-grid-2">
        <NumberInput
          label="Harga per Kg (Rp)"
          value={tariff.hargaPerKg}
          onChange={(v) => onChangeTariff('hargaPerKg', v)}
          prefix="Rp"
          currency
        />
        <NumberInput
          label="Harga per Koli (Rp)"
          value={tariff.hargaPerKoli}
          onChange={(v) => onChangeTariff('hargaPerKoli', v)}
          prefix="Rp"
          currency
        />
      </div>

      {/* Estimasi Revenue */}
      <div
        style={{
          background: 'var(--success-light)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          border: '1px solid rgba(39,174,96,0.25)',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          Estimasi Revenue
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
          <span>Biaya Berat: {totalCW} kg × Rp {formatRp(tariff.hargaPerKg)}</span>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>Rp {formatRp(revenueBerat)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
          <span>Biaya Koli: {totalKoli} koli × Rp {formatRp(tariff.hargaPerKoli)}</span>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>Rp {formatRp(revenueKoli)}</span>
        </div>
        <Divider my={8} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Total Revenue</span>
          <span style={{ fontWeight: 800, fontSize: 18, color: totalRevenue > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
            Rp {formatRp(totalRevenue)}
          </span>
        </div>
      </div>
    </Card>
  );
}
