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
import { DimensionItem, DirectInput, InputMode, DimensionItemCalculated, WeightSummary } from '../../types';
import { formatWeight, formatCbm } from '../../utils/calculations';

const MODE_OPTIONS = [
  { value: 'dimensi' as InputMode, label: 'Dari Dimensi' },
  { value: 'langsung' as InputMode, label: 'Input Langsung' },
];

const TH = ({ children, width = 80 }: { children: React.ReactNode; width?: number }) => (
  <th
    style={{
      width,
      padding: '4px 6px',
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </th>
);

const TD = ({
  children,
  auto = false,
  highlight = false,
}: {
  children: React.ReactNode;
  auto?: boolean;
  highlight?: boolean;
}) => (
  <td
    style={{
      padding: '4px 6px',
      textAlign: 'center',
      background: highlight
        ? 'var(--primary-light)'
        : auto
        ? 'var(--card-inner)'
        : 'transparent',
      fontSize: 12,
      fontWeight: auto ? 600 : 400,
      color: highlight ? 'var(--primary-dark)' : auto ? 'var(--primary)' : 'var(--text)',
      borderRadius: highlight ? 4 : 0,
    }}
  >
    {children}
  </td>
);

function CellNumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      value={value > 0 ? value : ''}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      placeholder="0"
      style={{
        width: 72,
        height: 32,
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '0 4px',
        textAlign: 'center',
        fontSize: 12,
        color: 'var(--text)',
        background: 'white',
        outline: 'none',
      }}
      onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
      onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
    />
  );
}

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
      <SectionHeader icon="📐" title="Detail Barang & Berat" />
      <SegmentedControl options={MODE_OPTIONS} value={inputMode} onChange={onModeChange} />

      {inputMode === 'dimensi' ? (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <TH width={72}>Koli</TH>
                  <TH width={72}>P (cm)</TH>
                  <TH width={72}>L (cm)</TH>
                  <TH width={72}>T (cm)</TH>
                  <TH width={80}>Brt (kg)</TH>
                  <TH width={72}>Act.W</TH>
                  <TH width={72}>Vol.W</TH>
                  <TH width={80}>CW ★</TH>
                  <TH width={80}>CBM</TH>
                  <TH width={40}>{''}</TH>
                </tr>
              </thead>
              <tbody>
                {itemsCalculated.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    {(['koli', 'panjang', 'lebar', 'tinggi', 'berat'] as const).map((f) => (
                      <TD key={f}>
                        <CellNumberInput
                          value={item[f]}
                          onChange={(v) => onUpdateItem(item.id, f, v)}
                        />
                      </TD>
                    ))}
                    <TD auto>{item.actualWeight}</TD>
                    <TD auto>{item.volumetricWeight.toFixed(1)}</TD>
                    <TD auto highlight>{item.chargeableWeight}</TD>
                    <TD auto>{item.cbm.toFixed(3)}</TD>
                    <td style={{ textAlign: 'center', padding: '4px' }}>
                      <DeleteBtn onClick={() => onRemoveItem(item.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              label="Chargeable Weight (kg) ★"
              value={directInput.chargeableWeight}
              onChange={(v) => onUpdateDirect('chargeableWeight', v)}
              placeholder="0"
            />
            <NumberInput
              label="CBM (m³)"
              value={directInput.cbm}
              onChange={(v) => onUpdateDirect('cbm', v)}
              placeholder="0"
            />
            <div />
          </div>
          <InfoNote>★ Chargeable Weight digunakan untuk perhitungan revenue</InfoNote>
        </div>
      )}

      <Divider my={16} />

      <Card inner>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
          Ringkasan Berat
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          <SummaryRow label="Total Koli" value={`${weightSummary.totalKoli} koli`} />
          <SummaryRow label="Actual Weight" value={formatWeight(weightSummary.totalActualWeight)} />
          <SummaryRow label="Volumetric Weight" value={formatWeight(weightSummary.totalVolumetricWeight, 1)} />
          <SummaryRow label="Kubikasi (CBM)" value={formatCbm(weightSummary.totalCbm)} />
        </div>
        <SummaryRow
          label="Chargeable Weight ★ (dipakai untuk revenue)"
          value={formatWeight(weightSummary.totalChargeableWeight, 0)}
          highlight
        />
      </Card>
    </Card>
  );
}
