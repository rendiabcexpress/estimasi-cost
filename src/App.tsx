import React, { useState } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { useIsMobile } from './hooks/useMediaQuery';
import { Step1ShippingInfo } from './components/calculator/Step1ShippingInfo';
import { Step2ItemDetails } from './components/calculator/Step2ItemDetails';
import { Step3SalesTariff } from './components/calculator/Step3SalesTariff';
import { Step4OpsCosts } from './components/calculator/Step4OpsCosts';
import { Step5ExtraCosts } from './components/calculator/Step5ExtraCosts';
import { Step6Breakdown } from './components/calculator/Step6Breakdown';
import { SummaryPanel } from './components/SummaryPanel';
import { MobileStickyBar } from './components/MobileStickyBar';
import { PrintView } from './components/PrintView';
import {
  IconCalculator, IconInfoCircle, IconRefresh, IconPrinter,
  IconBook, IconMath, IconPalette, IconClipboardList, IconBulb,
  IconCircle1, IconCircle2, IconCircle3, IconCircle4, IconCircle5, IconCircle6,
} from '@tabler/icons-react';

type Tab = 'kalkulator' | 'info';

export default function App() {
  const calc = useCalculator();
  const [tab, setTab] = useState<Tab>('kalkulator');
  const isMobile = useIsMobile();

  const handleReset = () => {
    if (window.confirm('Hapus semua data dan mulai dari awal?')) {
      calc.reset();
    }
  };

  return (
    <>
    {/* Print-only view */}
    <PrintView state={calc.state} computed={calc.computed} />

    {/* Normal app UI — hidden during print */}
    <div className="screen-only" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
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
            padding: isMobile ? '0 12px' : '0 24px',
            height: 56,
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 8 : 24,
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <IconCalculator size={18} stroke={2} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', lineHeight: 1 }}>
              EstCost
            </div>
          </div>

          {/* Tabs */}
          <nav style={{ display: 'flex', gap: 2 }}>
            {(['kalkulator', 'info'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: isMobile ? '6px 10px' : '6px 16px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: tab === t ? 'var(--primary-light)' : 'transparent',
                  color: tab === t ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: tab === t ? 700 : 500,
                  fontSize: isMobile ? 12 : 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {t === 'kalkulator'
                  ? (<><IconCalculator size={16} stroke={2} style={{ verticalAlign: 'middle' }} />{!isMobile && ' Kalkulator'}</>)
                  : (<><IconInfoCircle size={16} stroke={2} style={{ verticalAlign: 'middle' }} />{!isMobile && ' Panduan'}</>)}
              </button>
            ))}
          </nav>

          <div style={{ flex: 1 }} />

          {/* Route badge — desktop only */}
          {!isMobile && calc.state.shippingInfo.asalKotaName && calc.state.shippingInfo.tujuanKotaName && (
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
              {calc.state.shippingInfo.asalKotaName} → {calc.state.shippingInfo.tujuanKotaName}
            </div>
          )}

          {/* Print & Reset buttons */}
          {tab === 'kalkulator' && (
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => window.print()}
                className="no-print"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: isMobile ? '6px 10px' : '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(37,99,235,0.3)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  fontSize: isMobile ? 12 : 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <IconPrinter size={14} stroke={2.5} />{!isMobile && ' Print'}
              </button>
              <button
                onClick={handleReset}
                className="no-print"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: isMobile ? '6px 10px' : '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(231,76,60,0.3)',
                  background: 'var(--danger-light)',
                  color: 'var(--danger)',
                  fontWeight: 600,
                  fontSize: isMobile ? 12 : 13,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <IconRefresh size={14} stroke={2.5} />{!isMobile && ' Reset'}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      {tab === 'kalkulator' ? (
        <main
          style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '8px' : '16px 24px' }}
          className="layout-grid"
        >
          {/* Left column — all steps */}
          <div className={isMobile ? 'mobile-scroll-pad' : undefined}>
            <Step1ShippingInfo
              info={calc.state.shippingInfo}
              onChange={calc.setShippingInfo}
              autoFillStatus={calc.autoFillStatus}
              onDismissAutoFill={calc.dismissAutoFill}
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
              revenueBerat={calc.computed.revenueBerat}
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
              discountCostPct={calc.state.discountCostPct}
              discountCostNominal={calc.computed.discountCostNominal}
              totalCostBeforeDiscount={calc.computed.totalRevenue + calc.computed.discountCostNominal}
              totalCost={calc.computed.totalRevenue}
              targetDiscountFor40={calc.computed.targetDiscountFor40}
              targetDiscountPctFor40={calc.computed.targetDiscountPctFor40}
              discountGapFor40={calc.computed.discountGapFor40}
              onAdd={calc.addExtraCost}
              onUpdate={calc.updateExtraCost}
              onRemove={calc.removeExtraCost}
              onChangeDiscountPct={calc.setDiscountCostPct}
            />
            <Step6Breakdown computed={calc.computed} state={calc.state} />
          </div>

          {/* Right column — sticky summary (desktop only) */}
          <aside className="desktop-only" style={{ alignSelf: 'stretch' }}>
            <SummaryPanel computed={calc.computed} shippingInfo={calc.state.shippingInfo} />
          </aside>

          {/* Mobile sticky bar */}
          <MobileStickyBar
            computed={calc.computed}
            shippingInfo={calc.state.shippingInfo}
            className="mobile-only"
          />
        </main>
      ) : (
        <InfoPage />
      )}
    </div>
    </>
  );
}

// ─── Info Page ────────────────────────────────────────────────────────────────
import { TARGET_MARGIN, VOLUME_TYPE_LABEL } from './data/masterdata';
import { Produk } from './types';

function InfoPage() {
  const [produkList, setProdukList] = React.useState<Produk[]>([]);
  React.useEffect(() => {
    import('./services/api').then(({ fetchProduk }) => fetchProduk().then(setProdukList));
  }, []);
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <InfoCard title={<><IconBook size={18} stroke={2} style={{ verticalAlign: 'middle', marginRight: 6 }} />Cara Pakai</>}>
        {([
          [<IconCircle1 size={20} stroke={1.5} color="var(--primary)" />, 'Isi asal, tujuan, deskripsi & pilih produk (moda angkutan)'],
          [<IconCircle2 size={20} stroke={1.5} color="var(--primary)" />, 'Input dimensi barang per baris atau langsung masukkan total berat'],
          [<IconCircle3 size={20} stroke={1.5} color="var(--primary)" />, 'Isi harga jual per kg dan per koli'],
          [<IconCircle4 size={20} stroke={1.5} color="var(--primary)" />, 'Tambah biaya operasional per leg (First Mile, Middle Mile, Last Mile)'],
          [<IconCircle5 size={20} stroke={1.5} color="var(--primary)" />, 'Tambah biaya tambahan jika ada (asuransi, packaging, dll)'],
          [<IconCircle6 size={20} stroke={1.5} color="var(--primary)" />, 'Margin update otomatis di panel kanan — edit apapun langsung berubah'],
        ] as [React.ReactNode, string][]).map(([icon, text], i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
            <span style={{ flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: 14, color: 'var(--text)' }}>{text}</span>
          </div>
        ))}
        <div style={{ background: 'var(--primary-light)', borderRadius: 8, padding: 12, marginTop: 12, fontSize: 13, color: 'var(--primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconBulb size={16} stroke={2} /> Tidak ada tombol "Hitung" — semua kalkulasi berjalan otomatis saat field diubah.
        </div>
      </InfoCard>

      <InfoCard title={<><IconMath size={18} stroke={2} style={{ verticalAlign: 'middle', marginRight: 6 }} />Rumus Perhitungan</>}>
        {[
          ['Volumetric Weight', 'VW = Panjang × Lebar × Tinggi × Koli ÷ volume_divider', 'Dimensi dalam cm, hasil dalam kg. Pembagi 5.000 untuk udara, 4.000 untuk darat/laut.'],
          ['Chargeable Weight ★', 'CW = ⌈ max(Actual Weight, Volumetric Weight) ⌉', 'Ambil terbesar, dibulatkan ke atas. CW dipakai untuk menghitung revenue.'],
          ['Kubikasi (CBM)', 'CBM = Panjang × Lebar × Tinggi × Koli ÷ 1.000.000', 'Konversi cm³ ke m³.'],
          ['Revenue', 'Revenue = CW × Harga/kg', 'Menggunakan Chargeable Weight, bukan Actual Weight.'],
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

      <InfoCard title={<><IconPalette size={18} stroke={2} style={{ verticalAlign: 'middle', marginRight: 6 }} />Kode Warna</>}>
        {[
          { color: '#16A34A', bg: '#DCFCE7', label: `Hijau — Margin ≥ ${TARGET_MARGIN}%`, desc: 'Target tercapai, harga aman untuk deal' },
          { color: '#D97706', bg: '#FEF3C7', label: `Kuning — Margin 0–${TARGET_MARGIN - 1}%`, desc: 'Belum ideal, pertimbangkan negosiasi cost atau naikkan tarif' },
          { color: '#DC2626', bg: '#FEE2E2', label: 'Merah — Margin Negatif (Rugi)', desc: 'Biaya melebihi revenue, jangan accept tanpa penyesuaian' },
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

      <InfoCard title={<><IconClipboardList size={18} stroke={2} style={{ verticalAlign: 'middle', marginRight: 6 }} />Master Data Produk</>}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              {['Produk', 'Moda', 'Volume Divider'].map(h => (
                <th key={h} style={{ padding: '6px 12px', textAlign: 'left', fontWeight: 700, fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {produkList.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>{p.produk}</td>
                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{VOLUME_TYPE_LABEL[p.volume_type] ?? p.volume_type}</td>
                <td style={{ padding: '8px 12px', color: 'var(--primary)', fontWeight: 700, fontFamily: 'monospace' }}>
                  {p.volume_divider.toLocaleString('id-ID')} cm³/kg
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoCard>
    </div>
  );
}

function InfoCard({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
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
