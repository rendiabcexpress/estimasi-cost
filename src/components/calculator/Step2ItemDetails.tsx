import React from 'react';
import {
  Card,
  SectionHeader,
  SegmentedControl,
  NumberInput,
  AutoField,
  AddButton,
  DeleteBtn,
  Divider,
  InfoNote,
} from '../ui';
import { IconRulerMeasure } from '@tabler/icons-react';
import { DimensionItem, DirectInput, InputMode, DimensionItemCalculated, WeightSummary } from '../../types';
import { formatWeight, formatCbm } from '../../utils/calculations';

const MODE_OPTIONS = [
  { value: 'dimensi' as InputMode, label: 'Dari Dimensi' },
  { value: 'langsung' as InputMode, label: 'Input Langsung' },
];

function SummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '6px 0',
        borderBottom: '1px solid var(--border)',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontSize: 13,
          color: highlight ? 'var(--primary)' : 'var(--text-secondary)',
          fontWeight: highlight ? 600 : 400,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: highlight ? 800 : 600,
          color: highlight ? 'var(--primary)' : 'var(--text)',
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Dimension Item Card (vertical layout) ──────────────────────────────────

function DimensionItemCard({
  item,
  index,
  onUpdate,
  onRemove,
}: {
  item: DimensionItemCalculated;
  index: number;
  onUpdate: (field: keyof DimensionItem, value: number) => void;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 14,
        marginBottom: 8,
        background: 'white',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          Barang #{index + 1}
        </span>
        <DeleteBtn onClick={onRemove} />
      </div>

      {/* Input fields - 5 cols on desktop, 2+3 rows on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 10 }} className="card-grid-dim-input">
        <NumberInput label="Koli" value={item.koli} onChange={(v) => onUpdate('koli', v)} placeholder="0" />
        <NumberInput label="P (cm)" value={item.panjang} onChange={(v) => onUpdate('panjang', v)} placeholder="0" />
        <NumberInput label="L (cm)" value={item.lebar} onChange={(v) => onUpdate('lebar', v)} placeholder="0" />
        <NumberInput label="T (cm)" value={item.tinggi} onChange={(v) => onUpdate('tinggi', v)} placeholder="0" />
        <NumberInput label="Berat (kg)" value={item.berat} onChange={(v) => onUpdate('berat', v)} placeholder="0" />
      </div>

      {/* Auto-calculated results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }} className="card-grid-dim-result">
        <AutoResult label="Act.W" value={`${item.actualWeight}`} />
        <AutoResult label="Vol.W" value={item.volumetricWeight.toFixed(1)} />
        <AutoResult label="CW" value={`${item.chargeableWeight}`} highlight />
        <AutoResult label="CBM" value={item.cbm.toFixed(3)} />
      </div>
    </div>
  );
}

function AutoResult({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 3 }}>
        {label}
      </div>
      <div
        style={{
          background: highlight ? 'var(--primary-light)' : 'var(--card-inner)',
          borderRadius: 6,
          padding: '6px 8px',
          fontSize: 13,
          fontWeight: highlight ? 800 : 600,
          color: highlight ? 'var(--primary-dark)' : 'var(--primary)',
          textAlign: 'center',
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

interface Props {
  inputMode: InputMode;
  onModeChange: (m: InputMode) => void;
  items: DimensionItem[];
  itemsCalculated: DimensionItemCalculated[];
  directInput: DirectInput;
  weightSummary: WeightSummary;
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof DimensionItem, value: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateDirect: (field: keyof DirectInput, value: number) => void;
}

export function Step2ItemDetails({
  inputMode,
  onModeChange,
  items,
  itemsCalculated,
  directInput,
  weightSummary,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onUpdateDirect,
}: Props) {
  return (
    <Card>
      <SectionHeader icon={<IconRulerMeasure size={20} stroke={1.5} />} title="Detail Barang & Berat" />
      <SegmentedControl options={MODE_OPTIONS} value={inputMode} onChange={onModeChange} />

      {inputMode === 'dimensi' ? (
        <>
          {itemsCalculated.map((item, i) => (
            <DimensionItemCard
              key={item.id}
              item={item}
              index={i}
              onUpdate={(f, v) => onUpdateItem(item.id, f, v)}
              onRemove={() => onRemoveItem(item.id)}
            />
          ))}
          <AddButton label="Tambah Baris" onClick={onAddItem} />
        </>
      ) : (
        <div>
          <div style={{ display: 'grid', gap: 12, marginBottom: 12 }} className="card-grid-3">
            <NumberInput
              label="Total Koli"
              value={directInput.koli}
              onChange={(v) => onUpdateDirect('koli', v)}
              placeholder="0"
            />
            <NumberInput
              label="Actual Weight (kg)"
              value={directInput.actualWeight}
              onChange={(v) => onUpdateDirect('actualWeight', v)}
              placeholder="0"
            />
            <NumberInput
              label="Volumetric Weight (kg)"
              value={directInput.volumetricWeight}
              onChange={(v) => onUpdateDirect('volumetricWeight', v)}
              placeholder="0"
            />
          </div>
          <div style={{ display: 'grid', gap: 12 }} className="card-grid-3">
            <NumberInput
              label="Chargeable Weight (kg)"
              value={directInput.chargeableWeight}
              onChange={(v) => onUpdateDirect('chargeableWeight', v)}
              placeholder="0"
            />
            <NumberInput
              label="CBM (m3)"
              value={directInput.cbm}
              onChange={(v) => onUpdateDirect('cbm', v)}
              placeholder="0"
            />
            <div />
          </div>
          <InfoNote>Chargeable Weight digunakan untuk perhitungan revenue</InfoNote>
        </div>
      )}

      <Divider my={16} />

      <Card inner>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
          Ringkasan Berat
        </div>
        <SummaryRow label="Total Koli" value={`${weightSummary.totalKoli} koli`} />
        <SummaryRow label="Actual Weight" value={formatWeight(weightSummary.totalActualWeight)} />
        <SummaryRow label="Volumetric Weight" value={formatWeight(weightSummary.totalVolumetricWeight, 1)} />
        <SummaryRow label="Kubikasi (CBM)" value={formatCbm(weightSummary.totalCbm)} />
        <SummaryRow
          label="Chargeable Weight (untuk revenue)"
          value={formatWeight(weightSummary.totalChargeableWeight, 0)}
          highlight
        />
      </Card>
    </Card>
  );
}
