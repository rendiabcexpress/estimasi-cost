import React from 'react';
import { ComputedValues, ShippingInfo } from '../types';
import { formatRp, formatWeight, formatCbm } from '../utils/calculations';
import { TARGET_MARGIN } from '../data/masterdata';

export function SummaryPanel({
  computed,
  shippingInfo,
}: {
  computed: ComputedValues;
  shippingInfo: ShippingInfo;
}) {
  const {
    totalRevenue, totalCost, margin, marginPct, marginStatus,
    weightSummary, subtotalFirstMile, subtotalMiddleMile, subtotalLastMile,
    totalOpsCost, totalExtraCost, minHargaKgFor40, costReductionFor40, minRevenueFor40,
  } = computed;

  const statusColor =
    marginStatus === 'ok' ? '#16A34A' : marginStatus === 'warning' ? '#D97706' : '#DC2626';
  const statusBg =
    marginStatus === 'ok' ? '#DCFCE7' : marginStatus === 'warning' ? '#FEF3C7' : '#FEE2E2';
  const statusIcon = marginStatus === 'ok' ? '✅' : marginStatus === 'warning' ? '⚠️' : '🔴';

  const route =
    shippingInfo.asalKotaName && shippingInfo.tujuanKotaName
      ? `${shippingInfo.asalKotaName} → ${shippingInfo.tujuanKotaName}`
      : 'Belum ada route';

  const statusMsg =
    marginStatus === 'ok'
      ? `Target ${TARGET_MARGIN}% tercapai!`
      : marginStatus === 'warning'
      ? `Naikkan ke Rp ${formatRp(Math.ceil(minHargaKgFor40))}/kg atau kurangi cost Rp ${formatRp(Math.ceil(costReductionFor40))}`
      : `Naikkan tarif ke min Rp ${formatRp(Math.ceil(minHargaKgFor40))}/kg (revenue min Rp ${formatRp(Math.ceil(minRevenueFor40))})`;

  return (
    <div
      style={{
        position: 'sticky',
        top: 76,
        maxHeight: 'calc(100vh - 92px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* Route header */}
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
          Route
        </div>
        <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text)', marginBottom: 6 }}>{route}</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {weightSummary.totalKoli > 0 && <Chip>{weightSummary.totalKoli} koli</Chip>}
          {weightSummary.totalChargeableWeight > 0 && (
            <Chip primary>{formatWeight(weightSummary.totalChargeableWeight, 0)} CW</Chip>
          )}
          {weightSummary.totalCbm > 0 && <Chip>{formatCbm(weightSummary.totalCbm)}</Chip>}
        </div>
      </div>

      {/* Margin % — big card */}
      <div
        style={{
          background: statusBg,
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          border: `2px solid ${statusColor}40`,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
          Margin %
        </div>
        <div style={{ fontSize: 40, fontWeight: 900, color: statusColor, lineHeight: 1.1 }}>
          {marginPct.toFixed(1)}%
        </div>
        <div style={{ fontSize: 11, color: statusColor, marginTop: 4, fontWeight: 500 }}>
          Target: {TARGET_MARGIN}%
        </div>
      </div>

      {/* 3 summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
        <MetricCard
          label="Est. Revenue"
          value={`Rp ${formatRp(totalRevenue)}`}
          valueColor="var(--success)"
          note={`${formatWeight(weightSummary.totalChargeableWeight, 0)} CW × tarif`}
        />
        <MetricCard
          label="Total Cost"
          value={`Rp ${formatRp(totalCost)}`}
          valueColor={totalCost > totalRevenue ? 'var(--danger)' : 'var(--text)'}
          note={`Ops Rp ${formatRp(totalOpsCost)} + Extra Rp ${formatRp(totalExtraCost)}`}
        />
        <MetricCard
          label="Est. Margin"
          value={`Rp ${formatRp(margin)}`}
          valueColor={marginStatus === 'ok' ? 'var(--success)' : marginStatus === 'warning' ? 'var(--warning)' : 'var(--danger)'}
          note="Revenue − Total Cost"
        />
      </div>

      {/* Status message */}
      <div
        style={{
          background: statusBg,
          border: `1px solid ${statusColor}40`,
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
        }}
      >
        <span style={{ fontSize: 16, flexShrink: 0 }}>{statusIcon}</span>
        <span style={{ fontSize: 12, color: statusColor, fontWeight: 600, lineHeight: 1.5 }}>
          {statusMsg}
        </span>
      </div>

      {/* Cost breakdown mini */}
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
          Biaya per Leg
        </div>
        <LegBar label="First Mile" amount={subtotalFirstMile} total={totalCost} color="#2563EB" />
        <LegBar label="Middle Mile" amount={subtotalMiddleMile} total={totalCost} color="#7C3AED" />
        <LegBar label="Last Mile" amount={subtotalLastMile} total={totalCost} color="#16A34A" />
        {totalExtraCost > 0 && (
          <LegBar label="Biaya Tambahan" amount={totalExtraCost} total={totalCost} color="#D97706" />
        )}
      </div>
    </div>
  );
}

// Sub-components
function Chip({ children, primary }: { children: React.ReactNode; primary?: boolean }) {
  return (
    <span
      style={{
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        background: primary ? 'var(--primary-light)' : 'var(--bg)',
        color: primary ? 'var(--primary)' : 'var(--text-secondary)',
        fontSize: 11,
        fontWeight: 600,
        border: `1px solid ${primary ? 'rgba(37,99,235,0.3)' : 'var(--border)'}`,
      }}
    >
      {children}
    </span>
  );
}

function MetricCard({
  label,
  value,
  valueColor,
  note,
}: {
  label: string;
  value: string;
  valueColor: string;
  note?: string;
}) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 2 }}>
          {label}
        </div>
        {note && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{note}</div>}
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color: valueColor, textAlign: 'right', whiteSpace: 'nowrap' }}>
        {value}
      </div>
    </div>
  );
}

function LegBar({
  label,
  amount,
  total,
  color,
}: {
  label: string;
  amount: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontSize: 12 }}>
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{label}</span>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
          {pct.toFixed(0)}% · Rp {formatRp(amount, true)}
        </span>
      </div>
      <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: color,
            borderRadius: 3,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}
