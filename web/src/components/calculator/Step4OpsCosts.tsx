import React from 'react';
import { Card, SectionHeader } from '../ui';
import { LegSection } from './LegSection';
import { CalculatorState, CostItem } from '../../types';
import { formatRp } from '../../utils/calculations';

interface Props {
  legs: CalculatorState['legs'];
  subtotalFirstMile: number;
  subtotalMiddleMile: number;
  subtotalLastMile: number;
  totalOpsCost: number;
  onVendorChange: (leg: 'firstMile' | 'middleMile' | 'lastMile', v: string) => void;
  onAddItem: (leg: 'firstMile' | 'middleMile' | 'lastMile') => void;
  onUpdateItem: (leg: 'firstMile' | 'middleMile' | 'lastMile', id: string, f: keyof CostItem, v: string | number) => void;
  onRemoveItem: (leg: 'firstMile' | 'middleMile' | 'lastMile', id: string) => void;
}

export function Step4OpsCosts({
  legs,
  subtotalFirstMile,
  subtotalMiddleMile,
  subtotalLastMile,
  totalOpsCost,
  onVendorChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: Props) {
  return (
    <Card>
      <SectionHeader icon="🚚" title="Biaya Operasional" />

      <LegSection
        icon="🔵" label="First Mile" color="#3B82F6"
        leg={legs.firstMile} subtotal={subtotalFirstMile}
        onVendorChange={(v) => onVendorChange('firstMile', v)}
        onAddItem={() => onAddItem('firstMile')}
        onUpdateItem={(id, f, v) => onUpdateItem('firstMile', id, f, v)}
        onRemoveItem={(id) => onRemoveItem('firstMile', id)}
      />
      <LegSection
        icon="🟣" label="Middle Mile" color="#8B5CF6"
        leg={legs.middleMile} subtotal={subtotalMiddleMile}
        onVendorChange={(v) => onVendorChange('middleMile', v)}
        onAddItem={() => onAddItem('middleMile')}
        onUpdateItem={(id, f, v) => onUpdateItem('middleMile', id, f, v)}
        onRemoveItem={(id) => onRemoveItem('middleMile', id)}
      />
      <LegSection
        icon="🟢" label="Last Mile" color="#10B981"
        leg={legs.lastMile} subtotal={subtotalLastMile}
        onVendorChange={(v) => onVendorChange('lastMile', v)}
        onAddItem={() => onAddItem('lastMile')}
        onUpdateItem={(id, f, v) => onUpdateItem('lastMile', id, f, v)}
        onRemoveItem={(id) => onRemoveItem('lastMile', id)}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
          padding: '12px 16px',
          background: 'var(--primary-light)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14 }}>Total Biaya Operasional</span>
        <span style={{ fontWeight: 800, fontSize: 16, color: totalOpsCost > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
          Rp {formatRp(totalOpsCost)}
        </span>
      </div>
    </Card>
  );
}
