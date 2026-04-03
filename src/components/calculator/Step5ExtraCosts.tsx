import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { InputField } from '../ui/InputField';
import { AddButton } from '../ui/AddButton';
import { colors, spacing, typography } from '../ui/theme';
import { CostItem } from '../../types';
import { formatRp } from '../../utils/calculations';

interface Props {
  extraCosts: CostItem[];
  totalExtraCost: number;
  onAdd: () => void;
  onUpdate: (id: string, field: keyof CostItem, value: string | number) => void;
  onRemove: (id: string) => void;
}

export function Step5ExtraCosts({ extraCosts, totalExtraCost, onAdd, onUpdate, onRemove }: Props) {
  return (
    <Card>
      <SectionHeader icon="➕" title="Biaya Tambahan" subtitle="Opsional — asuransi, packaging, dll" />

      {extraCosts.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <View style={styles.colDesc}>
            <InputField
              value={item.deskripsi}
              onChangeText={(v) => onUpdate(item.id, 'deskripsi', v)}
              placeholder="Nama biaya"
            />
          </View>
          <View style={styles.colBiaya}>
            <InputField
              value={item.biaya > 0 ? String(item.biaya) : ''}
              onChangeText={(v) => onUpdate(item.id, 'biaya', parseFloat(v) || 0)}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => onRemove(item.id)}>
            <Text style={styles.deleteIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      <AddButton label="Tambah Biaya" onPress={onAdd} />

      {totalExtraCost > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Biaya Tambahan</Text>
          <Text style={styles.totalValue}>Rp {formatRp(totalExtraCost)}</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  colDesc: {
    flex: 1,
  },
  colBiaya: {
    width: 120,
  },
  deleteBtn: {
    width: 32,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 14,
    color: colors.danger,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
