# JawiKlik — PANDUAN SPRITE SHEET & PROMPT ANIMASI

**Versi:** 2.0 (untuk aset animasi 2.5D telefon portrait)  
**Tujuan:** Sediakan siri gambar watak yang boleh digunakan oleh Claude Code untuk memainkan animasi sebenar dalam Phaser 3.

## 1. Perbezaan aset

- **Gambar watak asal (character reference):** satu watak penuh statik, contoh `char_player_idle.png`. Jana ini dahulu dan kekalkan sebagai rujukan untuk semua pose.
- **Sprite sheet:** satu PNG mengandungi beberapa frame satu aksi dalam grid tepat; contoh 8 frame (4 kolum × 2 baris).
- **Animasi dalam game:** kod memotong sprite sheet kepada frame dan memaparkan satu frame pada satu masa mengikut kelajuan tertentu. Sekadar meletakkan seluruh sprite sheet sebagai satu gambar tidak akan menghasilkan gerakan.

## 2. Spesifikasi penting untuk penjana imej

1. Gunakan **gambar rujukan watak yang sama** pada setiap prompt dan jangan ubah pakaian, wajah, aksesori, sudut kamera atau nisbah tubuh.
2. Satu fail PNG = **satu aksi**. Gunakan **8 frame** dengan grid **4 kolum × 2 baris**; baca dari kiri ke kanan, kemudian baris kedua.
3. **Setiap cell sama saiz** dengan posisi badan dan pivot kaki konsisten; jangan crop anggota, jangan tambah sel ekstra.
4. Semua bahagian luar watak ialah **transparent alpha sebenar**, bukan latar kotak-kotak palsu. Tiada tulisan, grid kelihatan, nombor, prop tambahan atau teks Jawi dalam imej.
5. Gerakan `walk_side` ialah avatar berjalan ke sisi (menghadap kiri) dalam sudut 3/4. **Jangan minta 4 arah dalam satu sheet**; buat fail berasingan jika empat arah diperlukan kelak.
6. AI mungkin menghasilkan frame tidak tepat, tangan tambahan atau saiz berbeza; **semak sebelum guna**. Jika hanya sesuai sebagai pose reference, bersihkan/potong frame secara manual atau jana semula.
7. Cadangan jika boleh kawal saiz: 2048×1024 px (8 sel 512×512), atau apa-apa saiz yang tepat dibahagi 4 secara mendatar dan 2 secara menegak. Untuk game mobil, optimakan resolusi setelah diuji.

## 3. Fail animasi yang disyorkan

| Fail | Siapa / aksi | Masa disediakan |
|---|---|---|
| `avatar/avatar_walk_side.png` | Avatar melangkah ke sisi (menghadap kiri, 3/4) | v0.1 |
| `avatar/avatar_idle.png` | Avatar menunggu, bernafas, berkelip | v0.1 |
| `guru-jawi/guru_talk.png` | Guru bercakap | v0.1 |
| `guru-jawi/guru_idle.png` | Guru menunggu | v0.1 |
| `guru-jawi/guru_point.png` | Guru menunjuk ke ruang kad kosong | Sedia (tambahan) |
| `avatar/avatar_writing.png` | Avatar gerakan menulis/menunjuk di udara | Sedia (tambahan) |

**Lokasi:** simpan PNG asal pada `source-assets/spritesheets/{avatar|guru-jawi}/` dan salin yang telah disemak ke `public/assets/spritesheets/{avatar|guru-jawi}/`.

## 4. Prompt induk (salin bersama setiap prompt aksi)

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Rounded chibi proportions, clean silhouettes, friendly expressive eyes, playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle #8EA8E8. Gentle morning sunlight and soft toy-like volume. Use the ATTACHED character reference as the exact identity guide: preserve face, hairstyle or hijab, clothing, colors, accessories, scale and fixed 3/4 camera angle. Production-ready ONE ACTION sprite sheet, 8 equally sized sequential frames on a precise 4-column × 2-row grid. Reading order: left-to-right, top-to-bottom. Character fully visible and centered within each cell, feet aligned to the same baseline, true transparent alpha background. No visible grid lines, no captions, no numerals, no watermarks, no fake transparency, no letters or Jawi text, no background scenery.
```

**Setiap blok prompt aksi A–F di bawah sudah lengkap untuk terus disalin** (prompt induk telah digabungkan). Sertakan imej watak asal sebagai rujukan. Jika sistem menjana 8 pose yang belum bersambung secara natural, semak dan kemaskan dahulu.

### A. `avatar_walk_side.png` — Avatar berjalan

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.

Create one walk-cycle sprite sheet for the SAME player avatar in a consistent three-quarter view, slightly facing the viewer. Eight distinct sequential frames: left step, passing position, weight shift, neutral crossover, right step, passing position, weight shift, recovery to loop. Natural alternating arm swings and gentle head bounce. Keep both feet grounded relative to a fixed baseline, maintaining the same full-body size and outfit in every cell. First and last frame must transition smoothly into a repeating walking cycle.
```

### B. `avatar_idle.png` — Avatar idle

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.

Create one seamless eight-frame IDLE cycle for the SAME player avatar, standing in place in the exact three-quarter view. Gentle breathing, tiny shoulder movement, one natural blink, and slight head movement. Feet must remain anchored; do not add any step or change of camera, clothes or body scale. Make the loop calm and lively.
```

### C. `guru_talk.png` — Guru bercakap

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.

Create one eight-frame TALKING animation for the SAME Jawi teacher NPC. Friendly teacher explains something with natural opening and closing mouth, subtle blinking, small relaxed hand movement and gentle nods. Standing in place in a fixed three-quarter view, feet anchored. Make this animation repeat smoothly while recorded Malaysian Malay voice audio plays. Do not draw words, speech bubbles or flashcards.
```

### D. `guru_idle.png` — Guru menunggu

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.

Create one eight-frame IDLE animation for the SAME Jawi teacher NPC, standing in the same fixed three-quarter view. Gentle breathing, calm blink, tiny head tilt, warm welcoming smile. Keep feet anchored, consistent posture and exact clothing. Seamless loop, no waving, no props, no background.
```

### E. `guru_point.png` — Guru menunjuk (kemudian)

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.

Create one eight-frame teacher PRESENTING gesture cycle: starts with relaxed hands, gently raises one hand to point toward an imagined empty teaching card beside the character, holds the gesture briefly, then returns to neutral. Same fixed three-quarter view and anchored feet. Do NOT include a card or any writing; real Jawi text will be rendered through game code.
```

### F. `avatar_writing.png` — Avatar menulis (kemudian)

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.

Create one eight-frame AIR-WRITING gesture sequence for the SAME player avatar. The student gently raises one hand and makes a small right-to-left writing motion in the air, pauses, then lowers the hand naturally. Fixed three-quarter view, feet anchored and same character proportions. No pen, writing board or letters. This is a decorative character animation only; the actual finger-writing activity uses a separate drawing canvas in the game.
```

## 5. Semakan sebelum Claude Code

- [ ] Bilangan tepat 8 frame, 4 kolum × 2 baris (atau grid sebenar didokumenkan jika berbeza).
- [ ] Lebar dan tinggi fail boleh dibahagikan dengan bilangan kolum/baris tanpa baki.
- [ ] Setiap frame lengkap; tiada rambut, kasut, tudung atau tangan terpotong.
- [ ] Sama wajah, pakaian, skala dan sudut; kaki di baseline konsisten.
- [ ] Latar benar-benar transparent alpha; tiada checkerboard palsu.
- [ ] Urutan frame masuk akal, loop tidak melompat ketika kembali ke awal.
- [ ] PNG asal selamat dalam `source-assets/` dan salinan lulus dalam `public/assets/`.

## 6. Arahan Claude Code (BM + English, ringkas)

```text
BM: Baca JAWIKLIK_SPRITE_GUIDE.md. Gunakan sprite sheet yang telah disemak daripada public/assets/spritesheets/. Setiap fail mempunyai 8 frame pada grid 4 kolum × 2 baris; saiz frame = lebar imej / 4 dan tinggi imej / 2. Potong frame mengikut urutan kiri→kanan, atas→bawah. Avatar: idle ketika berhenti, walk_side ketika bergerak (flipX untuk arah kanan); NPC Guru: idle ketika menunggu, talk ketika dialog/audio. Jaga pivot kaki, kedudukan konsisten dan prestasi telefon portrait. Jika sheet tidak sah, guna PNG statik sementara dan laporkan masalah. Jangan ubah fungsi lain.

EN: Follow JAWIKLIK_SPRITE_GUIDE.md. Use verified 8-frame 4x2 PNG sprite sheets from public/assets/spritesheets/. Frame size equals image width/4 by height/2, ordered left-to-right then top-to-bottom. Avatar: idle/stationary and walk_side/moving (flipX when moving right); Teacher: idle/waiting and talk/speaking. Anchor feet consistently and optimize for portrait mobile. Fall back to static PNG if the sheet is invalid and report the issue. Do not alter unrelated features.
```

**Nota teknikal:** Sebelum memotong, baca dimensi sebenar fail dan pastikan grid ialah benar-benar 4×2. Jika ada margin luar atau ruang antara frame, pembahagian mudah akan salah; kemaskan ke grid seragam dahulu. Cadangan kelajuan: idle sekitar 5–7 fps, walk 8–12 fps, talk 6–9 fps; laraskan mengikut kualiti frame sebenar.

## 7. Sprite sheet yang telah disahkan (untuk Claude Code)

Semua sheet dalam `public/assets/spritesheets/` telah disusun semula ke grid 4×2 tepat dengan kaki pada garis yang sama. **Baca `public/assets/spritesheets.json`** untuk `frameWidth`, `frameHeight`, `originX`/`originY` (titik kaki), `fps` dan `loop` bagi setiap animasi; jangan teka saiz frame.

| Kunci animasi | Watak | Loop | Kegunaan |
|---|---|---|---|
| `avatar_idle` | Avatar | Ya | Berdiri / menunggu |
| `avatar_walk_side` | Avatar | Ya | Bergerak; sprite menghadap kiri, guna `flipX` bila bergerak ke kanan |
| `avatar_writing` | Avatar | Tidak | Main sekali bila papan surih dibuka atau kad betul dipilih, kemudian kembali ke `avatar_idle` |
| `guru_idle` | Guru Jawi | Ya | Menunggu |
| `guru_talk` | Guru Jawi | Ya | Semasa dialog/audio |
| `guru_point` | Guru Jawi | Tidak | Menunjuk kad (selepas asas stabil) |

Semua sheet bagi watak yang sama berkongsi saiz frame dan titik kaki yang sama, jadi animasi boleh ditukar tanpa watak melompat atau berubah saiz.
