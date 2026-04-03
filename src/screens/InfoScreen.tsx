import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/ui/Card';
import { colors, spacing, typography, radius } from '../components/ui/theme';
import { TARGET_MARGIN } from '../data/masterdata';

export function InfoScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panduan Penggunaan</Text>
        <Text style={styles.headerSub}>Cost Estimation Calculator</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cara pakai */}
        <Card>
          <Text style={styles.sectionTitle}>📖 Cara Pakai</Text>
          {[
            ['1️⃣', 'Isi asal, tujuan, deskripsi & pilih produk (moda angkutan)'],
            ['2️⃣', 'Input dimensi barang per baris, atau langsung masukkan total berat'],
            ['3️⃣', 'Isi harga jual per kg dan per koli'],
            ['4️⃣', 'Tambah biaya operasional per leg (First Mile, Middle Mile, Last Mile)'],
            ['5️⃣', 'Tambah biaya tambahan jika ada (asuransi, packaging, dll)'],
            ['6️⃣', 'Lihat margin realtime di bar bawah — edit apapun langsung update'],
          ].map(([num, text]) => (
            <View key={num} style={styles.stepRow}>
              <Text style={styles.stepNum}>{num}</Text>
              <Text style={styles.stepText}>{text}</Text>
            </View>
          ))}
          <View style={styles.note}>
            <Text style={styles.noteText}>
              💡 Semua field bisa diedit kapan saja. Tidak ada tombol "Hitung" — semua kalkulasi
              berjalan otomatis.
            </Text>
          </View>
        </Card>

        {/* Rumus */}
        <Card>
          <Text style={styles.sectionTitle}>🔢 Rumus Perhitungan</Text>

          <FormulaBlock
            title="Volumetric Weight"
            formula="VW = P × L × T × Koli ÷ 5.000"
            note="Dimensi dalam cm, hasil dalam kg. Pembagi 5.000 standar industri logistik udara (4.000 untuk darat/laut)."
          />
          <FormulaBlock
            title="Chargeable Weight ★"
            formula="CW = ceiling( max(Actual, Volumetric) )"
            note="Ambil yang terbesar, dibulatkan ke atas. CW yang dipakai untuk menghitung revenue."
          />
          <FormulaBlock
            title="Kubikasi (CBM)"
            formula="CBM = P × L × T × Koli ÷ 1.000.000"
            note="Konversi cm³ ke m³."
          />
          <FormulaBlock
            title="Revenue"
            formula={`Revenue = (CW × Harga/kg) + (Koli × Harga/koli)`}
            note="Chargeable Weight dipakai, bukan Actual Weight."
          />
          <FormulaBlock
            title="Margin"
            formula={`Margin = Revenue − Total Cost\nMargin % = Margin ÷ Revenue × 100`}
            note={`Target minimal ${TARGET_MARGIN}% — ditampilkan hijau jika tercapai.`}
          />
        </Card>

        {/* Kode warna */}
        <Card>
          <Text style={styles.sectionTitle}>🎨 Kode Warna Margin</Text>
          <ColorRow
            color={colors.success}
            bg={colors.successLight}
            label={`Hijau — Margin ≥ ${TARGET_MARGIN}%`}
            desc="Target tercapai, harga aman untuk deal"
          />
          <ColorRow
            color={colors.warning}
            bg={colors.warningLight}
            label={`Oranye — Margin 0–${TARGET_MARGIN - 1}%`}
            desc="Belum ideal, pertimbangkan negosiasi cost atau naikkan tarif"
          />
          <ColorRow
            color={colors.danger}
            bg={colors.dangerLight}
            label="Merah — Margin Negatif (Rugi)"
            desc="Biaya melebihi revenue, jangan accept tanpa penyesuaian"
          />
        </Card>

        {/* Skenario negosiasi */}
        <Card>
          <Text style={styles.sectionTitle}>💼 Skenario Negosiasi</Text>
          <Text style={styles.scenarioText}>
            Situasi: Customer minta diskon, margin turun di bawah target.
          </Text>
          <View style={styles.scenarioSteps}>
            {[
              'Ubah "Harga per Kg" sesuai permintaan customer → margin langsung berubah',
              'Coba hapus atau kurangi item biaya yang bisa dinegosiasikan',
              'Lihat saran minimum harga/kg di sticky bar bawah',
              'Jika margin sudah hijau → deal bisa diaccept',
            ].map((s, i) => (
              <Text key={i} style={styles.scenarioItem}>
                {i + 1}. {s}
              </Text>
            ))}
          </View>
        </Card>

        {/* Master data info */}
        <Card>
          <Text style={styles.sectionTitle}>📋 Master Data</Text>
          <Text style={styles.mdText}>
            Data produk dan kota bersumber dari sistem Antero. Volume divider per produk:
          </Text>
          <View style={styles.mdTable}>
            <MdRow label="Express Cargo" value="5.000 cm³/kg (Udara)" />
            <MdRow label="Priority Cargo" value="5.000 cm³/kg (Udara)" />
            <MdRow label="Regular Cargo" value="4.000 cm³/kg (Darat/Laut)" />
            <MdRow label="Sea Cargo" value="4.000 cm³/kg (Laut)" />
            <MdRow label="Land Cargo" value="4.000 cm³/kg (Darat)" />
          </View>
        </Card>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function FormulaBlock({ title, formula, note }: { title: string; formula: string; note: string }) {
  return (
    <View style={fbStyles.block}>
      <Text style={fbStyles.title}>{title}</Text>
      <View style={fbStyles.formulaBox}>
        <Text style={fbStyles.formula}>{formula}</Text>
      </View>
      <Text style={fbStyles.note}>{note}</Text>
    </View>
  );
}

function ColorRow({
  color,
  bg,
  label,
  desc,
}: {
  color: string;
  bg: string;
  label: string;
  desc: string;
}) {
  return (
    <View style={[crStyles.row, { backgroundColor: bg, borderColor: color + '40' }]}>
      <View style={[crStyles.dot, { backgroundColor: color }]} />
      <View style={crStyles.text}>
        <Text style={[crStyles.label, { color }]}>{label}</Text>
        <Text style={crStyles.desc}>{desc}</Text>
      </View>
    </View>
  );
}

function MdRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={mdStyles.row}>
      <Text style={mdStyles.label}>{label}</Text>
      <Text style={mdStyles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    shadowColor: '#1A1D3A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  headerSub: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  scroll: { flex: 1 },
  content: { padding: spacing.md },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  stepNum: { fontSize: 18 },
  stepText: { flex: 1, fontSize: 13, color: colors.textPrimary, lineHeight: 20, paddingTop: 2 },
  note: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  noteText: { fontSize: 12, color: colors.primary, fontWeight: '500', lineHeight: 18 },
  scenarioText: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm },
  scenarioSteps: { gap: spacing.xs },
  scenarioItem: { fontSize: 13, color: colors.textPrimary, lineHeight: 20 },
  mdText: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm },
  mdTable: { gap: 0 },
});

const fbStyles = StyleSheet.create({
  block: { marginBottom: spacing.md },
  title: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  formulaBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: 4,
  },
  formula: { fontSize: 13, fontWeight: '600', color: colors.primary, fontFamily: 'monospace' },
  note: { fontSize: 11, color: colors.textSecondary, lineHeight: 16 },
});

const crStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radius.sm,
    borderWidth: 1,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 3 },
  text: { flex: 1 },
  label: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  desc: { fontSize: 12, color: colors.textSecondary },
});

const mdStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  label: { fontSize: 13, color: colors.textPrimary, fontWeight: '500' },
  value: { fontSize: 13, color: colors.primary, fontWeight: '600' },
});
