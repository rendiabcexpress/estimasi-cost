import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { LegSection } from './LegSection';
import { colors, spacing } from '../ui/theme';
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
  onUpdateItem: (leg: 'firstMile' | 'middleMile' | 'lastMile', id: string, field: keyof CostItem, value: string | number) => void;
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
        legKey="firstMile"
        icon="🔵"
        label="First Mile"
        leg={legs.firstMile}
        subtotal={subtotalFirstMile}
        onVendorChange={(v) => onVendorChange('firstMile', v)}
        onAddItem={() => onAddItem('firstMile')}
        onUpdateItem={(id, f, v) => onUpdateItem('firstMile', id, f, v)}
        onRemoveItem={(id) => onRemoveItem('firstMile', id)}
      />

      <LegSection
        legKey="middleMile"
        icon="🟣"
        label="Middle Mile"
        leg={legs.middleMile}
        subtotal={subtotalMiddleMile}
        onVendorChange={(v) => onVendorChange('middleMile', v)}
        onAddItem={() => onAddItem('middleMile')}
        onUpdateItem={(id, f, v) => onUpdateItem('middleMile', id, f, v)}
        onRemoveItem={(id) => onRemoveItem('middleMile', id)}
      />

      <LegSection
        legKey="lastMile"
        icon="🟢"
        label="Last Mile"
        leg={legs.lastMile}
        subtotal={subtotalLastMile}
        onVendorChange={(v) => onVendorChange('lastMile', v)}
        onAddItem={() => onAddItem('lastMile')}
        onUpdateItem={(id, f, v) => onUpdateItem('lastMile', id, f, v)}
        onRemoveItem={(id) => onRemoveItem('lastMile', id)}
      />

      {/* Total operasional */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Biaya Operasional</Text>
        <Text style={[styles.totalValue, totalOpsCost > 0 && styles.totalValueActive]}>
          Rp {formatRp(totalOpsCost)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textMuted,
  },
  totalValueActive: {
    color: colors.primary,
  },
});
