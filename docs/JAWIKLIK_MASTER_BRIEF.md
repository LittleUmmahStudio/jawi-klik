# JawiKlik — MASTER BRIEF

**Versi dokumen:** 2.0 (Perancangan; dikemas kini selepas keputusan aset & animasi)  
**Nama produk:** JawiKlik  
**Tagline:** Sentuh • Sebut • Eja • Tulis  
**Jenis:** Game pendidikan Jawi 2.5D untuk web telefon (portrait sahaja)  
**Pembangun / identiti:** Little Ummah Studio (cadangan paparan kredit)  
**Sasaran awal:** Murid sekolah rendah yang sedang mempelajari suku kata tertutup Jawi  
**Rujukan kandungan:** `911109420-Suku-Kata-Tertutup-Jawi.pdf` (nota yang dibekalkan guru; setiap entri perlu disemak sebelum digunakan)

---

## 1. Visi

JawiKlik ialah dunia kecil yang hidup, ceria dan mudah disentuh. Murid membantu penduduk **Taman Bunyi** mengembalikan bunyi dan tulisan Jawi melalui empat tindakan sebenar: **dengar/sebut, baca, eja dan tulis**. Setiap jawapan yang diselesaikan mengubah taman: bunga mekar, lampu menyala, haiwan comel muncul atau NPC bersorak.

**Janji pengalaman:** Murid bukan sekadar menjawab kuiz; mereka berinteraksi dengan objek di dunia 2.5D dan melihat hasil pembelajaran mereka. Sesi ringkas, bebas tekanan, sesuai untuk telefon yang dipegang **menegak**.

## 2. Objektif pembelajaran dan eviden

| Objektif | Tingkah laku murid | Eviden dalam game |
|---|---|---|
| Membaca suku kata tertutup | Memilih / membaca kad Jawi yang dipaparkan | Pemilihan kad tepat; bacaan secara lisan disemak guru jika perlu |
| Membunyikan suku kata | Mendengar model audio lalu menyebut semula | Butang **Saya sudah sebut** menandakan cubaan, **bukan** bukti sebutan tepat; guru boleh menilai |
| Mengeja suku kata | Menyusun huruf menjadi unit Jawi yang betul | Urutan huruf tepat dan paparan Jawi bersambung dengan betul |
| Menulis suku kata | Menyurih dan menulis dengan jari | Surihan diselesaikan; tulisan bebas disimpan sementara untuk murid/guru membandingkan, bukan auto-ditanda tepat |

**Prinsip pedagogi:** (i) audio contoh yang tepat, (ii) ulang kaji berperingkat, (iii) pembetulan mesra kanak-kanak, (iv) dari bantuan kepada kendiri, (v) dapat dipraktikkan dalam PdP guru.

## 3. Identiti visual — lebih ceria, tetapi tidak berserabut

### 3.1 Enam keluarga warna pilihan

Kekalkan *keluarga warna* asal (Cream, Sage Mint, Pastel Blue, Soft Yellow, Peach, Dusty Blue), tetapi naikkan kecerahan dan kejelasan untuk menarik murid. Kod berikut ialah **palet pengeluaran yang dicadangkan**, bukan kewajipan mengganti semua enam warna asal pada setiap elemen.

| Keluarga | Warna asal rujukan | Tona JawiKlik yang lebih ceria | Fungsi visual |
|---|---|---|---|
| **Cream** | `#E9E1D4` | **`#FFF3DB`** | Kanvas latar hangat, panel besar, ruang rehat mata |
| **Sage Mint** | `#A9CFC2` | **`#86DDBA`** | Rumput, daun, butang kejayaan, kawasan Taman Bunyi |
| **Pastel Blue** | `#A9C5E3` | **`#7AC8F5`** | Langit, gelembung audio, panel pembelajaran |
| **Soft Yellow** | `#F4D88F` | **`#FFDB6B`** | Bintang, syiling, peti ganjaran dan sinar kejayaan |
| **Peach** | `#E5AFA9` | **`#FFAD9E`** | Pipi watak, bunga, NPC mesra dan respons positif |
| **Dusty Blue** | `#8D9EB3` | **`#8EA8E8`** | Bayang lembut, garis kedalaman, kawasan misi lanjutan |

**Warna sokongan bukan warna tema ketujuh:** teks utama **deep navy `#283A50`** untuk kontras, putih `#FFFFFF` untuk kad, dan warna bayang lut sinar. Jangan gunakan kuning lembut/peach sebagai warna tulisan kecil di atas cream.

### 3.2 Formula ceria yang kemas

- **50% ruang bernafas:** cream cerah, putih atau latar langit lembut; elakkan blok warna berketepuan tinggi di seluruh skrin.
- **35% dunia berwarna:** rumput mint yang terang, bumbung peach, awan biru muda, bunga kuning dan objek pastel.
- **15% penekanan:** bintang kuning lebih terang, ikon audio biru, pilihan kad bercahaya atau efek kemenangan.
- Gunakan **lapisan bayang dan bevel lembut** pada papan permainan, kad dan objek supaya kelihatan seperti mainan 2.5D.
- Bentuk bulat dan lembut: sudut kad besar, tangan avatar bulat, pokok seperti marshmallow, bunga besar yang mudah dicam pada skrin kecil.
- **Ceria melalui pergerakan, bukan warna semata-mata:** bunga mekar, daun bergoyang, gelembung bunyi melantun, bintang berkilau selama ±0.6–1 saat.
- **Tidak terlalu bayi dan tidak terlalu sarat:** elakkan neon menyilau, glitter berterusan, corak latar yang mengganggu tulisan dan elemen hiasan terlalu kecil.

### 3.3 Arah seni 2.5D

- **Cozy toy-diorama:** pemandangan seakan model miniatur/isometrik ringan, bentuk chibi, warna pastel **yang lebih segar**, kontur bersih dan cahaya pagi hangat.
- Kamera tetap **3/4 atas** atau isometrik ringan; tidak perlu putar bebas seperti game 3D penuh.
- Latar berlapis: lapisan jauh (langit/pokok), lapisan utama (laluan/taman), sprites di hadapan (watak/bunga/kotak surat) menghasilkan kedalaman dan parallax halus.
- Watak: kepala sedikit besar, mata bulat mesra, ekspresi jelas, pakaian sopan; boleh tambah watak lelaki/perempuan dan pelbagai warna pakaian. **Arah watak 3/4 perlu tetap dalam satu sprite sheet** supaya gerakan tidak berubah sudut kamera.
- Semua papan tanda/kad aset visual **kosong**; teks Jawi dirender dalam game, jangan dijana sebagai piksel dalam gambar.
- **Watak hidup:** avatar dan NPC mempunyai animasi daripada sprite sheet PNG sebenar (urutan beberapa frame dalam satu imej), bukan sekadar membesarkan/mengecilkan imej statik. Lihat `JAWIKLIK_SPRITE_GUIDE.md`.

### 3.4 Suasana audio

Bunyi cozy yang pendek, lembut dan tidak bingit: tap kayu lembut, bunga mekar, loceng hadiah ringan, tapak kaki halus. **Audio sebutan Jawi mesti rakaman yang disemak guru**; jangan bergantung pada TTS automatik yang mungkin salah menyebut Jawi. Muzik pilihan sahaja dan boleh dimatikan; elakkan audio berulang kuat.

## 4. UX / teknikal telefon

- **Mobile-first portrait sahaja**. Sasaran asas nisbah 9:16; responsif untuk telefon tinggi/rendah (uji sekurang-kurangnya lebar CSS 320–430 px).
- Jika telefon dipusing, papar mesej ringkas **“Sila tegakkan telefon untuk bermain JawiKlik”**. Jangan bergantung pada orientation lock yang tidak semestinya disokong semua pelayar iPhone.
- Hormati `safe-area-inset-*` (takuk, bar bawah, pelayar); **jangan letak butang utama terlalu hampir ke tepi**.
- Interaksi utama: **tap untuk pergi**, **tap NPC/objek**, **drag kad huruf**, **surih/tulis dengan jari**. Tiada joystick diperlukan pada v0.1.
- Ruang utama: header ringkas 10–12%, dunia 2.5D sekitar 45–55%, panel interaksi bawah 30–40% (fleksibel mengikut skrin dan aktiviti).
- Target sentuhan sekurang-kurangnya sekitar **44 × 44 CSS px**, lebih besar untuk aktiviti murid kecil.
- Animasi disertakan pilihan **kurangkan pergerakan**; elakkan flashing kuat. Butang ulang audio selalu tersedia.
- Jawi: `dir="rtl"`, gaya font yang jelas dan berlesen, sambungan huruf betul, perkataan tidak terpisah apabila disusun; huruf dirender daripada data teks sebenar, bukan dalam PNG. Uji pada Safari iPhone dan Chrome Android.
- Sistem audio mudah alih biasanya memerlukan sentuhan pengguna terlebih dahulu; letak butang “Mula” untuk mengaktifkan audio.
- **Tiada log masuk** untuk v0.1; simpan kemajuan secara setempat pada peranti jika diperlukan. Jangan mengumpul nama penuh atau gambar murid secara lalai.
- Boleh berkembang ke PWA/muat luar talian pada fasa kemudian selepas kestabilan terjamin.
- **Aset dua lapisan:** gambar **asal** disimpan dalam `source-assets/` (jangan terbitkan); salinan yang digunakan game disimpan dalam `public/assets/`. PNG asal boleh terus digunakan dalam `public/assets/` tanpa perlu ditukar ke WebP. Nama sambungan fail mesti sepadan dengan format sebenar.
- **Format:** latar `*.png` adalah sah untuk prototaip; jika mahu `*.webp`, tukar format dengan perisian penukaran sebenar (bukan rename sahaja), kemudian kemas kini laluan kod. Sprite sheet dan watak disaran PNG beralpha.

## 5. Dunia dan watak

**Dunia pembuka:** `Taman Bunyi`. Di tengah ada laluan batu, gerai kad Jawi, pokok bunyi dan pondok kecil; lima lagi kawasan **tidak dibina** dahulu. Semua bangunan sekadar latar sehingga fasa lanjut.

**Watak:**
1. **Avatar Murid:** sprite sheet **idle** dan **walk ke arah kamera (3/4)** sebagai permulaan; dikawal dengan tap lokasi. Empat arah animasi hanya selepas kita mempunyai empat set yang konsisten. Jangan cermin/mirror teks atau atribut asimetri secara membuta tuli.
2. **NPC Guru Jawi:** idle dan bercakap (sprite sheet); memberi arahan ringkas, contoh sebutan dan pujian; ikon bercakap di atas kepala.
3. **NPC Penjaga Taman:** belum wajib dalam v0.1; boleh muncul kemudian setelah misi berjaya.

**Naratif ringkas:** “Bunyi Jawi di taman telah hilang! Tolong sebut, eja dan tulis supaya bunga kembali mekar.” Tiada dialog panjang.

## 6. Lingkaran permainan utama (core loop)

**Teroka 2.5D → sentuh NPC → dengar bunyi → pilih bacaan → susun huruf → surih tulisan → dapat bintang → bunga mekar → aktiviti berikutnya.**

- Kesilapan pertama: “Cuba lagi! Dengar semula, ya.”
- Kesilapan berulang: petunjuk visual/audio, tanpa penalti dan tanpa pemasa yang menekan.
- Selesaikan 4 kemahiran: 1 bintang ganjaran/misi kecil; ganjaran visual segera, bukan pop-up panjang.
- Peringkat suku kata: mulakan kelompok yang disahkan oleh guru (v0.1: **vokal A** disaran), kemudian buka I/U/O/E taling/E pepet secara bertahap.

## 7. Skop projek yang dikawal

### v0.1 — wajib

- Home + butang mula, skrin portrait responsif.
- Satu taman 2.5D boleh ditap, seorang avatar dan seorang NPC. Gunakan **animasi PNG sprite sheet** untuk avatar idle/walk dan NPC idle/talk jika fail sudah sedia; sementara aset belum lengkap, imej statik boleh dijadikan fallback tanpa mengubah struktur game.
- Satu aliran misi lengkap dengan **4 aktiviti**: dengar/sebut, baca, eja, surih.
- Audio contoh boleh ulang; maksimum 4–6 sampel yang **sudah disahkan**, bukan terus masukkan bank penuh.
- Maklum balas visual, bintang dan tamat misi.
- Reka bentuk Jawi bersambung/RTL, prestasi asas telefon diuji.
- Sprite sheet dipecahkan mengikut grid yang **disahkan sebenar** (contoh 4 kolum × 2 baris / 8 frame), dengan skala, kaki, kamera dan pivot yang konsisten; animasi tidak boleh tersasar atau terpotong.

### v0.2–v0.4 — kemudian

- Tambah 12 suku kata dan vokal lain **selepas audit ejaan/bunyi**, latihan menulis bebas, tahap kesukaran, kemajuan setempat, hiasan taman.
- Tambah animasi `point`, `writing`, `happy` dan arah berjalan tambahan hanya setelah idle/walk/talk stabil.
- Mod Guru untuk memilih set latihan dan menilai bacaan/tulisan; hanya jika perlu untuk PdP.

### Bukan v0.1

- 3D penuh / kamera boleh pusing, akaun murid, leaderboard awam, mikrofon dengan auto-markah, AI semak tulisan bebas, pembelian, banyak kawasan, sistem kedai rumit.

## 8. Kriteria siap v0.1

- Dibuka pada iPhone dan Android dalam posisi **tegak**, UI tidak terpotong atau perlu zum.
- Tap atas **laluan pendek yang sepadan dengan sudut watak 3/4** menggerakkan avatar; tap NPC membuka misi. Arah pergerakan bebas/4 arah kemudian apabila set sprite sheet lengkap.
- Semua huruf Jawi sambung dan RTL betul, termasuk apabila huruf diseret ke slot.
- Audio keluar **selepas interaksi mula**, berfungsi untuk ulang bunyi.
- Murid dapat menyelesaikan misi dengar/sebut, baca, eja, surih tanpa bantuan papan kekunci.
- Jejak surihan dibersihkan/reset dengan mudah; tulisan bebas **tidak diiktiraf secara automatik** pada fasa ini.
- Prestasi cukup lancar pada telefon pertengahan; semua aset dimampatkan dan butang sentuhan besar.
- Sprite sheet sebenar kelihatan bergerak lancar, tiada frame berganda, kaki melompat, badan berubah saiz atau latar kotak putih.
- `source-assets/` **tidak** dimasukkan ke dalam folder binaan penerbitan (`dist/`).

## 9. Arahan asas ringkas untuk Claude Code (selepas brief dimuktamadkan)

> **BM:** Baca `JAWIKLIK_MASTER_BRIEF.md`, `JAWIKLIK_GAME_FLOW.md`, `JAWIKLIK_ASSET_LIST.md` dan `JAWIKLIK_SPRITE_GUIDE.md`. Bina **v0.1 sahaja** menggunakan Phaser 3 + HTML/CSS responsif, portrait-only, satu Taman Bunyi 2.5D, tap-to-move, satu NPC dan satu aliran misi dengar/baca/eja/surih. Pastikan teks Jawi RTL dan bersambung, guna aset sedia ada bila dibekalkan, termasuk animasi sprite sheet yang telah disemak. Jangan tambah fungsi lain.
>
> 
> **EN:** Read the four JawiKlik planning files. Build **v0.1 only** with Phaser 3 and responsive HTML/CSS: portrait-first 2.5D Sound Garden, tap-to-move, one NPC, and a listen/read/spell/trace mission. Preserve correct RTL connected Jawi rendering. Use provided assets and verified sprite sheet frames where available. Keep source-assets out of production. Do not add unrelated features.


## 10. Keputusan pengurusan aset (v2)

1. **Simpan PNG asal:** setiap gambar terjana dimasukkan ke `source-assets/` mengikut jenis; ini ialah sandaran kualiti penuh.
2. **Salin aset yang dipilih ke game:** hanya imej yang benar-benar digunakan diletakkan di `public/assets/`; tidak perlu memproses semua sumber.
3. **Jangan samakan format dengan nama:** `bg_title_portrait.png` sah dan boleh terus dimuatkan. Jika ditukar menjadi WebP sebenar, gunakan `bg_title_portrait.webp` dan ubah rujukan kod.
4. **Satu animasi, satu fail PNG sprite sheet:** contoh `avatar_idle.png` dan `avatar_walk_side.png`. Gunakan gambar watak asal sebagai rujukan supaya pakaian, muka, kamera dan saiz tidak berubah.
5. **Peringkat animasi:** dahulukan avatar idle + walk dan NPC guru idle + talk. Animasi menunjuk dan menulis ialah tambahan, bukan syarat memulakan pembangunan.
6. **Semak secara visual dahulu:** output AI tidak dijamin mempunyai 8 frame tepat; potong/kemas semula jika perlu sebelum Claude memasukkannya ke game.

**Nota kunci untuk Claude:** Rujuk `JAWIKLIK_SPRITE_GUIDE.md` untuk struktur grid, bingkai, animasi, dan kekangan imej AI.
