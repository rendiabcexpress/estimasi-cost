import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, shadow, radius } from './ui/theme';
import { ComputedValues, ShippingInfo } from '../types';
import { formatRp } from '../utils/calculations';

interface Props {
  computed: ComputedValues;
  shippingInfo: ShippingInfo;
}

export function StickyMarginBar({ computed, shippingInfo }: Props) {
  const {
    totalRevenue,
    totalCost,
    margin,
    marginPct,
    marginStatus,
    weightSummary,
    minHargaKgFor40,
    costReductionFor40,
  } = computed;

  const statusColor =
    marginStatus === 'ok'
      ? colors.success
      : marginStatus === 'warning'
      ? colors.warning
      : colors.danger;

  const statusBgLight =
    marginStatus === 'ok'
      ? colors.successLight
      : marginStatus === 'warning'
      ? colors.warningLight
      : colors.dangerLight;

  const routeLabel =
    shippingInfo.asalKotaName && shippingInfo.tujuanKotaName
      ? `${shippingInfo.asalKotaName} → ${shippingInfo.tujuanKotaName}`
      : 'Belum ada route';

  const statusMsg =
    marginStatus === 'ok'
      ? '✅ Target 40% tercapai!'
      : marginStatus === 'warning'
      ? `⚠ Belum 40% — naikkan tarif ke Rp ${formatRp(Math.ceil(minHargaKgFor40))}/kg atau kurangi cost Rp ${formatRp(Math.ceil(costReductionFor40))}`
      : `🔴 RUGI — naikkan tarif ke min Rp ${formatRp(Math.ceil(minHargaKgFor40))}/kg`;

  return (
    <View style={styles.container}>
      {/* Route info */}
      <View style={styles.routeRow}>
        <Text style={styles.routeText} numberOfLines={1}>
          {routeLabel}
        </Text>
        <Text style={styles.routeMeta}>
          {weightSummary.totalKoli > 0 ? `${weightSummary.totalKoli} koli` : ''}
          {weightSummary.totalChargeableWeight > 0
            ? `  ${weightSummary.totalChargeableWeight}kg CW`
            : ''}
          {weightSummary.totalCbm > 0
            ? `  ${weightSummary.totalCbm.toFixed(2)}m³`
            : ''}
        </Text>
      </View>

      {/* 4 summary cards */}
      <View style={styles.cards}>
        <SummaryCard
          label="Revenue"
          value={`${formatRp(totalRevenue, true)}`}
          color={colors.success}
          bgColor={colors.successLight}
        />
        <SummaryCard
          label="Total Cost"
          value={`${formatRp(totalCost, true)}`}
          color={totalCost > totalRevenue ? colors.danger : colors.textPrimary}
          bgColor={totalCost > totalRevenue ? colors.dangerLight : colors.cardInner}
        />
        <SummaryCard
          label="Margin"
          value={`${margin >= 0 ? '' : '-'}${formatRp(Math.abs(margin), true)}`}
          color={statusColor}
          bgColor={statusBgLight}
        />
        <SummaryCard
          label="Margin %"
          value={`${marginPct.toFixed(1)}%`}
          color={statusColor}
          bgColor={statusBgLight}
          bold
        />
      </View>

      {/* Status message */}
      <View style={[styles.msgRow, { backgroundColor: statusBgLight }]}>
        <Text style={[styles.msgText, { color: statusColor }]} numberOfLines={2}>
          {statusMsg}
        </Text>
      </View>
    </View>
  );
}

function SummaryCard({
  label,
  value,
  color,
  bgColor,
  bold = false,
}: {
  label: string;
  value: string;
  color: string;
  bgColor: string;
  bold?: boolean;
}) {
  return (
    <View style={[scStyles.card, { backgroundColor: bgColor }]}>
      <Text style={scStyles.label}>{label}</Text>
      <Text style={[scStyles.value, { color }, bold && scStyles.boldValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
    ...shadow.sticky,
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  routeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  routeMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  cards: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  msgRow: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  msgText: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
  },
});

const scStyles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.sm,
    padding: spacing.xs,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  boldValue: {
    fontSize: 15,
    fontWeight: '900',
  },
});
