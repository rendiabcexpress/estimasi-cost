import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { InputField } from '../ui/InputField';
import { Dropdown } from '../ui/Dropdown';
import { colors, spacing, typography } from '../ui/theme';
import { ShippingInfo } from '../../types';
import { KOTA_LIST, PRODUK_LIST } from '../../data/masterdata';

const kotaOptions = KOTA_LIST.map((k) => ({ label: k, value: k }));
const produkOptions = PRODUK_LIST.map((p) => ({
  label: `${p.nama} (${p.jenisAngkutan})`,
  value: p.id,
}));

interface Props {
  info: ShippingInfo;
  onChange: (field: Partial<ShippingInfo>) => void;
}

export function Step1ShippingInfo({ info, onChange }: Props) {
  const produk = PRODUK_LIST.find((p) => p.id === info.produkId);

  return (
    <Card>
      <SectionHeader icon="📦" title="Informasi Pengiriman" />

      <View style={styles.row}>
        <Dropdown
          label="Asal"
          options={kotaOptions}
          value={info.asal}
          onChange={(v) => onChange({ asal: String(v) })}
          placeholder="Pilih kota asal"
          style={styles.half}
        />
        <View style={styles.gap} />
        <Dropdown
          label="Tujuan"
          options={kotaOptions}
          value={info.tujuan}
          onChange={(v) => onChange({ tujuan: String(v) })}
          placeholder="Pilih kota tujuan"
          style={styles.half}
        />
      </View>

      <View style={styles.spacer} />

      <InputField
        label="Deskripsi Pengiriman"
        value={info.deskripsi}
        onChangeText={(v) => onChange({ deskripsi: v })}
        placeholder="Contoh: Elektronik 5 karton"
        multiline
      />

      <View style={styles.spacer} />

      <Dropdown
        label="Produk / Moda"
        options={produkOptions}
        value={info.produkId}
        onChange={(v) => onChange({ produkId: Number(v) })}
      />

      {produk && (
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Volume divider: {produk.volumeDivider.toLocaleString('id-ID')} cm³/kg (
            {produk.jenisAngkutan})
          </Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  half: {
    flex: 1,
  },
  gap: {
    width: spacing.sm,
  },
  spacer: {
    height: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  infoIcon: {
    fontSize: 12,
  },
  infoText: {
    ...typography.small,
    color: colors.primary,
    flex: 1,
    fontWeight: '500',
  },
});
