import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Card } from '../ui/Card';
import { SectionHeader } from '../ui/SectionHeader';
import { InputField } from '../ui/InputField';
import { colors, spacing, typography, radius, shadow } from '../ui/theme';
import { ShippingInfo, City, Produk } from '../../types';
import { fetchCities, fetchProduk } from '../../services/api';
import { VOLUME_TYPE_LABEL } from '../../data/masterdata';

// ─── City Picker Modal ────────────────────────────────────────────────────────

function CityPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: { id: number | null; name: string };
  onChange: (city: City) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async (search: string) => {
    setLoading(true);
    try {
      const data = await fetchCities(search);
      setCities(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => load(query), 300);
    return () => clearTimeout(timer);
  }, [query, open]);

  const handleOpen = () => {
    setQuery('');
    setOpen(true);
    load('');
  };

  return (
    <View style={styles.half}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity style={styles.trigger} onPress={handleOpen} activeOpacity={0.8}>
        <Text style={[styles.triggerText, !value.name && styles.placeholder]} numberOfLines={1}>
          {value.name || 'Pilih kota...'}
        </Text>
        <Text style={styles.arrow}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Pilih {label}</Text>

            {/* Search */}
            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder="Cari kota..."
                placeholderTextColor={colors.textMuted}
                autoFocus
              />
            </View>

            {loading ? (
              <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
            ) : (
              <FlatList
                data={cities}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.cityItem, item.id === value.id && styles.cityItemActive]}
                    onPress={() => { onChange(item); setOpen(false); }}
                  >
                    <Text style={[styles.cityName, item.id === value.id && styles.cityNameActive]}>
                      {item.name}
                    </Text>
                    {item.province_name && (
                      <Text style={styles.provinceName}>{item.province_name}</Text>
                    )}
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>Kota tidak ditemukan</Text>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

interface Props {
  info: ShippingInfo;
  onChange: (f: Partial<ShippingInfo>) => void;
}

export function Step1ShippingInfo({ info, onChange }: Props) {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [loadingProduk, setLoadingProduk] = useState(true);
  const [showProdukPicker, setShowProdukPicker] = useState(false);

  useEffect(() => {
    fetchProduk()
      .then(setProdukList)
      .finally(() => setLoadingProduk(false));
  }, []);

  const selectedProduk = produkList.find((p) => p.id === info.produkId);

  return (
    <Card>
      <SectionHeader icon="📦" title="Informasi Pengiriman" />

      {/* Asal & Tujuan */}
      <View style={styles.row}>
        <CityPicker
          label="Asal"
          value={{ id: info.asalKotaId, name: info.asalKotaName }}
          onChange={(city) => onChange({ asalKotaId: city.id, asalKotaName: city.name })}
        />
        <View style={styles.gap} />
        <CityPicker
          label="Tujuan"
          value={{ id: info.tujuanKotaId, name: info.tujuanKotaName }}
          onChange={(city) => onChange({ tujuanKotaId: city.id, tujuanKotaName: city.name })}
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

      {/* Produk picker */}
      <Text style={styles.fieldLabel}>Produk / Moda Angkutan</Text>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setShowProdukPicker(true)}
        activeOpacity={0.8}
        disabled={loadingProduk}
      >
        <Text style={[styles.triggerText, !info.produkId && styles.placeholder]}>
          {loadingProduk
            ? 'Memuat...'
            : selectedProduk
            ? `${selectedProduk.produk} (÷${selectedProduk.volume_divider.toLocaleString('id-ID')})`
            : 'Pilih produk...'}
        </Text>
        <Text style={styles.arrow}>▾</Text>
      </TouchableOpacity>

      {selectedProduk && (
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            ℹ️ Volume divider: {selectedProduk.volume_divider.toLocaleString('id-ID')} cm³/kg
            — {VOLUME_TYPE_LABEL[selectedProduk.volume_type] ?? selectedProduk.volume_type}
          </Text>
        </View>
      )}

      {/* Produk Modal */}
      <Modal visible={showProdukPicker} transparent animationType="slide" onRequestClose={() => setShowProdukPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Pilih Produk</Text>
            <FlatList
              data={produkList}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.cityItem, item.id === info.produkId && styles.cityItemActive]}
                  onPress={() => {
                    onChange({ produkId: item.id, produkName: item.produk, volumeDivider: item.volume_divider });
                    setShowProdukPicker(false);
                  }}
                >
                  <Text style={[styles.cityName, item.id === info.produkId && styles.cityNameActive]}>
                    {item.produk}
                  </Text>
                  <Text style={styles.provinceName}>
                    {VOLUME_TYPE_LABEL[item.volume_type] ?? item.volume_type} · Volume divider: {item.volume_divider.toLocaleString('id-ID')}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  half: { flex: 1 },
  gap: { width: spacing.sm },
  spacer: { height: spacing.md },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 42,
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  placeholder: { color: colors.textMuted, fontWeight: '400' },
  arrow: { fontSize: 14, color: colors.textSecondary },
  infoRow: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  infoText: { ...typography.small, color: colors.primary, fontWeight: '500' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(26,29,58,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: 32,
    maxHeight: '75%',
    ...shadow.sticky,
  },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  searchRow: {
    backgroundColor: colors.cardInner,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    height: 40,
    fontSize: 14,
    color: colors.textPrimary,
  },
  cityItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cityItemActive: { backgroundColor: colors.primaryLight, marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg },
  cityName: { fontSize: 14, color: colors.textPrimary },
  cityNameActive: { color: colors.primary, fontWeight: '700' },
  provinceName: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  emptyText: { textAlign: 'center', color: colors.textSecondary, marginTop: spacing.lg, fontSize: 13 },
});
