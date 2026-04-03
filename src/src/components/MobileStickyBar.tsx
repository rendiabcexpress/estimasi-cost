import React from 'react';
import { ComputedValues, ShippingInfo } from '../types';
import { formatRp } from '../utils/calculations';
import { TARGET_MARGIN } from '../data/masterdata';

export function MobileStickyBar({
  computed,
  shippingInfo,
  className,
}: {
  computed: ComputedValues;
  shippingInfo: ShippingInfo;
  className?: string;
}) {
  const {
    totalRevenue, totalCost, margin, marginPct, marginStatus,
    weightSummary, minHargaKgFor40, costReductionFor40,
  } = computed;

  const statusColor =
    marginStatus === 'ok' ? '#27AE60' : marginStatus === 'warning' ? '#F39C12' : '#E74C3C';
  const statusBg =
    marginStatus === 'ok' ? '#E8F8EF' : marginStatus === 'warning' ? '#FEF6E7' : '#FDECEA';
  const statusIcon = marginStatus === 'ok' ? '✅' : marginStatus === 'warning' ? '⚠️' : '🔴';

  const route =
    shippingInfo.asalKotaName && shippingInfo.tujuanKotaName
      ? `${shippingInfo.asalKotaName} → ${shippingInfo.tujuanKotaName}`
      : null;

  const statusMsg =
    marginStatus === 'ok'
      ? `Target ${TARGET_MARGIN}% tercapai!`
      : marginStatus === 'warning'
      ? `Kurangi cost Rp ${formatRp(Math.ceil(costReductionFor40))} atau naikkan ke Rp ${formatRp(Math.ceil(minHargaKgFor40))}/kg`
      : `Naikkan tarif min Rp ${formatRp(Math.ceil(minHargaKgFor40))}/kg`;

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        boxShadow: '0 -4px 16px rgba(26,29,58,0.12)',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: '10px 16px 20px',
        zIndex: 100,
        // safe area for iOS home indicator
        paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
      }}
    >
      {/* Route + weight info */}
      {route && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
          <span style={{ fontWeight: 700, color: 'var(--text)' }}>{route}</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            {weightSummary.totalKoli > 0 && `${weightSummary.totalKoli} koli · `}
            {weightSummary.totalChargeableWeight > 0 && `${weightSummary.totalChargeableWeight}kg CW`}
          </span>
        </div>
      )}

      {/* 4 metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 6 }}>
        <MetricCard label="Revenue" value={formatRp(totalRevenue, true)} color="#27AE60" bg="#E8F8EF" />
        <MetricCard
          label="Cost"
          value={formatRp(totalCost, true)}
          color={totalCost > totalRevenue ? '#E74C3C' : 'var(--text)'}
          bg={totalCost > totalRevenue ? '#FDECEA' : 'var(--card-inner)'}
        />
        <MetricCard
          label="Margin"
          value={`${margin >= 0 ? '' : '-'}${formatRp(Math.abs(margin), true)}`}
          color={statusColor}
          bg={statusBg}
        />
        <MetricCard
          label="Margin %"
          value={`${marginPct.toFixed(1)}%`}
          color={statusColor}
          bg={statusBg}
          bold
        />
      </div>

      {/* Status message */}
      <div
        style={{
          background: statusBg,
          borderRadius: 8,
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{ fontSize: 13 }}>{statusIcon}</span>
        <span style={{ fontSize: 11, color: statusColor, fontWeight: 600, lineHeight: 1.4 }}>
          {statusMsg}
        </span>
      </div>
    </div>
  );
}

function MetricCard({
  label, value, color, bg, bold = false,
}: {
  label: string; value: string; color: string; bg: string; bold?: boolean;
}) {
  return (
    <div
      style={{
        background: bg,
        borderRadius: 8,
        padding: '6px 4px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: bold ? 14 : 12, fontWeight: bold ? 900 : 700, color }}>
        {value}
      </div>
    </div>
  );
}
