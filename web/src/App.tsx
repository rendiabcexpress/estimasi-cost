import React, { useState } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { Step1ShippingInfo } from './components/calculator/Step1ShippingInfo';
import { Step2ItemDetails } from './components/calculator/Step2ItemDetails';
import { Step3SalesTariff } from './components/calculator/Step3SalesTariff';
import { Step4OpsCosts } from './components/calculator/Step4OpsCosts';
import { Step5ExtraCosts } from './components/calculator/Step5ExtraCosts';
import { Step6Breakdown } from './components/calculator/Step6Breakdown';
import { SummaryPanel } from './components/SummaryPanel';

type Tab = 'kalkulator' | 'info';

export default function App() {
  const calc = useCalculator();
  const [tab, setTab] = useState<Tab>('kalkulator');

  const handleReset = () => {
    if (window.confirm('Hapus semua data dan mulai dari awal?')) {
      calc.reset();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top Navigation */}
      <header
        style={{
          background: 'white',
          boxShadow: 'var(--shadow-card)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 24px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
              }}
            >
              📊
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', lineHeight: 1.2 }}>
                EstCost
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                Kalkulator Estimasi Margin
              </div>
            </div>
          </div>

          {/* Tabs */}
          <nav style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
            {(['kalkulator', 'info'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '6px 18px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: tab === t ? 'var(--primary-light)' : 'transparent',
                  color: tab === t ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: tab === t ? 700 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {t === 'kalkulator' ? '📊 Kalkulator' : 'ℹ️ Panduan'}
              </button>
            ))}
          </nav>

          <div style={{ flex: 1 }} />

          {/* Route badge */}
          {calc.state.shippingInfo.asal && calc.state.shippingInfo.tujuan && (
            <div
              style={{
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {calc.state.shippingInfo.asal} → {calc.state.shippingInfo.tujuan}
            </div>
          )}

          {/* Reset button */}
          {tab === 'kalkulator' && (
            <button
              onClick={handleReset}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(231,76,60,0.3)',
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              ↺ Reset
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      {tab === 'kalkulator' ? (
        <main
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {/* Left column — all steps */}
          <div>
            <Step1ShippingInfo
              info={calc.state.shippingInfo}
              onChange={calc.setShippingInfo}
            />
            <Step2ItemDetails
              inputMode={calc.state.inputMode}
              onModeChange={calc.setInputMode}
              items={calc.state.items}
              itemsCalculated={calc.computed.itemsCalculated}
              directInput={calc.state.directInput}
              weightSummary={calc.computed.weightSummary}
              onAddItem={calc.addItem}
              onUpdateItem={calc.updateItem}
              onRemoveItem={calc.removeItem}
              onUpdateDirect={calc.setDirectInput}
            />
            <Step3SalesTariff
              tariff={calc.state.tariff}
              onChangeTariff={calc.setTariff}
              totalCW={calc.computed.weightSummary.totalChargeableWeight}
              totalKoli={calc.computed.weightSummary.totalKoli}
              revenueBerat={calc.computed.revenueBerat}
              revenueKoli={calc.computed.revenueKoli}
              totalRevenue={calc.computed.totalRevenue}
            />
            <Step4OpsCosts
              legs={calc.state.legs}
              subtotalFirstMile={calc.computed.subtotalFirstMile}
              subtotalMiddleMile={calc.computed.subtotalMiddleMile}
              subtotalLastMile={calc.computed.subtotalLastMile}
              totalOpsCost={calc.computed.totalOpsCost}
              onVendorChange={calc.setLegVendor}
              onAddItem={calc.addLegItem}
              onUpdateItem={calc.updateLegItem}
              onRemoveItem={calc.removeLegItem}
            />
            <Step5ExtraCosts
              extraCosts={calc.state.extraCosts}
              totalExtraCost={calc.computed.totalExtraCost}
              onAdd={calc.addExtraCost}
              onUpdate={calc.updateExtraCost}
              onRemove={calc.removeExtraCost}
            />
            <Step6Breakdown computed={calc.computed} state={calc.state} />
          </div>

          {/* Right column — sticky summary */}
          <aside>
            <SummaryPanel computed={calc.computed} shippingInfo={calc.state.shippingInfo} />
          </aside>
        </main>
      ) : (
        <InfoPage />
      )}
    </div>
  );
}

// ─── Info Page ────────────────────────────────────────────────────────────────
import { PRODUK_LIST, TARGET_MARGIN } from './data/masterdata';

function InfoPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <InfoCard title="📖 Cara Pakai">
        {[
          ['1️⃣', 'Isi asal, tujuan, deskripsi & pilih produk (moda angkutan)'],
          ['2️⃣', 'Input dimensi barang per baris atau langsung masukkan total berat'],
          ['3️⃣', 'Isi harga jual per kg dan per koli'],
          ['4️⃣', 'Tambah biaya operasional per leg (First Mile, Middle Mile, Last Mile)'],
          ['5️⃣', 'Tambah biaya tambahan jika ada (asuransi, packaging, dll)'],
          ['6️⃣', 'Margin update otomatis di panel kanan — edit apapun langsung berubah'],
        ].map(([num, text]) => (
          <div key={num as string} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 20 }}>{num}</span>
            <span style={{ fontSize: 14, color: 'var(--text)', paddingTop: 2 }}>{text}</span>
          </div>
        ))}
        <div style={{ background: 'var(--primary-light)', borderRadius: 8, padding: 12, marginTop: 12, fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>
          💡 Tidak ada tombol "Hitung" — semua kalkulasi berjalan otomatis saat field diubah.
        </div>
      </InfoCard>

      <InfoCard title="🔢 Rumus Perhitungan">
        {[
          ['Volumetric Weight', 'VW = Panjang × Lebar × Tinggi × Koli ÷ volume_divider', 'Dimensi dalam cm, hasil dalam kg. Pembagi 5.000 untuk udara, 4.000 untuk darat/laut.'],
          ['Chargeable Weight ★', 'CW = ⌈ max(Actual Weight, Volumetric Weight) ⌉', 'Ambil terbesar, dibulatkan ke atas. CW dipakai untuk menghitung revenue.'],
          ['Kubikasi (CBM)', 'CBM = Panjang × Lebar × Tinggi × Koli ÷ 1.000.000', 'Konversi cm³ ke m³.'],
          ['Revenue', 'Revenue = (CW × Harga/kg) + (Koli × Harga/koli)', 'Menggunakan Chargeable Weight, bukan Actual Weight.'],
          ['Margin', `Margin = Revenue − Total Cost\nMargin % = Margin ÷ Revenue × 100`, `Target minimal ${TARGET_MARGIN}% — tampil hijau jika tercapai.`],
        ].map(([title, formula, note]) => (
          <div key={title as string} style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
            <div style={{ background: 'var(--primary-light)', padding: '8px 12px', borderRadius: 6, fontFamily: 'monospace', fontSize: 13, color: 'var(--primary)', whiteSpace: 'pre-wrap', marginBottom: 4 }}>
              {formula}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{note}</div>
          </div>
        ))}
      </InfoCard>

      <InfoCard title="🎨 Kode Warna">
        {[
          { color: '#27AE60', bg: '#E8F8EF', label: `Hijau — Margin ≥ ${TARGET_MARGIN}%`, desc: 'Target tercapai, harga aman untuk deal' },
          { color: '#F39C12', bg: '#FEF6E7', label: `Oranye — Margin 0–${TARGET_MARGIN - 1}%`, desc: 'Belum ideal, pertimbangkan negosiasi cost atau naikkan tarif' },
          { color: '#E74C3C', bg: '#FDECEA', label: 'Merah — Margin Negatif (Rugi)', desc: 'Biaya melebihi revenue, jangan accept tanpa penyesuaian' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', gap: 12, padding: '10px 14px', borderRadius: 8, background: item.bg, border: `1px solid ${item.color}40`, marginBottom: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: item.color, marginTop: 3, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, color: item.color, fontSize: 13 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </InfoCard>

      <InfoCard title="📋 Master Data Produk">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              {['Produk', 'Moda', 'Volume Divider'].map(h => (
                <th key={h} style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 700, fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRODUK_LIST.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>{p.nama}</td>
                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{p.jenisAngkutan}</td>
                <td style={{ padding: '8px 12px', color: 'var(--primary)', fontWeight: 700, fontFamily: 'monospace' }}>
                  {p.volumeDivider.toLocaleString('id-ID')} cm³/kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoCard>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: 24,
        boxShadow: 'var(--shadow-card)',
        marginBottom: 16,
      }}
    >
      <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>{title}</h2>
      {children}
    </div>
  );
}
