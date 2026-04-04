import React from 'react';
import { Card, SectionHeader, InputField, NumberInput, AddButton, DeleteBtn, Divider } from '../ui';
import { CostItem } from '../../types';
import { formatRp } from '../../utils/calculations';

export function Step5ExtraCosts({
  extraCosts,
  totalExtraCost,
  onAdd,
  onUpdate,
  onRemove,
}: {
  extraCosts: CostItem[];
  totalExtraCost: number;
  onAdd: () => void;
  onUpdate: (id: string, f: keyof CostItem, v: string | number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <Card>
      <SectionHeader icon="➕" title="Biaya Tambahan" subtitle="Opsional — asuransi, packaging, dll" />

      {extraCosts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 36px', gap: 8, marginBottom: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Deskripsi</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Biaya (Rp)</span>
          <span />
        </div>
      )}

      {extraCosts.map((item) => (
        <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 36px', gap: 8, marginBottom: 6, alignItems: 'center' }}>
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
  );
}
