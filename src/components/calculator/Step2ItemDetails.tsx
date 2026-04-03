import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { SegmentedControl } from '../ui/SegmentedControl';
import { InputField } from '../ui/InputField';
import { AddButton } from '../ui/AddButton';
import { Divider } from '../ui/Divider';
import { colors, spacing, typography, radius } from '../ui/theme';
import { DimensionItem, DirectInput, InputMode, DimensionItemCalculated, WeightSummary } from '../../types';
import { formatWeight, formatCbm } from '../../utils/calculations';

const MODE_OPTIONS = [
  { value: 'dimensi' as InputMode, label: 'Dari Dimensi' },
  { value: 'langsung' as InputMode, label: 'Input Langsung' },
];

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
          {/* Tabel scroll horizontal */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Header tabel */}
              <View style={styles.tableHeader}>
                {['Koli', 'P(cm)', 'L(cm)', 'T(cm)', 'Brt(kg)', 'Act.W', 'Vol.W', 'CW', 'CBM', ''].map(
                  (h) => (
                    <Text key={h} style={[styles.th, h === '' && styles.thAction]}>
                      {h}
                    </Text>
                  )
                )}
              </View>
              {/* Baris dimensi */}
              {itemsCalculated.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  {/* Input fields */}
                  {(['koli', 'panjang', 'lebar', 'tinggi', 'berat'] as const).map((f) => (
                    <View key={f} style={styles.cellInput}>
                      <TextInput
                        style={tcStyles.textInput}
                        value={item[f] > 0 ? String(item[f]) : ''}
                        onChangeText={(t) => onUpdateItem(item.id, f, parseFloat(t) || 0)}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor={colors.textMuted}
                      />
                    </View>
                  ))}
                  {/* Auto calculated */}
                  <View style={styles.cellAuto}>
                    <Text style={styles.autoVal}>{item.actualWeight}</Text>
                  </View>
                  <View style={styles.cellAuto}>
                    <Text style={styles.autoVal}>{item.volumetricWeight.toFixed(1)}</Text>
                  </View>
                  <View style={[styles.cellAuto, styles.cwCell]}>
                    <Text style={[styles.autoVal, styles.cwVal]}>{item.chargeableWeight}</Text>
                  </View>
                  <View style={styles.cellAuto}>
                    <Text style={styles.autoVal}>{item.cbm.toFixed(3)}</Text>
                  </View>
                  {/* Hapus */}
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => onRemoveItem(item.id)}
                  >
                    <Text style={styles.deleteIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>

          <AddButton label="Tambah Baris" onPress={onAddItem} />
        </>
      ) : (
        /* Mode input langsung */
        <View>
          <View style={styles.directRow}>
            <InputField
              label="Total Koli"
              value={directInput.koli > 0 ? String(directInput.koli) : ''}
              onChangeText={(v) => onUpdateDirect('koli', parseFloat(v) || 0)}
              keyboardType="numeric"
              style={styles.directField}
            />
            <View style={styles.gap} />
            <InputField
              label="Actual Weight (kg)"
              value={directInput.actualWeight > 0 ? String(directInput.actualWeight) : ''}
              onChangeText={(v) => onUpdateDirect('actualWeight', parseFloat(v) || 0)}
              keyboardType="numeric"
              style={styles.directField}
            />
          </View>
          <View style={[styles.directRow, styles.mt]}>
            <InputField
              label="Volumetric (kg)"
              value={directInput.volumetricWeight > 0 ? String(directInput.volumetricWeight) : ''}
              onChangeText={(v) => onUpdateDirect('volumetricWeight', parseFloat(v) || 0)}
              keyboardType="numeric"
              style={styles.directField}
            />
            <View style={styles.gap} />
            <InputField
              label="Chargeable (kg) ★"
              value={directInput.chargeableWeight > 0 ? String(directInput.chargeableWeight) : ''}
              onChangeText={(v) => onUpdateDirect('chargeableWeight', parseFloat(v) || 0)}
              keyboardType="numeric"
              style={styles.directField}
            />
          </View>
          <View style={[styles.directRow, styles.mt]}>
            <InputField
              label="CBM (m³)"
              value={directInput.cbm > 0 ? String(directInput.cbm) : ''}
              onChangeText={(v) => onUpdateDirect('cbm', parseFloat(v) || 0)}
              keyboardType="numeric"
              style={{ flex: 0.5 }}
            />
          </View>
          <View style={styles.infoNote}>
            <Text style={styles.noteText}>
              ★ Chargeable Weight digunakan untuk perhitungan revenue
            </Text>
          </View>
        </View>
      )}

      {/* Ringkasan Berat */}
      <Divider my={spacing.md} />
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Ringkasan Berat</Text>
        <SummaryRow label="Total Koli" value={`${weightSummary.totalKoli} koli`} />
        <SummaryRow label="Actual Weight" value={formatWeight(weightSummary.totalActualWeight)} />
        <SummaryRow label="Volumetric Weight" value={formatWeight(weightSummary.totalVolumetricWeight, 1)} />
        <SummaryRow
          label="Chargeable Weight ★"
          value={formatWeight(weightSummary.totalChargeableWeight, 0)}
          highlight
        />
        <SummaryRow label="Kubikasi (CBM)" value={formatCbm(weightSummary.totalCbm)} />
      </View>
    </Card>
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
    <View style={srStyles.row}>
      <Text style={[srStyles.label, highlight && srStyles.hlLabel]}>{label}</Text>
      <Text style={[srStyles.value, highlight && srStyles.hlValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderColor: colors.border,
    paddingBottom: spacing.xs,
    marginBottom: spacing.xs,
  },
  th: {
    width: 64,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  thAction: {
    width: 32,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  cellInput: {
    width: 64,
    paddingHorizontal: 2,
  },
  cellAuto: {
    width: 64,
    alignItems: 'center',
    backgroundColor: colors.inputBgAuto,
    marginHorizontal: 1,
    borderRadius: 4,
    paddingVertical: 6,
  },
  cwCell: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  autoVal: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  cwVal: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  deleteBtn: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  deleteIcon: {
    fontSize: 13,
    color: colors.danger,
  },
  directRow: {
    flexDirection: 'row',
  },
  directField: {
    flex: 1,
  },
  gap: {
    width: spacing.sm,
  },
  mt: {
    marginTop: spacing.sm,
  },
  infoNote: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  noteText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  summary: {
    backgroundColor: colors.cardInner,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    ...typography.smallBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    color: colors.textSecondary,
  },
});

const tcStyles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    height: 32,
    fontSize: 12,
    color: colors.textPrimary,
    textAlign: 'center',
    backgroundColor: colors.inputBg,
    paddingHorizontal: 2,
  },
});

const srStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  hlLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  hlValue: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
});
