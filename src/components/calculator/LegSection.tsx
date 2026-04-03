import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { InputField } from '../ui/InputField';
import { AddButton } from '../ui/AddButton';
import { colors, spacing, typography, radius } from '../ui/theme';
import { CostItem, Leg } from '../../types';
import { formatRp } from '../../utils/calculations';

interface Props {
  legKey: 'firstMile' | 'middleMile' | 'lastMile';
  icon: string;
  label: string;
  leg: Leg;
  subtotal: number;
  onVendorChange: (v: string) => void;
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof CostItem, value: string | number) => void;
  onRemoveItem: (id: string) => void;
}

export function LegSection({
  icon,
  label,
  leg,
  subtotal,
  onVendorChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header accordion */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setCollapsed((c) => !c)}
        activeOpacity={0.8}
      >
        <Text style={styles.headerIcon}>{icon}</Text>
        <Text style={styles.headerLabel}>{label}</Text>
        <Text style={[styles.headerAmount, subtotal > 0 && styles.headerAmountActive]}>
          Rp {formatRp(subtotal)}
        </Text>
        <Text style={styles.chevron}>{collapsed ? '▶' : '▼'}</Text>
      </TouchableOpacity>

      {!collapsed && (
        <View style={styles.body}>
          {/* Vendor */}
          <InputField
            label="Vendor / Pihak"
            value={leg.vendor}
            onChangeText={onVendorChange}
            placeholder="Nama vendor atau internal"
          />

          <View style={styles.spacer} />

          {/* Cost Items */}
          {leg.items.length > 0 && (
            <View style={styles.itemsHeader}>
              <Text style={[styles.colHeader, styles.colDesc]}>Deskripsi</Text>
              <Text style={[styles.colHeader, styles.colBiaya]}>Biaya (Rp)</Text>
              <View style={styles.colDel} />
            </View>
          )}

          {leg.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.colDesc}>
                <InputField
                  value={item.deskripsi}
                  onChangeText={(v) => onUpdateItem(item.id, 'deskripsi', v)}
                  placeholder="Nama biaya"
                />
              </View>
              <View style={styles.colBiayaInput}>
                <InputField
                  value={item.biaya > 0 ? String(item.biaya) : ''}
                  onChangeText={(v) => onUpdateItem(item.id, 'biaya', parseFloat(v) || 0)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => onRemoveItem(item.id)}
              >
                <Text style={styles.deleteIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}

          <AddButton label="Tambah Biaya" onPress={onAddItem} />

          {/* Subtotal */}
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Subtotal {label}</Text>
            <Text style={[styles.subtotalValue, subtotal > 0 && styles.subtotalValueActive]}>
              Rp {formatRp(subtotal)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardInner,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    gap: spacing.sm,
  },
  headerIcon: {
    fontSize: 16,
  },
  headerLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  headerAmountActive: {
    color: colors.primary,
  },
  chevron: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  body: {
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  spacer: {
    height: spacing.sm,
  },
  itemsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  colHeader: {
    ...typography.label,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  colDesc: {
    flex: 1,
    marginRight: spacing.xs,
  },
  colBiaya: {
    width: 110,
    textAlign: 'right',
    marginRight: spacing.xs,
  },
  colDel: {
    width: 32,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  colBiayaInput: {
    width: 110,
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
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
  },
  subtotalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  subtotalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
  },
  subtotalValueActive: {
    color: colors.primary,
  },
});
