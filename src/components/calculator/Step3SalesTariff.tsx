import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { InputField } from '../ui/InputField';
import { Divider } from '../ui/Divider';
import { colors, spacing, typography, radius } from '../ui/theme';
import { Tariff } from '../../types';
import { formatRp } from '../../utils/calculations';

interface Props {
  tariff: Tariff;
  onChangeTariff: (field: keyof Tariff, value: number) => void;
  totalCW: number;
  totalKoli: number;
  revenueBerat: number;
  revenueKoli: number;
  totalRevenue: number;
}

export function Step3SalesTariff({
  tariff,
  onChangeTariff,
  totalCW,
  totalKoli,
  revenueBerat,
  revenueKoli,
  totalRevenue,
}: Props) {
  return (
    <Card>
      <SectionHeader icon="💰" title="Tarif Penjualan" />

      <View style={styles.row}>
        <InputField
          label="Harga per Kg (Rp)"
          value={tariff.hargaPerKg > 0 ? String(tariff.hargaPerKg) : ''}
          onChangeText={(v) => onChangeTariff('hargaPerKg', parseFloat(v) || 0)}
          keyboardType="numeric"
          prefix="Rp"
          style={styles.half}
        />
        <View style={styles.gap} />
        <InputField
          label="Harga per Koli (Rp)"
          value={tariff.hargaPerKoli > 0 ? String(tariff.hargaPerKoli) : ''}
          onChangeText={(v) => onChangeTariff('hargaPerKoli', parseFloat(v) || 0)}
          keyboardType="numeric"
          prefix="Rp"
          style={styles.half}
        />
      </View>

      <View style={styles.spacer} />

      {/* Estimasi Revenue */}
      <View style={styles.revenueBox}>
        <Text style={styles.boxTitle}>Estimasi Revenue</Text>
        <RevenueRow
          label={`Biaya Berat: ${totalCW} kg × Rp ${formatRp(tariff.hargaPerKg)}`}
          value={revenueBerat}
        />
        <RevenueRow
          label={`Biaya Koli: ${totalKoli} koli × Rp ${formatRp(tariff.hargaPerKoli)}`}
          value={revenueKoli}
        />
        <Divider my={spacing.sm} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Revenue</Text>
          <Text style={[styles.totalValue, totalRevenue > 0 && styles.totalValueGreen]}>
            Rp {formatRp(totalRevenue)}
          </Text>
        </View>
      </View>
    </Card>
  );
}

function RevenueRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={rrStyles.row}>
      <Text style={rrStyles.label}>{label}</Text>
      <Text style={rrStyles.value}>Rp {formatRp(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  half: { flex: 1 },
  gap: { width: spacing.sm },
  spacer: { height: spacing.md },
  revenueBox: {
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.success + '40',
  },
  boxTitle: {
    ...typography.smallBold,
    color: colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  totalValueGreen: {
    color: colors.success,
  },
});

const rrStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    flexWrap: 'wrap',
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
});
