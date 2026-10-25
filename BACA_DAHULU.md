# JawiKlik — Pakej Perancangan v2

Pakej ini **menggantikan dokumen v1 untuk perancangan seterusnya**, tanpa mengubah objektif asas membaca, membunyikan, mengeja dan menulis suku kata tertutup.

## Perubahan penting daripada v1

1. **Gambar asal disimpan berasingan:** `source-assets/` untuk PNG asal; `public/assets/` untuk gambar yang dipakai oleh game.
2. **PNG boleh digunakan terus:** latar `.png` tidak perlu dipaksa `.webp`. WebP pilihan selepas penukaran format sebenar, bukan tukar nama.
3. **Sprite sheet rasmi:** gambar sequence disediakan sebagai fail PNG berasingan bagi setiap aksi. Panduan lengkap dan prompt tersedia dalam `docs/JAWIKLIK_SPRITE_GUIDE.md`.
4. **Animasi berfasa:** v0.1 utamakan avatar idle/walk dan guru idle/talk. Point/writing dan NPC lain selepas asas stabil.
5. **Pembinaan kekal terkawal:** satu Taman Bunyi, satu aliran misi, empat kemahiran.
6. **Enam warna tetap:** Cream `#FFF3DB`, Mint `#86DDBA`, Sky Blue `#7AC8F5`, Yellow `#FFDB6B`, Peach `#FFAD9E`, Dreamy Blue `#8EA8E8`.

## Urutan kerja yang dicadangkan

1. Jana latar Taman Bunyi, satu avatar statik dan satu NPC Guru statik. Simpan fail asal dalam `source-assets/`.
2. Guna watak asal sebagai rujukan untuk jana sprite sheet avatar (idle/walk) dan guru (idle/talk).
3. Semak dimensi/grid/ketelusan setiap sheet. Salin aset yang lulus ke `public/assets/`.
4. Berikan keempat-empat dokumen dalam `docs/` kepada Claude Code. Bina prototaip portrait v0.1 sahaja.
5. Selepas interaksi dan animasi lancar, tambah aksi lain, bank suku kata dan objek.

**Peringatan:** `source-assets/` ialah sandaran gambar asal dan **tidak** diterbitkan bersama game.

## Status aset semasa (dikemas kini)

Semua gambar asal disimpan **tanpa diubah** dalam `source-assets/` (nama fail asal). Salinan yang telah dibaiki untuk game berada dalam `public/assets/`.

| Fail game (`public/assets/`) | Sumber asal (`source-assets/`) | Status | Pembaikan |
|---|---|---|---|
| `backgrounds/bg_sound_garden.png` | `backgrounds/bg_sound_garden.png` | ✅ Sedia | Tiada; dataran bulat di tengah untuk Guru Jawi |
| `backgrounds/bg_title_portrait.png` | `backgrounds/bg_title_portrait.png` | ✅ Sedia | Tiada; langit lapang untuk logo |
| `characters/char_player_idle.png` | `characters/avatar_original.png` | ✅ Sedia | Dinamakan semula ikut dokumen, ruang kosong dipotong |
| `characters/char_npc_teacher.png` | `characters/guru_original.png` | ✅ Sedia | Dinamakan semula ikut dokumen, ruang kosong dipotong |
| `spritesheets/avatar/avatar_idle.png` | `spritesheets/avatar/avatar_idle.png` | ✅ Sedia | Grid 1254px (tidak boleh dibahagi 4) disusun semula ke grid tepat |
| `spritesheets/avatar/avatar_walk_side.png` | `spritesheets/avatar/avatar_walk.png` | ✅ Sedia | Kaki baris atas/bawah berbeza ~26px diselaraskan; dinamakan `walk_side` kerana avatar berjalan ke sisi |
| `spritesheets/avatar/avatar_writing.png` | `spritesheets/avatar/avatar_writing.png` | ✅ Sedia | Kaki diselaraskan (beza ~7px) |
| `spritesheets/guru-jawi/guru_idle.png` | `spritesheets/guru-jawi/guru_idle.png` | ✅ Sedia | Baris atas/bawah bertindih dipisahkan |
| `spritesheets/guru-jawi/guru_talk.png` | `spritesheets/guru-jawi/guru_talk.png` | ✅ Sedia | Tangan yang terkeluar ke petak sebelah dipulihkan; main perlahan (4 fps) |
| `spritesheets/guru-jawi/guru_point.png` | `spritesheets/guru-jawi/guru_point.png` | ✅ Sedia | Baris bertindih dan tangan terkeluar dipisahkan |

Semua sprite sheet kini: **8 frame, grid 4×2 tepat**, kaki pada garis yang sama dalam setiap frame, saiz watak seragam antara sheet bagi watak yang sama. Ukuran frame, titik pangsi (origin), fps dan loop bagi setiap sheet tercatat dalam `public/assets/spritesheets.json`.

**Belum ada:** audio sebutan (`public/audio/voice/`) dan efek bunyi (`public/audio/sfx/`).

**Nota gaya:** avatar bergaya lukisan 2D lembut manakala Guru Jawi bergaya render 3D. Diterima untuk v0.1.

**Jana sprite baharu?** Letak PNG asal dalam `source-assets/spritesheets/...`, tambah dalam `tools/sprites/spec.json`, kemudian jalankan:

```bash
python3 tools/sprites/repack.py tools/sprites/spec.json source-assets/spritesheets public/assets/spritesheets
```

(Perlu `pip install numpy scipy pillow`.)

## Prototaip v0.1 (sudah dibina)

Aliran: **Mula → Taman Bunyi → sentuh Guru Jawi → Dengar & Sebut → Baca & Pilih → Eja (seret/sentuh huruf) → Surih → bintang + bunga mekar**. Empat suku kata (بس، جم، چت، ݢم) = empat misi = empat bunga.

### Cara jalankan

```bash
npm install
npm run dev       # buka alamat yang dipaparkan pada telefon (rangkaian Wi-Fi yang sama)
npm run build     # hasil siap terbit dalam dist/ (source-assets/ tidak termasuk)
```

### Rakaman suara (paling penting seterusnya)

Rakam suara Ustazah sendiri, satu fail pendek bagi setiap suku kata, simpan sebagai MP3 dengan nama tepat:

| Fail | Sebutan |
|---|---|
| `public/audio/voice/a_bas.mp3` | bas |
| `public/audio/voice/a_jam.mp3` | jam |
| `public/audio/voice/a_cat.mp3` | cat |
| `public/audio/voice/a_gam.mp3` | gam |

Tiada perubahan kod diperlukan. Selagi fail belum ada, game memaparkan “Rakaman suara belum ada. Minta guru sebut … dahulu.” dan menunjukkan ejaan Rumi sebagai bantuan. Efek bunyi (`public/audio/sfx/`) juga pilihan; tanpanya game menggunakan bunyi lembut yang dijana sendiri.

### Keputusan dalam v0.1

- **Pilih avatar** dilangkau kerana hanya satu avatar tersedia.
- Avatar berjalan pada dataran dan laluan sahaja; tap pada rumput/air diabaikan. Sentuh **Pokok Bunyi** untuk not muzik.
- **Saya sudah sebut** hanya penanda cubaan; bintang diberi selepas keempat-empat aktiviti siap.
- **Baca:** dua kali salah → ejaan Rumi dan kad betul bercahaya.
- **Eja:** huruf boleh diseret ke slot atau disentuh (masuk ke slot kosong seterusnya, dari kanan). Satu huruf pengecoh ditambah.
- **Surih:** dikira siap apabila ~70% bentuk huruf disurih dan conteng di luar huruf tidak berlebihan. Bukan pengecaman tulisan.
- Kemajuan (bintang, bunga) disimpan dalam peranti sahaja. Tetapan ⚙: kurangkan pergerakan, mula semula kemajuan.
- Kandungan suku kata dalam `src/data/syllables.js`; **perlu disemak guru**.
