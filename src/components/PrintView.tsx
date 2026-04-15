import { CalculatorState, ComputedValues } from '../types';
import { formatRp, formatWeight, formatCbm } from '../utils/calculations';
import { TARGET_MARGIN } from '../data/masterdata';

export function PrintView({
  state,
  computed,
}: {
  state: CalculatorState;
  computed: ComputedValues;
}) {
  const { shippingInfo, tariff, legs, extraCosts } = state;
  const {
    weightSummary, totalRevenue, subtotalFirstMile, subtotalMiddleMile,
    subtotalLastMile, totalExtraCost, discountCostNominal,
    targetDiscountFor40, discountGapFor40, totalCost, margin,
    marginPct, marginStatus,
  } = computed;

  const route =
    shippingInfo.asalKotaName && shippingInfo.tujuanKotaName
      ? `${shippingInfo.asalKotaName} \u2192 ${shippingInfo.tujuanKotaName}`
      : '-';

  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const refNo = `ABC-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;

  const allLegItems = [
    ...legs.firstMile.items.map((i) => ({ ...i, leg: 'First Mile', vendor: legs.firstMile.vendor })),
    ...legs.middleMile.items.map((i) => ({ ...i, leg: 'Middle Mile', vendor: legs.middleMile.vendor })),
    ...legs.lastMile.items.map((i) => ({ ...i, leg: 'Last Mile', vendor: legs.lastMile.vendor })),
  ];

  const statusColor = marginStatus === 'ok' ? '#16A34A' : marginStatus === 'warning' ? '#D97706' : '#DC2626';

  return (
    <div className="print-view">
      <div className="pv">

        {/* Header removed — no kop surat image */}

        <div className="pv-content">
        {/* ════════ DOCUMENT TITLE ════════ */}
        <div className="pv-doc-title-row">
          <div>
            <div className="pv-doc-title">ESTIMASI BIAYA PENGIRIMAN</div>
            <div className="pv-doc-sub">Cost Estimation Report</div>
          </div>
          <div className="pv-doc-meta">
            <div>{dateStr}</div>
            <div className="pv-doc-ref">Ref: {refNo}</div>
          </div>
        </div>

        <div className="pv-divider" />

        {/* ════════ SECTION 1: Detail Pengiriman ════════ */}
        <div className="pv-sec">1. Detail Pengiriman</div>
        <table className="pv-detail">
          <tbody>
            <tr>
              <td className="pv-dl">Route</td>
              <td className="pv-dv" colSpan={3}><strong>{route}</strong></td>
            </tr>
            <tr>
              <td className="pv-dl">Produk / Moda</td>
              <td className="pv-dv">{shippingInfo.produkName || '-'}</td>
              <td className="pv-dl">Deskripsi</td>
              <td className="pv-dv">{shippingInfo.deskripsi || '-'}</td>
            </tr>
            <tr>
              <td className="pv-dl">Koli</td>
              <td className="pv-dv">{weightSummary.totalKoli} Koli</td>
              <td className="pv-dl">Kubikasi</td>
              <td className="pv-dv">{formatCbm(weightSummary.totalCbm)}</td>
            </tr>
            <tr>
              <td className="pv-dl">Actual Weight</td>
              <td className="pv-dv">{formatWeight(weightSummary.totalActualWeight)}</td>
              <td className="pv-dl">Volumetric Weight</td>
              <td className="pv-dv">{formatWeight(weightSummary.totalVolumetricWeight)}</td>
            </tr>
            <tr>
              <td className="pv-dl">Chargeable Weight (CW)</td>
              <td className="pv-dv pv-cw" colSpan={3}>{formatWeight(weightSummary.totalChargeableWeight, 0)}</td>
            </tr>
          </tbody>
        </table>

        {/* ════════ SECTION 2: Ringkasan Berat & Efisiensi ════════ */}
        <div className="pv-sec">2. Ringkasan Berat &amp; Efisiensi</div>
        <div className="pv-s5">
          <table className="pv-tbl pv-s5-tbl">
            <thead>
              <tr><th>Parameter</th><th>Nilai</th></tr>
            </thead>
            <tbody>
              <tr><td>Total Koli</td><td>{weightSummary.totalKoli}</td></tr>
              <tr><td>Actual Weight</td><td>{formatWeight(weightSummary.totalActualWeight)}</td></tr>
              <tr><td>Volumetric Weight</td><td>{formatWeight(weightSummary.totalVolumetricWeight)}</td></tr>
              <tr><td className="pv-bold">Chargeable Weight</td><td className="pv-cw pv-bold">{formatWeight(weightSummary.totalChargeableWeight, 0)}</td></tr>
              <tr><td>Kubikasi (CBM)</td><td>{formatCbm(weightSummary.totalCbm)}</td></tr>
            </tbody>
          </table>
          <table className="pv-tbl pv-s5-tbl">
            <thead>
              <tr><th>Efisiensi</th><th>Nilai</th></tr>
            </thead>
            <tbody>
              <tr><td>Revenue / Kg</td><td>Rp {formatRp(tariff.hargaPerKg)}</td></tr>
              <tr>
                <td>Cost / Kg</td>
                <td>Rp {weightSummary.totalChargeableWeight > 0 ? formatRp(Math.round(totalCost / weightSummary.totalChargeableWeight)) : '0'}</td>
              </tr>
              <tr className="pv-eff-highlight">
                <td className="pv-bold">Margin / Kg</td>
                <td className="pv-bold" style={{ color: statusColor }}>
                  Rp {weightSummary.totalChargeableWeight > 0 ? formatRp(Math.round(margin / weightSummary.totalChargeableWeight)) : '0'}
                </td>
              </tr>
              <tr>
                <td>Vol. Divider</td>
                <td>{shippingInfo.volumeDivider.toLocaleString('id-ID')} cm³/kg</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ════════ SECTION 3: Analisa Biaya per Leg & Margin ════════ */}
        <div className="pv-sec">3. Analisa Biaya per Leg &amp; Margin</div>
        <div className="pv-s4">
          <table className="pv-tbl pv-s4-tbl">
            <thead>
              <tr>
                <th>Leg</th>
                <th>Subtotal</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <LegRow label="First Mile" amount={subtotalFirstMile} total={totalCost} color="#2563EB" />
              <LegRow label="Middle Mile" amount={subtotalMiddleMile} total={totalCost} color="#7C3AED" />
              <LegRow label="Last Mile" amount={subtotalLastMile} total={totalCost} color="#16A34A" />
              {totalExtraCost > 0 && (
                <LegRow label="Biaya Tambahan" amount={totalExtraCost} total={totalCost} color="#D97706" />
              )}
            </tbody>
          </table>

          <div className="pv-mbox">
            <div className="pv-mbox-head">MARGIN</div>
            <div className="pv-mbox-amount" style={{ color: statusColor }}>
              Rp {formatRp(margin)}
            </div>
            <div className="pv-mbox-pct" style={{ color: statusColor }}>
              {marginPct.toFixed(2)}%
            </div>
            <div className="pv-mbox-bar">
              <div className="pv-mbox-bar-fill" style={{
                width: `${Math.min(Math.max(marginPct, 0), 100)}%`,
                background: statusColor,
              }} />
              <div className="pv-mbox-bar-target" style={{ left: `${TARGET_MARGIN}%` }} />
            </div>
            <div className="pv-mbox-target">Target {TARGET_MARGIN}%</div>
            <div className="pv-mbox-badge" style={{
              background: marginStatus === 'ok' ? '#DCFCE7' : marginStatus === 'warning' ? '#FEF3C7' : '#FEE2E2',
              color: statusColor,
            }}>
              {marginStatus === 'ok' ? 'TARGET TERCAPAI' : marginStatus === 'warning' ? 'DIBAWAH TARGET' : 'RUGI'}
            </div>
          </div>
        </div>

        {/* ════════ SECTION 4: Rincian Pendapatan (Revenue) ════════ */}
        <div className="pv-sec">4. Rincian Pendapatan (Revenue)</div>
        <table className="pv-tbl">
          <thead>
            <tr>
              <th>Deskripsi</th>
              <th>Satuan</th>
              <th>Harga / Kg</th>
              <th>Total Harga</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{shippingInfo.deskripsi || 'Ongkos Kirim Utama'}</td>
              <td>{formatWeight(weightSummary.totalChargeableWeight, 0)} (CW)</td>
              <td>Rp {formatRp(tariff.hargaPerKg)}</td>
              <td className="pv-bold pv-green">Rp {formatRp(totalRevenue)}</td>
            </tr>
            {discountCostNominal > 0 && (
              <tr>
                <td>Diskon Revenue</td>
                <td>{state.discountCostPct}% dari revenue bruto</td>
                <td>-</td>
                <td style={{ color: '#16A34A' }}>-Rp {formatRp(discountCostNominal)}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ════════ SECTION 5: Breakdown Biaya Operasional ════════ */}
        <div className="pv-sec">5. Breakdown Biaya Operasional</div>
        <table className="pv-tbl">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Detail</th>
              <th>Biaya</th>
            </tr>
          </thead>
          <tbody>
            {allLegItems.map((item) => (
              <tr key={item.id}>
                <td>{item.leg}</td>
                <td>{item.vendor ? `${item.vendor} (${item.deskripsi})` : item.deskripsi}</td>
                <td>Rp {formatRp(item.biaya)}</td>
              </tr>
            ))}
            {extraCosts.map((item) => (
              <tr key={item.id}>
                <td>Biaya Tambahan</td>
                <td>{item.deskripsi}</td>
                <td>Rp {formatRp(item.biaya)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {discountCostNominal > 0 && (
              <tr>
                <td colSpan={2}>MAKS DISKON UNTUK MARGIN 40%</td>
                <td>Rp {formatRp(targetDiscountFor40)}</td>
              </tr>
            )}
            <tr className="pv-row-total">
              <td colSpan={2}>TOTAL OPERATIONAL COST</td>
              <td>Rp {formatRp(totalCost)}</td>
            </tr>
            <tr className="pv-row-profit">
              <td colSpan={2}>PROFIT / MARGIN</td>
              <td style={{ color: statusColor }}>Rp {formatRp(margin)}</td>
            </tr>
            {discountCostNominal > 0 && (
              <tr>
                <td colSpan={2}>STATUS TARGET MARGIN 40% (SETELAH DISKON)</td>
                <td style={{ color: discountGapFor40 <= 0 ? '#16A34A' : '#D97706' }}>
                  {discountGapFor40 <= 0 ? 'Tercapai' : `Diskon berlebih Rp ${formatRp(discountGapFor40)}`}
                </td>
              </tr>
            )}
          </tfoot>
        </table>

        {/* ════════ Tanda Tangan ════════ */}
        <div className="pv-signatures">
          <div className="pv-sig">
            <div className="pv-sig-title">Dibuat Oleh :</div>
            <div className="pv-sig-space" />
            <div className="pv-sig-line" />
          </div>
          <div className="pv-sig">
            <div className="pv-sig-title">Diperiksa Oleh :</div>
            <div className="pv-sig-space" />
            <div className="pv-sig-line" />
          </div>
          <div className="pv-sig">
            <div className="pv-sig-title">Disetujui Oleh :</div>
            <div className="pv-sig-space" />
            <div className="pv-sig-line" />
          </div>
        </div>

        </div>{/* end pv-content */}
      </div>
    </div>
  );
}

function LegRow({ label, amount, total, color }: { label: string; amount: number; total: number; color: string }) {
  const pct = total > 0 ? ((amount / total) * 100) : 0;
  return (
    <tr>
      <td>
        <span className="pv-leg-dot" style={{ background: color }} />
        {label}
      </td>
      <td>Rp {formatRp(amount)}</td>
      <td>{pct.toFixed(1)}%</td>
    </tr>
  );
}
