import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { Divider } from '../ui/Divider';
import { colors, spacing, typography, radius } from '../ui/theme';
import { ComputedValues, CalculatorState } from '../../types';
import { formatRp, formatWeight, formatCbm } from '../../utils/calculations';
import { TARGET_MARGIN } from '../../data/masterdata';

interface Props {
  computed: ComputedValues;
  state: CalculatorState;
}

export function Step6Breakdown({ computed, state }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [showWeight, setShowWeight] = useState(true);

  const {
    marginStatus,
    marginPct,
    margin,
    totalRevenue,
    totalCost,
    revenueBerat,
    revenueKoli,
    subtotalFirstMile,
    subtotalMiddleMile,
    subtotalLastMile,
    totalOpsCost,
    totalExtraCost,
    weightSummary,
    minHargaKgFor40,
    costReductionFor40,
    minRevenueFor40,
  } = computed;

  const statusColor =
    marginStatus === 'ok'
      ? colors.success
      : marginStatus === 'warning'
      ? colors.warning
      : colors.danger;

  const statusBg =
    marginStatus === 'ok'
      ? colors.successLight
      : marginStatus === 'warning'
      ? colors.warningLight
      : colors.dangerLight;

  const statusIcon = marginStatus === 'ok' ? '✅' : marginStatus === 'warning' ? '⚠️' : '🔴';

  return (
    <Card>
      <SectionHeader icon="📊" title="Hasil Estimasi Margin" />

      {/* Alert margin status */}
      <View style={[styles.alertBox, { backgroundColor: statusBg, borderColor: statusColor + '50' }]}>
        <Text style={styles.alertIcon}>{statusIcon}</Text>
        <View style={styles.alertContent}>
          {marginStatus === 'ok' ? (
            <>
              <Text style={[styles.alertTitle, { color: statusColor }]}>
                Target Margin Tercapai!
              </Text>
              <Text style={[styles.alertSub, { color: statusColor }]}>
                Margin saat ini: {marginPct.toFixed(2)}% (target minimal {TARGET_MARGIN}%)
              </Text>
            </>
          ) : marginStatus === 'warning' ? (
            <>
              <Text style={[styles.alertTitle, { color: statusColor }]}>
                Belum Memenuhi Target {TARGET_MARGIN}%
              </Text>
              <AlertRow label="Margin saat ini" value={`${marginPct.toFixed(2)}%`} color={statusColor} />
              <AlertRow label="Kekurangan" value={`${(TARGET_MARGIN - marginPct).toFixed(2)}%`} color={statusColor} />
              <AlertRow label="Revenue minimum" value={`Rp ${formatRp(minRevenueFor40)}`} color={statusColor} />
              <AlertRow label="Harga/kg minimum" value={`Rp ${formatRp(minHargaKgFor40)}`} color={statusColor} />
              <AlertRow label="Atau kurangi cost" value={`Rp ${formatRp(costReductionFor40)}`} color={statusColor} />
            </>
          ) : (
            <>
              <Text style={[styles.alertTitle, { color: statusColor }]}>RUGI — Margin Negatif</Text>
              <AlertRow label="Margin saat ini" value={`${marginPct.toFixed(2)}%`} color={statusColor} />
              <AlertRow label="Kerugian" value={`Rp ${formatRp(Math.abs(margin))}`} color={statusColor} />
              <AlertRow label="Revenue minimum (40%)" value={`Rp ${formatRp(minRevenueFor40)}`} color={statusColor} />
              <AlertRow label="Harga/kg minimum" value={`Rp ${formatRp(minHargaKgFor40)}`} color={statusColor} />
            </>
          )}
        </View>
      </View>

      <Divider my={spacing.md} />

      {/* Detail Breakdown (collapsible) */}
      <TouchableOpacity
        style={styles.collapseHeader}
        onPress={() => setShowBreakdown((v) => !v)}
        activeOpacity={0.8}
      >
        <Text style={styles.collapseTitle}>Detail Breakdown</Text>
        <Text style={styles.collapseChevron}>{showBreakdown ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {showBreakdown && (
        <View style={styles.breakdownBox}>
          {/* Revenue */}
          <BdSection label="REVENUE" amount={totalRevenue} color={colors.success}>
            <BdRow label={`Berat: ${weightSummary.totalChargeableWeight}kg × Rp${formatRp(state.tariff.hargaPerKg)}`} amount={revenueBerat} />
            <BdRow label={`Koli: ${weightSummary.totalKoli} × Rp${formatRp(state.tariff.hargaPerKoli)}`} amount={revenueKoli} />
          </BdSection>

          {/* Biaya Operasional */}
          <BdSection label="BIAYA OPERASIONAL" amount={totalOpsCost} color={colors.danger}>
            <BdRow label={`First Mile${state.legs.firstMile.vendor ? ` (${state.legs.firstMile.vendor})` : ''}`} amount={subtotalFirstMile} indent={1}>
              {state.legs.firstMile.items.map((item) => (
                <BdRow key={item.id} label={item.deskripsi || '—'} amount={item.biaya} indent={2} />
              ))}
            </BdRow>
            <BdRow label={`Middle Mile${state.legs.middleMile.vendor ? ` (${state.legs.middleMile.vendor})` : ''}`} amount={subtotalMiddleMile} indent={1}>
              {state.legs.middleMile.items.map((item) => (
                <BdRow key={item.id} label={item.deskripsi || '—'} amount={item.biaya} indent={2} />
              ))}
            </BdRow>
            <BdRow label={`Last Mile${state.legs.lastMile.vendor ? ` (${state.legs.lastMile.vendor})` : ''}`} amount={subtotalLastMile} indent={1}>
              {state.legs.lastMile.items.map((item) => (
                <BdRow key={item.id} label={item.deskripsi || '—'} amount={item.biaya} indent={2} />
              ))}
            </BdRow>
          </BdSection>

          {/* Biaya Tambahan */}
          {totalExtraCost > 0 && (
            <BdSection label="BIAYA TAMBAHAN" amount={totalExtraCost} color={colors.warning}>
              {computed.itemsCalculated.length === 0 &&
                /* extra costs items */
                null}
              {state.extraCosts.map((item) => (
                <BdRow key={item.id} label={item.deskripsi || '—'} amount={item.biaya} indent={1} />
              ))}
            </BdSection>
          )}

          {/* Summary */}
          <Divider />
          <View style={styles.summaryBlock}>
            <SummaryFinalRow label="TOTAL COST" amount={totalCost} color={colors.danger} />
            <SummaryFinalRow label="MARGIN" amount={margin} color={marginStatus === 'ok' ? colors.success : colors.warning} />
            <View style={[styles.marginPctRow, { backgroundColor: statusBg }]}>
              <Text style={[styles.marginPctLabel, { color: statusColor }]}>MARGIN %</Text>
              <Text style={[styles.marginPctValue, { color: statusColor }]}>
                {marginPct.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
      )}

      <Divider my={spacing.md} />

      {/* Ringkasan Berat & Efisiensi (collapsible) */}
      <TouchableOpacity
        style={styles.collapseHeader}
        onPress={() => setShowWeight((v) => !v)}
        activeOpacity={0.8}
      >
        <Text style={styles.collapseTitle}>Ringkasan Berat & Efisiensi</Text>
        <Text style={styles.collapseChevron}>{showWeight ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {showWeight && (
        <View style={styles.weightBox}>
          <ERow label="Total Koli" value={`${weightSummary.totalKoli} koli`} />
          <ERow label="Actual Weight" value={formatWeight(weightSummary.totalActualWeight)} />
          <ERow label="Volumetric Weight" value={formatWeight(weightSummary.totalVolumetricWeight, 1)} />
          <ERow label="Chargeable Weight ★" value={formatWeight(weightSummary.totalChargeableWeight, 0)} highlight />
          <ERow label="Kubikasi (CBM)" value={formatCbm(weightSummary.totalCbm)} />
          <Divider my={spacing.xs} />
          <ERow
            label="Biaya per Kg (CW)"
            value={`Rp ${formatRp(weightSummary.totalChargeableWeight > 0 ? totalCost / weightSummary.totalChargeableWeight : 0)}`}
          />
          <ERow
            label="Revenue per Kg (CW)"
            value={`Rp ${formatRp(weightSummary.totalChargeableWeight > 0 ? totalRevenue / weightSummary.totalChargeableWeight : 0)}`}
          />
        </View>
      )}
    </Card>
  );
}

// Sub-components
function AlertRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={arStyles.row}>
      <Text style={[arStyles.label, { color }]}>→ {label}</Text>
      <Text style={[arStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

function BdSection({
  label,
  amount,
  color,
  children,
}: {
  label: string;
  amount: number;
  color: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={bdStyles.section}>
      <View style={bdStyles.sectionHeader}>
        <Text style={[bdStyles.sectionLabel, { color }]}>{label}</Text>
        <Text style={[bdStyles.sectionAmount, { color }]}>Rp {formatRp(amount)}</Text>
      </View>
      {children}
    </View>
  );
}

function BdRow({
  label,
  amount,
  indent = 0,
  children,
}: {
  label: string;
  amount: number;
  indent?: number;
  children?: React.ReactNode;
}) {
  return (
    <>
      <View style={[bdStyles.row, { paddingLeft: indent * 12 }]}>
        <Text style={bdStyles.rowLabel}>
          {indent > 0 ? (indent === 1 ? '├─ ' : '│  └─ ') : ''}
          {label}
        </Text>
        <Text style={bdStyles.rowAmount}>Rp {formatRp(amount)}</Text>
      </View>
      {children}
    </>
  );
}

function SummaryFinalRow({
  label,
  amount,
  color,
}: {
  label: string;
  amount: number;
  color: string;
}) {
  return (
    <View style={sfStyles.row}>
      <Text style={sfStyles.label}>{label}</Text>
      <Text style={[sfStyles.value, { color }]}>Rp {formatRp(amount)}</Text>
    </View>
  );
}

function ERow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={erStyles.row}>
      <Text style={[erStyles.label, highlight && erStyles.hlLabel]}>{label}</Text>
      <Text style={[erStyles.value, highlight && erStyles.hlValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  alertBox: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  alertIcon: { fontSize: 20 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  alertSub: { fontSize: 12 },
  collapseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  collapseTitle: { ...typography.bodyBold, color: colors.textPrimary },
  collapseChevron: { fontSize: 12, color: colors.textSecondary },
  breakdownBox: {
    backgroundColor: colors.cardInner,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryBlock: { marginTop: spacing.sm },
  marginPctRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginTop: spacing.xs,
  },
  marginPctLabel: { fontSize: 15, fontWeight: '800' },
  marginPctValue: { fontSize: 20, fontWeight: '900' },
  weightBox: {
    backgroundColor: colors.cardInner,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

const arStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
  label: { fontSize: 12, flex: 1 },
  value: { fontSize: 12, fontWeight: '700', marginLeft: spacing.sm },
});

const bdStyles = StyleSheet.create({
  section: { marginBottom: spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  sectionLabel: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionAmount: { fontSize: 13, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  rowLabel: { fontSize: 11, color: colors.textSecondary, flex: 1 },
  rowAmount: { fontSize: 11, fontWeight: '600', color: colors.textPrimary },
});

const sfStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  label: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  value: { fontSize: 14, fontWeight: '800' },
});

const erStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  label: { fontSize: 13, color: colors.textSecondary },
  value: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  hlLabel: { color: colors.primary, fontWeight: '600' },
  hlValue: { color: colors.primary, fontWeight: '800' },
});
