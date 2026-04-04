import React, { useState } from 'react';
import { InputField, NumberInput, AddButton, DeleteBtn } from '../ui';
import { CostItem, Leg } from '../../types';
import { formatRp } from '../../utils/calculations';

interface Props {
  icon: string;
  label: string;
  color: string;
  leg: Leg;
  subtotal: number;
  onVendorChange: (v: string) => void;
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof CostItem, value: string | number) => void;
  onRemoveItem: (id: string) => void;
}

export function LegSection({
  icon,
  label,
  color,
  leg,
  subtotal,
  onVendorChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1.5px solid var(--border)',
        overflow: 'hidden',
        marginBottom: 8,
      }}
    >
      {/* Accordion header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          background: 'var(--card-inner)',
          border: 'none',
          cursor: 'pointer',
          borderLeft: `4px solid ${color}`,
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{label}</span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: subtotal > 0 ? 'var(--primary)' : 'var(--text-muted)',
          }}
        >
          Rp {formatRp(subtotal)}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 8 }}>
          {collapsed ? '▶' : '▼'}
        </span>
      </button>

      {!collapsed && (
        <div style={{ padding: 16, background: 'white' }}>
          <InputField
            label="Vendor / Pihak"
            value={leg.vendor}
            onChange={onVendorChange}
            placeholder="Nama vendor atau internal"
          />

          {leg.items.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 36px', gap: 8, marginTop: 12, marginBottom: 4, alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Deskripsi</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', textAlign: 'right' }}>Biaya (Rp)</span>
              <span />
            </div>
          )}

          {leg.items.map((item) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 36px', gap: 8, marginBottom: 6, alignItems: 'center' }}>
              <InputField
                value={item.deskripsi}
                onChange={(v) => onUpdateItem(item.id, 'deskripsi', v)}
                placeholder="Nama biaya"
              />
              <NumberInput
                value={item.biaya}
                onChange={(v) => onUpdateItem(item.id, 'biaya', v)}
                placeholder="0"
                currency
              />
              <DeleteBtn onClick={() => onRemoveItem(item.id)} />
            </div>
          ))}

          <AddButton label="Tambah Biaya" onClick={onAddItem} />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 12,
              paddingTop: 10,
              borderTop: '1.5px solid var(--border)',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Subtotal {label}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: subtotal > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
              Rp {formatRp(subtotal)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
