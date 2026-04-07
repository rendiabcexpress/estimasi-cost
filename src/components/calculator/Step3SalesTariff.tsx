import React from 'react';
import { Card, SectionHeader, NumberInput, Divider } from '../ui';
import { IconCoinFilled } from '@tabler/icons-react';
import { Tariff } from '../../types';
import { formatRp } from '../../utils/calculations';

export function Step3SalesTariff({
  tariff,
  onChangeTariff,
  totalCW,
  revenueBerat,
  totalRevenue,
}: {
  tariff: Tariff;
  onChangeTariff: (f: keyof Tariff, v: number) => void;
  totalCW: number;
  revenueBerat: number;
  totalRevenue: number;
}) {
  return (
    <Card>
      <SectionHeader icon={<IconCoinFilled size={20} />} title="Tarif Penjualan" />

      <div style={{ marginBottom: 16 }}>
        <NumberInput
          label="Harga per Kg (Rp)"
          value={tariff.hargaPerKg}
          onChange={(v) => onChangeTariff('hargaPerKg', v)}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
          <span>{totalCW} kg x Rp {formatRp(tariff.hargaPerKg)}/kg</span>
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>Rp {formatRp(revenueBerat)}</span>
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
