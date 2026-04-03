import React, { useState } from 'react';
import { Card, SectionHeader, Divider } from '../ui';
import { ComputedValues, CalculatorState } from '../../types';
import { formatRp, formatWeight, formatCbm } from '../../utils/calculations';
import { TARGET_MARGIN } from '../../data/masterdata';

export function Step6Breakdown({
  computed,
  state,
}: {
  computed: ComputedValues;
  state: CalculatorState;
}) {
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [showWeight, setShowWeight] = useState(true);

  const {
    marginStatus, marginPct, margin, totalRevenue, totalCost,
    revenueBerat, revenueKoli, subtotalFirstMile, subtotalMiddleMile,
    subtotalLastMile, totalOpsCost, totalExtraCost, weightSummary,
    minHargaKgFor40, costReductionFor40, minRevenueFor40,
  } = computed;

  const colors = {
    ok: { fg: 'var(--success)', bg: 'var(--success-light)', border: 'rgba(39,174,96,0.25)' },
    warning: { fg: 'var(--warning)', bg: 'var(--warning-light)', border: 'rgba(243,156,18,0.25)' },
    rugi: { fg: 'var(--danger)', bg: 'var(--danger-light)', border: 'rgba(231,76,60,0.25)' },
  };
  const c = colors[marginStatus];
  const icon = marginStatus === 'ok' ? '✅' : marginStatus === 'warning' ? '⚠️' : '🔴';

  return (
    <Card>
      <SectionHeader icon="📊" title="Hasil Estimasi Margin" />

      {/* Alert */}
      <div style={{ display: 'flex', gap: 12, padding: 16, background: c.bg, borderRadius: 'var(--radius-md)', border: `1px solid ${c.border}`, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          {marginStatus === 'ok' ? (
            <>
              <div style={{ fontWeight: 700, fontSize: 15, color: c.fg, marginBottom: 4 }}>Target Margin Tercapai!</div>
              <div style={{ fontSize: 13, color: c.fg }}>Margin saat ini: {marginPct.toFixed(2)}% (target minimal {TARGET_MARGIN}%)</div>
            </>
          ) : marginStatus === 'warning' ? (
            <>
              <div style={{ fontWeight: 700, fontSize: 15, color: c.fg, marginBottom: 8 }}>Belum Memenuhi Target {TARGET_MARGIN}%</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', fontSize: 13 }}>
                <AlertRow label="Margin saat ini" value={`${marginPct.toFixed(2)}%`} color={c.fg} />
                <AlertRow label="Kekurangan" value={`${(TARGET_MARGIN - marginPct).toFixed(2)}%`} color={c.fg} />
                <AlertRow label="Revenue minimum" value={`Rp ${formatRp(minRevenueFor40)}`} color={c.fg} />
                <AlertRow label="Harga/kg minimum" value={`Rp ${formatRp(minHargaKgFor40)}`} color={c.fg} />
                <AlertRow label="Atau kurangi cost" value={`Rp ${formatRp(costReductionFor40)}`} color={c.fg} />
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700, fontSize: 15, color: c.fg, marginBottom: 8 }}>RUGI — Margin Negatif</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', fontSize: 13 }}>
                <AlertRow label="Margin saat ini" value={`${marginPct.toFixed(2)}%`} color={c.fg} />
                <AlertRow label="Kerugian" value={`Rp ${formatRp(Math.abs(margin))}`} color={c.fg} />
                <AlertRow label="Revenue minimum (40%)" value={`Rp ${formatRp(minRevenueFor40)}`} color={c.fg} />
                <AlertRow label="Harga/kg minimum" value={`Rp ${formatRp(minHargaKgFor40)}`} color={c.fg} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Breakdown */}
      <CollapseSection title="Detail Breakdown" open={showBreakdown} onToggle={() => setShowBreakdown(v => !v)}>
        <div style={{ background: 'var(--card-inner)', borderRadius: 'var(--radius-md)', padding: 16, border: '1px solid var(--border)', fontSize: 13 }}>
          <BdGroup label="REVENUE" amount={totalRevenue} color="var(--success)">
            <BdRow label={`Berat: ${weightSummary.totalChargeableWeight}kg × Rp${formatRp(state.tariff.hargaPerKg)}`} amount={revenueBerat} indent={1} />
            <BdRow label={`Koli: ${weightSummary.totalKoli} × Rp${formatRp(state.tariff.hargaPerKoli)}`} amount={revenueKoli} indent={1} />
          </BdGroup>
          <BdGroup label="BIAYA OPERASIONAL" amount={totalOpsCost} color="var(--danger)">
            <BdRow label={`First Mile${state.legs.firstMile.vendor ? ` (${state.legs.firstMile.vendor})` : ''}`} amount={subtotalFirstMile} indent={1} />
            {state.legs.firstMile.items.map(i => <BdRow key={i.id} label={i.deskripsi || '—'} amount={i.biaya} indent={2} />)}
            <BdRow label={`Middle Mile${state.legs.middleMile.vendor ? ` (${state.legs.middleMile.vendor})` : ''}`} amount={subtotalMiddleMile} indent={1} />
            {state.legs.middleMile.items.map(i => <BdRow key={i.id} label={i.deskripsi || '—'} amount={i.biaya} indent={2} />)}
            <BdRow label={`Last Mile${state.legs.lastMile.vendor ? ` (${state.legs.lastMile.vendor})` : ''}`} amount={subtotalLastMile} indent={1} />
            {state.legs.lastMile.items.map(i => <BdRow key={i.id} label={i.deskripsi || '—'} amount={i.biaya} indent={2} />)}
          </BdGroup>
          {totalExtraCost > 0 && (
            <BdGroup label="BIAYA TAMBAHAN" amount={totalExtraCost} color="var(--warning)">
              {state.extraCosts.map(i => <BdRow key={i.id} label={i.deskripsi || '—'} amount={i.biaya} indent={1} />)}
            </BdGroup>
          )}
          <Divider my={10} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <FinalCard label="Total Cost" value={`Rp ${formatRp(totalCost)}`} color="var(--danger)" />
            <FinalCard label="Margin" value={`Rp ${formatRp(margin)}`} color={marginStatus === 'ok' ? 'var(--success)' : 'var(--warning)'} />
            <FinalCard label="Margin %" value={`${marginPct.toFixed(2)}%`} color={c.fg} bg={c.bg} large />
          </div>
        </div>
      </CollapseSection>

      <Divider my={16} />

      {/* Ringkasan Berat */}
      <CollapseSection title="Ringkasan Berat & Efisiensi" open={showWeight} onToggle={() => setShowWeight(v => !v)}>
        <div style={{ background: 'var(--card-inner)', borderRadius: 'var(--radius-md)', padding: 16, border: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
            {[
              ['Total Koli', `${weightSummary.totalKoli} koli`],
              ['Actual Weight', formatWeight(weightSummary.totalActualWeight)],
              ['Volumetric Weight', formatWeight(weightSummary.totalVolumetricWeight, 1)],
              ['Kubikasi (CBM)', formatCbm(weightSummary.totalCbm)],
            ].map(([l, v]) => <ERow key={l} label={l} value={v} />)}
          </div>
          <ERow label="Chargeable Weight ★" value={formatWeight(weightSummary.totalChargeableWeight, 0)} highlight />
          <Divider my={8} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
            <ERow label="Biaya per Kg (CW)" value={`Rp ${formatRp(weightSummary.totalChargeableWeight > 0 ? totalCost / weightSummary.totalChargeableWeight : 0)}`} />
            <ERow label="Revenue per Kg (CW)" value={`Rp ${formatRp(weightSummary.totalChargeableWeight > 0 ? totalRevenue / weightSummary.totalChargeableWeight : 0)}`} />
          </div>
        </div>
      </CollapseSection>
    </Card>
  );
}

// Sub-components
function AlertRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', color, padding: '2px 0' }}>
      <span>→ {label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function CollapseSection({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <>
      <button onClick={onToggle} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', border: 'none', background: 'none', cursor: 'pointer', padding: '6px 0', marginBottom: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{title}</span>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{open ? '▼' : '▶'}</span>
      </button>
      {open && children}
    </>
  );
}

function BdGroup({ label, amount, color, children }: { label: string; amount: number; color: string; children?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{label}</span>
        <span style={{ fontWeight: 700, color }}>Rp {formatRp(amount)}</span>
      </div>
      {children}
    </div>
  );
}

function BdRow({ label, amount, indent = 0 }: { label: string; amount: number; indent?: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: indent * 16, paddingTop: 2, paddingBottom: 2 }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
        {indent === 1 ? '├─ ' : indent === 2 ? '│  └─ ' : ''}{label}
      </span>
      <span style={{ fontWeight: 600, fontSize: 12 }}>Rp {formatRp(amount)}</span>
    </div>
  );
}

function FinalCard({ label, value, color, bg, large }: { label: string; value: string; color: string; bg?: string; large?: boolean }) {
  return (
    <div style={{ background: bg ?? 'var(--card)', border: `1px solid ${color}30`, borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.4px', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: large ? 22 : 16, fontWeight: 800, color }}>{value}</div>
    </div>
  );
}

function ERow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 13, color: highlight ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: highlight ? 600 : 400 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: highlight ? 800 : 600, color: highlight ? 'var(--primary)' : 'var(--text)' }}>{value}</span>
    </div>
  );
}
