import React from 'react';
import { Card, SectionHeader, InputField, NumberInput, AddButton, DeleteBtn, Divider } from '../ui';
import { IconSquareRoundedPlus, IconRosetteDiscountCheck } from '@tabler/icons-react';
import { CostItem } from '../../types';
import { formatRp } from '../../utils/calculations';

export function Step5ExtraCosts({
  extraCosts,
  totalExtraCost,
  discountCostPct,
  discountCostNominal,
  totalCostBeforeDiscount,
  totalCost,
  targetDiscountFor40,
  targetDiscountPctFor40,
  discountGapFor40,
  onAdd,
  onUpdate,
  onRemove,
  onChangeDiscountPct,
}: {
  extraCosts: CostItem[];
  totalExtraCost: number;
  discountCostPct: number;
  discountCostNominal: number;
  totalCostBeforeDiscount: number;
  totalCost: number;
  targetDiscountFor40: number;
  targetDiscountPctFor40: number;
  discountGapFor40: number;
  onAdd: () => void;
  onUpdate: (id: string, f: keyof CostItem, v: string | number) => void;
  onRemove: (id: string) => void;
  onChangeDiscountPct: (v: number) => void;
}) {
  const reachedTarget = discountGapFor40 <= 0;

  return (
    <>
      <Card>
        <SectionHeader
          icon={<IconSquareRoundedPlus size={20} stroke={1.5} />}
          title="Biaya Tambahan"
          subtitle="Opsional - asuransi, packaging, dll"
        />

        {extraCosts.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(100px, 140px) 32px', gap: 8, marginBottom: 4, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Deskripsi</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Biaya (Rp)</span>
            <span />
          </div>
        )}

        {extraCosts.map((item) => (
          <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr minmax(100px, 140px) 32px', gap: 8, marginBottom: 6, alignItems: 'center' }}>
            <InputField
              value={item.deskripsi}
              onChange={(v) => onUpdate(item.id, 'deskripsi', v)}
              placeholder="Nama biaya"
            />
            <NumberInput
              value={item.biaya}
              onChange={(v) => onUpdate(item.id, 'biaya', v)}
              currency
            />
            <DeleteBtn onClick={() => onRemove(item.id)} />
          </div>
        ))}

        <AddButton label="Tambah Biaya" onClick={onAdd} />

        {totalExtraCost > 0 && (
          <>
            <Divider my={12} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Total Biaya Tambahan</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>Rp {formatRp(totalExtraCost)}</span>
            </div>
          </>
        )}
      </Card>

      <Card>
        <SectionHeader
          icon={<IconRosetteDiscountCheck size={20} stroke={1.5} />}
          title="Diskon Revenue"
          subtitle="Input persen dari revenue untuk mengurangi harga jual (revenue bersih)"
        />

        <div style={{ display: 'grid', gap: 8 }} className="card-grid-2">
          <NumberInput value={discountCostPct} onChange={onChangeDiscountPct} label="Diskon (%)" suffix="%" />
          <NumberInput value={discountCostNominal} onChange={() => {}} label="Nominal Diskon (Rp)" currency disabled />
          <NumberInput value={targetDiscountFor40} onChange={() => {}} label="Maks Diskon (Rp)" currency disabled />
          <NumberInput value={targetDiscountPctFor40} onChange={() => {}} label="Maks Diskon (%)" suffix="%" disabled />
        </div>

        <Divider my={12} />
        <div style={{ display: 'grid', gap: 6, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Revenue Sebelum Diskon</span>
            <span style={{ fontWeight: 700 }}>Rp {formatRp(totalCostBeforeDiscount)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Revenue Setelah Diskon</span>
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>Rp {formatRp(totalCost)}</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            border: reachedTarget ? '1px solid rgba(22,163,74,0.35)' : '1px solid rgba(217,119,6,0.35)',
            background: reachedTarget ? '#DCFCE7' : '#FEF3C7',
            color: reachedTarget ? '#15803D' : '#B45309',
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.5,
          }}
        >
          {reachedTarget
            ? `Target margin 40% setelah diskon tercapai.`
            : `Diskon terlalu besar untuk target margin 40%. Kurangi diskon Rp ${formatRp(discountGapFor40)}.`}
        </div>
      </Card>
    </>
  );
}
