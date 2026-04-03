# Plan: Modul Cost Estimation — Estimasi Margin Keuntungan

> **Versi:** v4 (Final)  
> **Tanggal:** 2026-04-01  
> **Prinsip utama:** Semua field bisa diedit kapan saja, hasil margin update **realtime** — cocok untuk simulasi negosiasi dengan customer.

---

## Context

Modul kalkulator **murni client-side** untuk mengestimasi profit margin pengiriman berdasarkan:

- Biaya operasional per leg (first mile, middle mile, last mile) termasuk manpower, forklift, vendor, dll
- Route pengiriman (asal - tujuan) freetext
- Perhitungan **Actual Weight, Volumetric Weight, Chargeable Weight, dan Kubikasi (CBM)**
- Perbandingan revenue vs total cost — **margin target minimal 40%**
- **Semua field bisa diedit bolak-balik** untuk simulasi penawaran/negosiasi customer

Semua field bersifat **freetext** — tidak ada fetch dari database.  
Tidak butuh API endpoint baru maupun perubahan database.

---

## Daftar File

| Aksi | File | Tujuan |
|------|------|--------|
| **BARU** | `src/app/(dashboard)/tools/cost-estimation/page.tsx` | Halaman kalkulator |
| **UBAH** | `src/components/AppShellLayout.tsx` | Tambah menu "Tools > Cost Estimation" di sidebar |

- **API Endpoint Baru:** Tidak ada
- **Perubahan Database:** Tidak ada

---

## Prinsip: Semua Bisa Diedit, Margin Realtime

Ini **bukan** form wizard satu arah (isi step 1 → 2 → 3 → selesai).  
Ini adalah **kalkulator interaktif** dimana:

1. **Setiap field bisa diubah kapan saja** — edit tarif, ubah cost, hapus item, tambah item, ganti dimensi — semua langsung mempengaruhi hasil.
2. **Margin selalu terlihat** — panel hasil estimasi (summary cards) ditampilkan di posisi **sticky** di bagian bawah layar, sehingga saat user scroll ke atas untuk edit cost, margin tetap terlihat berubah realtime.
3. **Tidak ada tombol "Hitung"** — semua kalkulasi terjadi otomatis via `useMemo` yang react terhadap perubahan state.

### Skenario Penggunaan: Negosiasi Customer

```
Situasi: Customer minta diskon, harga yang kita tawarkan terlalu tinggi.

1. User sudah input semua data awal → margin 45% (hijau)
2. Customer minta turun harga → user ubah "Harga per Kg" dari Rp 15.000 ke Rp 12.000
   → margin langsung turun jadi 28% (oranye, warning muncul)
3. User coba kurangi cost → hapus item "Forklift" di First Mile (Rp 200.000)
   → margin naik jadi 35% (masih oranye)
4. User negosiasi vendor middle mile → ubah "Kapal" dari Rp 500.000 ke Rp 400.000
   → margin naik jadi 41% (hijau! target tercapai)
5. Deal! Semua angka final bisa dilihat di breakdown
```

```
Situasi: Bandingkan opsi pengiriman yang berbeda.

1. Opsi A: Middle mile via kapal (Rp 500.000) → margin 25%
2. User ubah deskripsi jadi "Pesawat" dan biaya jadi Rp 800.000 → margin 10%
3. User putuskan pakai kapal karena marginnya lebih baik
4. Ubah kembali ke Rp 500.000
```

### Visual: Sticky Summary Panel

```
+=========================================================================+
|                        HALAMAN COST ESTIMATION                          |
|                                                                         |
|  [Step 1: Info Pengiriman          ]  <- user bisa scroll               |
|  [Step 2: Detail Barang            ]     dan edit di sini               |
|  [Step 3: Tarif Penjualan          ]                                    |
|  [Step 4: Biaya Operasional        ]                                    |
|  [Step 5: Biaya Tambahan           ]                                    |
|  [Step 6: Detail Breakdown         ]                                    |
|                                                                         |
|  .....(scroll area).....                                                |
|                                                                         |
+=========================================================================+
|  STICKY BOTTOM BAR (selalu terlihat)                                    |
|  +-------------+ +-------------+ +-------------+ +-----------+         |
|  | Revenue     | | Total Cost  | | Margin      | | Margin %  |         |
|  | Rp1.800.000 | | Rp1.575.000 | | Rp 225.000  | |  12.50%   |         |
|  |   (hijau)   | |   (merah)   | |  (oranye)   | | (oranye)  |         |
|  +-------------+ +-------------+ +-------------+ +-----------+         |
|  [!] Margin belum memenuhi target 40% — kurangi cost Rp 495.000        |
+=========================================================================+
```

**Implementasi sticky:** `position: sticky; bottom: 0; z-index: 10` pada container summary cards. Ini memastikan user **selalu lihat dampak** setiap perubahan yang dilakukan tanpa perlu scroll ke bawah.

---

## Flow & Wireframe Lengkap

---

### STEP 1: Informasi Pengiriman

Field sederhana untuk identifikasi estimasi. **Bisa diedit kapan saja.**

```
+-------------------------------------------------------------+
|  INFORMASI PENGIRIMAN                                       |
|                                                             |
|  +---------------------+  +---------------------+          |
|  | Asal                |  | Tujuan              |          |
|  | [Makassar_________] |  | [Jakarta__________] |          |
|  +---------------------+  +---------------------+          |
|  +----------------------------------------------+           |
|  | Deskripsi Pengiriman                         |           |
|  | [Elektronik 5 karton______________________] |           |
|  +----------------------------------------------+           |
+-------------------------------------------------------------+
```

**Fields:**

| Field | Tipe | Wajib | Keterangan |
|-------|------|-------|------------|
| Asal | TextInput | Ya | Kota/lokasi asal, freetext |
| Tujuan | TextInput | Ya | Kota/lokasi tujuan, freetext |
| Deskripsi | TextInput | Tidak | Keterangan pengiriman |

**Layout:** `SimpleGrid cols={2}` untuk asal/tujuan, full-width untuk deskripsi.

---

### STEP 2: Detail Barang & Perhitungan Berat

Ada **2 mode input** yang bisa dipilih via `SegmentedControl`.  
**Bisa diedit kapan saja** — ubah dimensi, tambah/hapus baris, ganti berat → CW & revenue langsung berubah.

#### Mode A: Hitung dari Dimensi (default)

User input dimensi per baris, sistem **otomatis hitung** Actual Weight, Volumetric Weight, Chargeable Weight, dan CBM.

```
+-----------------------------------------------------------------------------+
|  DETAIL BARANG & PERHITUNGAN BERAT                                          |
|                                                                             |
|  [* Hitung dari Dimensi ]  [ Input Langsung ]                              |
|                                                                             |
|  +--- INPUT ---- (editable) --------------+--- AUTO-CALCULATE -----------+ |
|  |                                        |                              | |
|  | Koli  P(cm) L(cm) T(cm) Brt(kg)       | Act.W   Vol.W   CW    CBM    | |
|  | ----- ----- ----- ----- --------       | ------- ------- ----- ------ | |
|  |  2     60    40    50    30             | 30 kg  48 kg   48 kg 0.240  |x|
|  |  3     40    30    30    15             | 15 kg  21.6kg  22 kg 0.108  |x|
|  |  1     80    60    50    25             | 25 kg  48 kg   48 kg 0.240  |x|
|  +----------------------------------------+------------------------------+ |
|  [+ Tambah Baris]                                                           |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |  RINGKASAN BERAT                                                     |   |
|  |                                                                      |   |
|  |  Total Koli             :    6                                       |   |
|  |  Total Actual Weight    :   70 kg     <- berat timbangan fisik       |   |
|  |  Total Volumetric Wt   :  117.6 kg   <- berat berdasarkan dimensi   |   |
|  |  Total Chargeable Wt   :  118 kg     <- MAX dari keduanya, ceiling  |   |
|  |  Total Kubikasi (CBM)  : 0.588 m3    <- volume fisik barang         |   |
|  |                                                                      |   |
|  |  (i) Chargeable Weight digunakan untuk perhitungan revenue           |   |
|  +---------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------+
```

**Kolom tabel:**

| Kolom | Tipe | Input/Auto | Editable | Keterangan |
|-------|------|------------|----------|------------|
| Koli | NumberInput | Input | **Ya** | Jumlah koli/paket |
| P (cm) | NumberInput | Input | **Ya** | Panjang dalam cm |
| L (cm) | NumberInput | Input | **Ya** | Lebar dalam cm |
| T (cm) | NumberInput | Input | **Ya** | Tinggi dalam cm |
| Berat (kg) | NumberInput | Input | **Ya** | Berat aktual timbangan (kg) |
| Actual Wt | Text | Auto | Tidak | = berat input |
| Volumetric Wt | Text | Auto | Tidak | = (P x L x T x Koli) / 5.000 |
| Chargeable Wt | Text | Auto | Tidak | = ceil(max(Actual, Volumetric)) |
| CBM | Text | Auto | Tidak | = (P x L x T x Koli) / 1.000.000 |
| Hapus | ActionIcon | - | - | Tombol hapus baris |

**Contoh perhitungan baris 1:** 2 koli @ 60x40x50 cm, berat 30 kg

```
Actual Weight     = 30 kg
Volumetric Weight = (60 x 40 x 50 x 2) / 5.000 = 48 kg
Chargeable Weight = ceil(max(30, 48)) = 48 kg
CBM               = (60 x 40 x 50 x 2) / 1.000.000 = 0.240 m3
```

**Total (sum semua baris):**

```
Total Koli        = SUM(koli per baris)        = 2 + 3 + 1 = 6
Total Actual Wt   = SUM(actual wt per baris)   = 30 + 15 + 25 = 70 kg
Total Volumetric  = SUM(vol. wt per baris)     = 48 + 21.6 + 48 = 117.6 kg
Total Chargeable  = SUM(CW per baris)          = 48 + 22 + 48 = 118 kg
Total CBM         = SUM(cbm per baris)         = 0.240 + 0.108 + 0.240 = 0.588 m3
```

#### Mode B: Input Langsung

Untuk user yang sudah tahu angka pastinya. **Semua field editable.**

```
+-------------------------------------------------------------+
|  [  Hitung dari Dimensi ]  [* Input Langsung ]              |
|                                                             |
|  +--------------+ +--------------+ +--------------+         |
|  | Total Koli   | | Actual Wt    | | Volumetric   |         |
|  | [6_________] | | [70 kg_____] | | [117.6 kg__] |         |
|  +--------------+ +--------------+ +--------------+         |
|  +--------------+ +--------------+                          |
|  | Chargbl. Wt  | | CBM (m3)     |                          |
|  | [118 kg____] | | [0.588_____] |                          |
|  +--------------+ +--------------+                          |
|                                                             |
|  (i) Chargeable Weight digunakan untuk perhitungan revenue  |
+-------------------------------------------------------------+
```

---

### STEP 3: Tarif Penjualan (Revenue)

User input tarif jual, sistem langsung hitung estimasi revenue berdasarkan **Chargeable Weight** dari Step 2.  
**Tarif bisa diubah kapan saja** — misalnya saat negosiasi customer minta diskon harga.

```
+-------------------------------------------------------------+
|  TARIF PENJUALAN                                            |
|                                                             |
|  +--------------------+  +--------------------+             |
|  | Harga per Kg       |  | Harga per Koli     |             |
|  | [Rp 15.000_______] |  | [Rp 5.000________] |             |
|  +--------------------+  +--------------------+             |
|                                                             |
|  +-----------------------------------------------------+   |
|  |  ESTIMASI REVENUE                                    |   |
|  |                                                      |   |
|  |  Biaya Berat : 118 kg x Rp 15.000  = Rp 1.770.000   |   |
|  |  Biaya Koli  : 6 koli x Rp 5.000   = Rp    30.000   |   |
|  |  --------------------------------------------------- |   |
|  |  Total Revenue                      = Rp 1.800.000   |   |
|  +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

**Rumus:**

```
Revenue Berat  = Total Chargeable Weight x Harga per Kg
Revenue Koli   = Total Koli x Harga per Koli
Total Revenue  = Revenue Berat + Revenue Koli
```

> **Catatan:** Yang dipakai adalah **Chargeable Weight**, bukan Actual Weight atau Volumetric Weight.

---

### STEP 4: Biaya Operasional Per Leg

Setiap leg (First Mile, Middle Mile, Last Mile) punya **section sendiri** dalam Accordion.  
Masing-masing berisi: **nama vendor** + **daftar biaya dinamis** (bisa tambah/hapus/edit).

**Semua field bisa diedit kapan saja:**
- Ubah nama vendor
- Ubah deskripsi atau jumlah biaya yang sudah ada
- Hapus item biaya yang tidak jadi dipakai
- Tambah item biaya baru

```
+-------------------------------------------------------------+
|  BIAYA OPERASIONAL                                          |
|                                                             |
|  +--- FIRST MILE ---------------------- Rp 650.000 -- [v] +|
|  |                                                         ||
|  |  Vendor: [PT. ABC Transport________________________]    ||
|  |                                                         ||
|  |  +----------------------------+---------------+---+     ||
|  |  | Deskripsi                  | Biaya (Rp)    |   |     ||
|  |  +----------------------------+---------------+---+     ||
|  |  | Charter CDD                |    300.000    | x |     ||
|  |  | Manpower (3 orang)         |    150.000    | x |     ||
|  |  | Forklift                   |    200.000    | x |     ||
|  |  +----------------------------+---------------+---+     ||
|  |  [+ Tambah Biaya]                                       ||
|  |                                                         ||
|  |  Subtotal First Mile: Rp 650.000                        ||
|  +---------------------------------------------------------+|
|                                                             |
|  +--- MIDDLE MILE --------------------- Rp 575.000 -- [v] +|
|  |                                                         ||
|  |  Vendor: [PT. Pelni________________________________]    ||
|  |                                                         ||
|  |  +----------------------------+---------------+---+     ||
|  |  | Kapal Makassar-Jakarta     |    500.000    | x |     ||
|  |  | Handling pelabuhan         |     75.000    | x |     ||
|  |  +----------------------------+---------------+---+     ||
|  |  [+ Tambah Biaya]                                       ||
|  |                                                         ||
|  |  Subtotal Middle Mile: Rp 575.000                       ||
|  +---------------------------------------------------------+|
|                                                             |
|  +--- LAST MILE ----------------------- Rp 300.000 -- [v] +|
|  |                                                         ||
|  |  Vendor: [Internal_________________________________]    ||
|  |                                                         ||
|  |  +----------------------------+---------------+---+     ||
|  |  | Kendaraan box              |    200.000    | x |     ||
|  |  | Manpower (2 orang)         |    100.000    | x |     ||
|  |  +----------------------------+---------------+---+     ||
|  |  [+ Tambah Biaya]                                       ||
|  |                                                         ||
|  |  Subtotal Last Mile: Rp 300.000                         ||
|  +---------------------------------------------------------+|
|                                                             |
|  =========================================================  |
|   TOTAL BIAYA OPERASIONAL                  Rp 1.525.000     |
|  =========================================================  |
+-------------------------------------------------------------+
```

**Struktur per leg:**

| Field | Tipe | Editable | Keterangan |
|-------|------|----------|------------|
| Vendor | TextInput | **Ya** | Nama vendor/pihak, bisa diganti kapan saja |
| Items[].Deskripsi | TextInput | **Ya** | Nama biaya, bisa diedit inline |
| Items[].Biaya | NumberInput (Rp) | **Ya** | Jumlah biaya, bisa diubah untuk simulasi |
| Subtotal | Auto-calculated | Tidak | SUM otomatis dari semua items |

**Accordion header** selalu menampilkan: **ikon + nama leg + subtotal** (terlihat walaupun di-collapse).

**Contoh item biaya tipikal:**

| Leg | Contoh Item |
|-----|-------------|
| First Mile | Charter kendaraan, manpower bongkar muat, sewa forklift, biaya tol |
| Middle Mile | Kapal/pesawat/truk antar kota, handling bandara/pelabuhan, asuransi transit |
| Last Mile | Kendaraan pengiriman, manpower, biaya parkir/tol, COD handling |

---

### STEP 5: Biaya Tambahan (Opsional)

Biaya yang tidak termasuk ke leg manapun. **Bisa ditambah/diedit/dihapus kapan saja.**

```
+-------------------------------------------------------------+
|  BIAYA TAMBAHAN                                             |
|                                                             |
|  +----------------------------+---------------+---+         |
|  | Deskripsi                  | Biaya (Rp)    |   |         |
|  +----------------------------+---------------+---+         |
|  | Asuransi                   |     25.000    | x |         |
|  | Packaging / wrapping       |     15.000    | x |         |
|  | Administrasi               |     10.000    | x |         |
|  +----------------------------+---------------+---+         |
|  [+ Tambah Biaya]                                           |
|                                                             |
|  Total Biaya Tambahan: Rp 50.000                            |
+-------------------------------------------------------------+
```

---

### STEP 6: Hasil Estimasi Margin

Bagian ini terdiri dari 2 area:
- **6A. Sticky Summary Bar** — selalu terlihat di bawah layar
- **6B-6D. Detail Section** — di dalam scroll area, bisa di-expand

#### 6A. Sticky Summary Bar (selalu terlihat di bawah layar)

Bar ini **fixed di bagian bawah** viewport sehingga user selalu melihat dampak setiap perubahan.

```
+==========================================================================+
| STICKY BAR (position: sticky, bottom: 0)                                |
|                                                                          |
| Makassar -> Jakarta | 6 koli | 118 kg (CW) | 0.588 m3                   |
|                                                                          |
| +---------------+ +---------------+ +---------------+ +------------+     |
| | Est. Revenue  | | Total Cost    | | Est. Margin   | | Margin %   |     |
| |               | |               | |               | |            |     |
| | Rp 1.800.000  | | Rp 1.575.000  | | Rp 225.000    | |   12.50%   |     |
| |    (hijau)    | |    (merah)    | |   (oranye)    | |  (oranye)  |     |
| +---------------+ +---------------+ +---------------+ +------------+     |
|                                                                          |
| [!] Margin belum memenuhi target 40% — kurangi cost Rp 495.000          |
|     atau naikkan harga/kg ke minimal Rp 21.992                           |
+==========================================================================+
```

**Perilaku sticky bar:**
- Selalu terlihat di bawah layar saat scroll
- Update **realtime** saat user ubah field apapun (tarif, cost, dimensi, dll)
- Menampilkan info ringkas: route, koli, CW, CBM
- 4 summary cards dengan warna sesuai kondisi margin
- Satu baris pesan margin status (hijau/oranye/merah)

**Skenario negosiasi dengan sticky bar:**

```
User scroll ke Step 4 untuk edit cost Middle Mile:
+--------------------------------------------------+
|  +--- MIDDLE MILE ---- Rp 575.000 ----------+   |  <- user edit di sini
|  |  Vendor: [PT. Pelni]                      |   |
|  |  | Kapal Makassar-Jakarta | [500.000] | x |   |  <- ubah jadi 400.000
|  +--------------------------------------------+   |
|                                                    |
|  ... (rest of page) ...                            |
|                                                    |
+====================================================+
| Revenue: Rp1.800.000 | Cost: Rp1.475.000           |  <- sticky bar
| Margin: Rp 325.000   | 18.06% [!] belum 40%        |  <- langsung update!
+====================================================+
```

User langsung lihat margin berubah dari 12.50% ke 18.06% tanpa perlu scroll ke bawah.

#### 6B. Alert Margin (kondisional, di dalam scroll area)

Ditampilkan di section detail, lebih lengkap dari sticky bar.

**Kondisi margin >= 40% (TARGET TERCAPAI):**

```
+---------------------------------------------------------------------+
|  [v] MARGIN MEMENUHI TARGET                                         |
|  Margin saat ini: 45.00% (target minimal: 40%)                     |
+---------------------------------------------------------------------+
```

Warna: hijau.

**Kondisi margin 0% - 39% (BELUM MEMENUHI):**

```
+---------------------------------------------------------------------+
|  [!] MARGIN BELUM MEMENUHI TARGET MINIMUM 40%                       |
|                                                                      |
|  Margin saat ini       : 12.50%                                      |
|  Target margin         : 40%                                         |
|  Kekurangan margin     : 27.50%                                      |
|                                                                      |
|  Untuk mencapai margin 40% dengan total cost Rp 1.575.000:          |
|  -> Revenue minimum    : Rp 2.625.000                                |
|  -> Harga/kg minimum   : Rp 21.992  (saat ini Rp 15.000)            |
|  -> Atau kurangi cost  : Rp 495.000  (menjadi Rp 1.080.000)         |
+---------------------------------------------------------------------+
```

Warna: oranye.

**Kondisi margin < 0% (RUGI):**

```
+---------------------------------------------------------------------+
|  [X] RUGI - MARGIN NEGATIF                                          |
|                                                                      |
|  Margin saat ini       : -45.58%                                     |
|  Kerugian              : Rp 490.000                                  |
|                                                                      |
|  Untuk mencapai margin 40%:                                          |
|  -> Revenue minimum    : Rp 2.625.000                                |
|  -> Harga/kg minimum   : Rp 21.992  (saat ini Rp 15.000)            |
|  -> Atau kurangi cost  : Rp 1.575.000  (menjadi Rp 0)               |
+---------------------------------------------------------------------+
```

Warna: merah.

#### 6C. Detail Breakdown

```
+---------------------------------------------------------------------+
|  DETAIL BREAKDOWN                                                    |
|                                                                      |
|  REVENUE                                           Rp 1.800.000     |
|  |-- Biaya Berat   : 118 kg x Rp 15.000            Rp 1.770.000    |
|  +-- Biaya Koli    : 6 koli x Rp 5.000             Rp    30.000    |
|                                                                      |
|  BIAYA OPERASIONAL                                 Rp 1.525.000     |
|  |-- First Mile (PT. ABC Transport)                 Rp   650.000    |
|  |   |-- Charter CDD                               Rp   300.000    |
|  |   |-- Manpower (3 orang)                         Rp   150.000    |
|  |   +-- Forklift                                   Rp   200.000    |
|  |-- Middle Mile (PT. Pelni)                        Rp   575.000    |
|  |   |-- Kapal Makassar-Jakarta                     Rp   500.000    |
|  |   +-- Handling pelabuhan                         Rp    75.000    |
|  +-- Last Mile (Internal)                           Rp   300.000    |
|      |-- Kendaraan box                              Rp   200.000    |
|      +-- Manpower (2 orang)                         Rp   100.000    |
|                                                                      |
|  BIAYA TAMBAHAN                                    Rp    50.000     |
|  |-- Asuransi                                       Rp    25.000    |
|  |-- Packaging / wrapping                           Rp    15.000    |
|  +-- Administrasi                                   Rp    10.000    |
|                                                                      |
|  ================================================================    |
|  TOTAL COST                                        Rp 1.575.000     |
|  MARGIN                                            Rp   225.000     |
|  MARGIN %                                               12.50%      |
|  ================================================================    |
+---------------------------------------------------------------------+
```

#### 6D. Ringkasan Berat & Efisiensi

```
+---------------------------------------------------------------------+
|  RINGKASAN BERAT                                                     |
|                                                                      |
|  Total Koli              :      6                                    |
|  Total Actual Weight     :     70 kg                                 |
|  Total Volumetric Weight :    117.6 kg                               |
|  Total Chargeable Weight :    118 kg     <- dipakai untuk revenue    |
|  Total Kubikasi (CBM)    :  0.588 m3                                 |
|  Biaya per Kg (CW)       : Rp 13.347    <- total cost / CW          |
|  Revenue per Kg (CW)     : Rp 15.254    <- total revenue / CW       |
+---------------------------------------------------------------------+
```

---

## Ringkasan Editability Semua Field

Tabel ini menegaskan bahwa **setiap field bisa diedit kapan saja** dan dampaknya langsung terasa di margin.

| Step | Field | Editable | Dampak ke Margin |
|------|-------|----------|------------------|
| 1 | Asal, Tujuan, Deskripsi | **Ya** | Tidak langsung (info saja) |
| 2 | Koli, P, L, T, Berat per baris | **Ya** | CW berubah → revenue berubah → margin berubah |
| 2 | Tambah/hapus baris detail | **Ya** | CW berubah → revenue berubah → margin berubah |
| 2 | Direct: Koli, AW, VW, CW, CBM | **Ya** | CW berubah → revenue berubah → margin berubah |
| 3 | Harga per Kg | **Ya** | Revenue langsung berubah → margin berubah |
| 3 | Harga per Koli | **Ya** | Revenue langsung berubah → margin berubah |
| 4 | Vendor per leg | **Ya** | Tidak langsung (info saja) |
| 4 | Deskripsi cost item | **Ya** | Tidak langsung (info saja) |
| 4 | **Jumlah cost item** | **Ya** | **Cost berubah → margin langsung berubah** |
| 4 | **Tambah/hapus cost item** | **Ya** | **Cost berubah → margin langsung berubah** |
| 5 | Deskripsi biaya tambahan | **Ya** | Tidak langsung (info saja) |
| 5 | **Jumlah biaya tambahan** | **Ya** | **Cost berubah → margin langsung berubah** |
| 5 | **Tambah/hapus biaya tambahan** | **Ya** | **Cost berubah → margin langsung berubah** |

**Semua perubahan yang berdampak ke angka akan langsung memperbarui:**
1. Preview revenue (Step 3)
2. Subtotal per leg (Step 4)
3. Summary cards di sticky bar (selalu terlihat)
4. Alert margin status
5. Detail breakdown
6. Ringkasan berat & efisiensi

---

## Semua Rumus Perhitungan

### A. Perhitungan Berat (per baris detail)

```
Actual Weight (AW)     = berat (input user, dalam kg)
Volumetric Weight (VW) = (Panjang x Lebar x Tinggi x Koli) / 5.000
Chargeable Weight (CW) = ceil(max(AW, VW))
CBM (Kubikasi)         = (Panjang x Lebar x Tinggi x Koli) / 1.000.000
```

Keterangan:
- Dimensi dalam **cm**, berat dalam **kg**, CBM dalam **m3**
- `ceil` = pembulatan ke atas
- `max` = ambil yang terbesar antara actual dan volumetric
- Pembagi 5.000 adalah standar industri logistik (cm3 ke kg)
- Pembagi 1.000.000 adalah konversi cm3 ke m3

### B. Total Berat (sum semua baris)

```
Total Koli        = SUM(koli per baris)
Total Actual Wt   = SUM(actual weight per baris)
Total Volumetric  = SUM(volumetric weight per baris)
Total Chargeable  = SUM(chargeable weight per baris)
Total CBM         = SUM(cbm per baris)
```

### C. Revenue

```
Revenue Berat  = Total Chargeable Weight x Harga per Kg
Revenue Koli   = Total Koli x Harga per Koli
Total Revenue  = Revenue Berat + Revenue Koli
```

### D. Cost

```
Subtotal First Mile   = SUM(biaya items first mile)
Subtotal Middle Mile  = SUM(biaya items middle mile)
Subtotal Last Mile    = SUM(biaya items last mile)
Total Operasional     = Subtotal First + Middle + Last
Total Tambahan        = SUM(biaya tambahan)
Total Cost            = Total Operasional + Total Tambahan
```

### E. Margin

```
Margin         = Total Revenue - Total Cost
Margin %       = (Margin / Total Revenue) x 100
Biaya per Kg   = Total Cost / Total Chargeable Weight
Revenue per Kg = Total Revenue / Total Chargeable Weight
```

### F. Margin Target 40%

```
TARGET_MARGIN = 40%

Status:
  - Margin % >= 40%          ->  MEMENUHI TARGET (hijau)
  - 0% <= Margin % < 40%    ->  BELUM MEMENUHI (oranye)
  - Margin % < 0%            ->  RUGI (merah)

Rekomendasi (untuk mencapai margin 40%):
  Revenue Minimum  = Total Cost / (1 - 0.40)
                   = Total Cost / 0.6

  Harga/kg Minimum = (Revenue Minimum - Revenue Koli) / Total CW

  Cost Reduction   = Total Cost - (Total Revenue x 0.6)
                   = berapa cost yang harus dikurangi agar margin jadi 40%
```

### G. Warna & Status

| Kondisi | Warna Card | Alert | Pesan Sticky Bar |
|---------|------------|-------|------------------|
| Margin >= 40% | Hijau | Sukses hijau | "Margin memenuhi target" |
| 0% <= Margin < 40% | Oranye | Warning + rekomendasi | "Belum memenuhi target 40%" |
| Margin < 0% | Merah | Alert RUGI + rekomendasi | "RUGI — margin negatif" |

---

## State Structure (TypeScript)

```typescript
// === STEP 1: Info Pengiriman ===
asal: string                          // freetext kota asal
tujuan: string                        // freetext kota tujuan
deskripsi: string                     // freetext keterangan

// === STEP 2: Detail Barang ===
inputMode: "dimensions" | "direct"    // toggle mode input

// Mode Dimensi (multi-row, setiap cell editable)
interface DetailItem {
  key: number
  coly: number                        // input: jumlah koli
  length: number                      // input: panjang (cm)
  width: number                       // input: lebar (cm)
  height: number                      // input: tinggi (cm)
  weight: number                      // input: berat aktual (kg)
  // auto-calculated:
  actualWeight: number                // = weight
  volumetricWeight: number            // = (P x L x T x koli) / 5000
  chargeableWeight: number            // = ceil(max(actual, volumetric))
  cbm: number                         // = (P x L x T x koli) / 1000000
}
details: DetailItem[]

// Mode Input Langsung (semua editable)
directColy: number                    // total koli
directActualWeight: number            // total actual weight (kg)
directVolumetricWeight: number        // total volumetric weight (kg)
directChargeableWeight: number        // total chargeable weight (kg)
directCbm: number                     // total CBM (m3)

// === STEP 3: Tarif Penjualan (editable) ===
hargaPerKg: number                    // tarif per kg (Rupiah)
hargaPerKoli: number                  // tarif per koli (Rupiah)

// === STEP 4: Biaya Operasional Per Leg (semua editable) ===
interface CostItem {
  key: number
  description: string                 // nama biaya (freetext, editable)
  amount: number                      // jumlah (Rupiah, editable)
}
interface LegData {
  vendor: string                      // nama vendor (freetext, editable)
  items: CostItem[]                   // daftar biaya (tambah/hapus/edit)
}
firstMile: LegData
middleMile: LegData
lastMile: LegData

// === STEP 5: Biaya Tambahan (semua editable) ===
interface OtherCost {
  key: number
  description: string                 // nama biaya (freetext, editable)
  amount: number                      // jumlah (Rupiah, editable)
}
otherCosts: OtherCost[]
```

---

## Mantine Components yang Digunakan

| Section | Component | Catatan |
|---------|-----------|---------|
| Layout keseluruhan | `Stack`, `Card withBorder` | Setiap step dalam Card tersendiri |
| Asal/Tujuan | `SimpleGrid cols={2}`, `TextInput` | Freetext, editable |
| Mode toggle | `SegmentedControl` | "Hitung dari Dimensi" / "Input Langsung" |
| Tabel detail barang | `Table` + inline `NumberInput` per cell | Semua cell editable + tombol hapus |
| Ringkasan berat | `Paper` dengan `SimpleGrid` | Background warna subtle |
| Tarif input | `SimpleGrid cols={2}`, `NumberInput` | Prefix "Rp", editable |
| Revenue preview | `Paper` dengan `Stack` + `Text` | Kalkulasi live |
| Per-leg section | `Accordion` (3 items, default semua terbuka) | Bisa collapse/expand |
| Accordion header | `Group`: ikon + label + `Badge` subtotal | Subtotal selalu terlihat |
| Vendor per leg | `TextInput` | Opsional, editable |
| Cost items per leg | `Table` + `TextInput` + `NumberInput` + `ActionIcon` | Semua editable, dynamic rows |
| Tombol tambah | `Button variant="light"` + `IconPlus` | Per section |
| **Sticky summary bar** | `Box` dengan `position: sticky, bottom: 0` | **Selalu terlihat saat scroll** |
| Summary cards | `SimpleGrid cols={4}` + `Card` border-kiri berwarna | Di dalam sticky bar |
| Margin alert | `Alert` component | Warna hijau/oranye/merah sesuai kondisi |
| Detail breakdown | `Card` + `Stack` + `Text` indented | Tree-style hierarchy |
| Ringkasan berat akhir | `Card` + key-value layout | Termasuk biaya/kg dan revenue/kg |

---

## Navigasi Sidebar

Tambah di `src/components/AppShellLayout.tsx` dalam array `menuItems`:

```typescript
{
  label: "Tools",
  icon: IconCalculator,    // import dari @tabler/icons-react
  href: "/tools",
  children: [
    { label: "Cost Estimation", href: "/tools/cost-estimation" },
  ],
},
```

---

## Urutan Implementasi

1. **Buat halaman** `src/app/(dashboard)/tools/cost-estimation/page.tsx`
   - State & interfaces
   - Step 1: Info pengiriman (TextInput asal, tujuan, deskripsi)
   - Step 2: Detail barang (tabel dimensi editable + ringkasan AW/VW/CW/CBM)
   - Step 3: Tarif penjualan editable + preview revenue
   - Step 4: Biaya operasional per leg (Accordion dengan vendor + dynamic cost items, semua editable)
   - Step 5: Biaya tambahan (dynamic rows, semua editable)
   - Step 6: Sticky summary bar + alert margin + detail breakdown + ringkasan berat
2. **Update navigasi** `src/components/AppShellLayout.tsx` — tambah menu Tools

---

## Verifikasi / Testing

| # | Test Case | Expected |
|---|-----------|----------|
| 1 | Input dimensi per baris | AW, VW, CW, CBM auto-calculated per baris |
| 2 | VW > AW pada suatu baris | CW = VW (dibulatkan ke atas) |
| 3 | AW > VW pada suatu baris | CW = AW (dibulatkan ke atas) |
| 4 | Toggle ke mode "Input Langsung" | Semua 5 field bisa diisi manual |
| 5 | Input tarif per kg & per koli | Revenue preview update realtime |
| 6 | **Edit jumlah cost item yang sudah ada** | **Subtotal leg + total cost + margin update realtime** |
| 7 | **Hapus cost item** | **Subtotal berkurang, margin naik** |
| 8 | **Tambah cost item baru** | **Subtotal bertambah, margin turun** |
| 9 | **Edit harga/kg (simulasi diskon)** | **Revenue turun, margin turun realtime** |
| 10 | **Edit cost sambil lihat sticky bar** | **Sticky bar update tanpa scroll** |
| 11 | Margin >= 40% | Card hijau, sticky bar hijau |
| 12 | Margin 0%-39% | Card oranye, alert + rekomendasi harga/kg min & cost reduction |
| 13 | Margin < 0% | Card merah, alert "RUGI" + rekomendasi |
| 14 | Semua angka Rupiah | Format Rp xxx.xxx (titik ribuan) |
| 15 | CBM | Format x.xxx m3 (3 desimal) |
| 16 | Detail breakdown | Tree lengkap per leg per item termasuk nama vendor |
| 17 | Ringkasan berat | Tampil AW, VW, CW, CBM + biaya/kg + revenue/kg |

---

## File Referensi

| File | Yang Direferensi |
|------|------------------|
| `src/app/(dashboard)/vendor/margin/page.tsx` baris 131-148 | Pattern summary cards (border-left berwarna) |
| `src/app/(dashboard)/pos/new/page.tsx` baris 85-93 | `calcRow()`, `DetailRow`, `VOLUME_DIVISOR = 5000` |
| `src/app/(dashboard)/pos/new/page.tsx` baris 95-98 | `formatCurrency()` pattern |
| `src/components/AppShellLayout.tsx` | Sidebar `menuItems` structure |
