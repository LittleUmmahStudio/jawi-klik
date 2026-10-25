# JawiKlik — ART DIRECTION & ASSET LIST

**Versi:** 2.0  
**Tujuan:** Senarai aset yang boleh dijana sendiri sebelum dimasukkan ke Claude Code.  
**Tema:** Cozy 2.5D toy-diorama • ceria • pastel segar • comel • kemas • mobile portrait.

---

## 1. Rahsia gaya ceria JawiKlik

Bayangkan **taman mainan mini pada pagi yang cerah**: rumput mint kelihatan segar, langit biru manis, bunga kuning bersinar, batu laluan peach/cream dan bayang ungu-biru yang lembut. Bentuk *rounded*, bersih, sedikit bervolum; bukan flat vector kosong dan bukan 3D realistik.

- **Enam warna identiti:** Cream `#FFF3DB`, Mint `#86DDBA`, Sky Blue `#7AC8F5`, Yellow `#FFDB6B`, Peach `#FFAD9E`, Dusty Blue `#8EA8E8`.
- **Teks / kontras:** Navy `#283A50` dan putih neutral; elakkan tulisan berwarna lembut pada latar terang.
- **Bentuk:** rounded, chibi, squishy, toy-like, 3/4 isometric perspective, soft beveled edges.
- **Pencahayaan:** warm morning sunshine, airy shadows, pastel saturated-but-gentle, subtle ambient occlusion.
- **Rasa:** magical kecil-kecilan: bintang sekali-sekala, bunga bereaksi, awan dan daun bergerak perlahan; jangan glitter berterusan.
- **Larangan visual:** fotorealistik, gaya dewasa gelap, neon pekat, terlalu banyak objek kecil, latar berserabut, tulisan palsu, pseudo-Jawi, watermarks, checkerboard palsu.

### Palet fungsi

| Warna | Peranan |
|---|---|
| Cream | Background / UI besar agar tulisan mudah dibaca |
| Mint | Alam semula jadi, arah ‘aktif’, butang berjaya |
| Sky Blue | Ikon audio dan bantuan / maklumat pembelajaran |
| Yellow | Hadiah dan fokus misi selesai |
| Peach | NPC, bunga, emosi/pujian |
| Dusty Blue | Kedalaman, bayang, elemen magis lembut |

## 2. Aset minimum **v0.1 sahaja** — jana ikut urutan

**Keutamaan A: diperlukan untuk prototaip visual pertama**

| No. | Nama fail cadangan | Aset | Format | Kanvas cadangan | Nota |
|---|---|---|---|---|---|
| 01 | `bg_title_portrait.png` | Latar menu menegak taman mini | PNG asal; WebP selepas tukar format jika mahu | 1080×1920 | Kosong pada tengah/atas untuk logo overlay; tiada teks |
| 02 | `bg_sound_garden.png` | Latar dunia Taman Bunyi | PNG asal; WebP selepas tukar format jika mahu | 1080×1920 | Laluan jelas, ruang avatar/NPC, tidak terlalu banyak props |
| 03 | `char_player_idle.png` | Avatar chibi neutral | PNG alpha | 1024×1024 | Satu watak full-body, sudut 3/4, ruang tepi |
| 04 | `char_npc_teacher.png` | NPC Guru Jawi | PNG alpha | 1024×1024 | Watak mesra, sopan, tanpa teks/belakang |
| 05 | `obj_sound_tree.png` | Pokok Bunyi interaktif | PNG alpha | 1024×1024 | Bentuk topi daun mint, simbol tempat audio tanpa tulisan |
| 06 | `obj_word_board_blank.png` | Papan kosong untuk latihan | PNG alpha | 1024×1024 | Bahagian tengah benar-benar kosong untuk teks Jawi kod |
| 07 | `ui_answer_card_blank.png` | Kad jawapan besar | PNG alpha / CSS | 768×768 | Elak hiasan di ruang tulisan |
| 08 | `ui_primary_button_blank.png` | Butang utama kosong | PNG alpha / CSS | 1024×512 | Tiada perkataan dilukis pada aset |

**Keutamaan B: tambah selepas interaksi asas berfungsi**

| No. | Nama fail cadangan | Aset | Format | Kanvas cadangan | Nota |
|---|---|---|---|---|---|
| 09 | `obj_flower_closed.png` | Bunga belum mekar | PNG alpha | 768×768 | Posisi sama dengan versi mekar |
| 10 | `obj_flower_open.png` | Bunga mekar | PNG alpha | 768×768 | Boleh crossfade/scale dengan kod |
| 11 | `obj_star_reward.png` | Bintang ganjaran | PNG alpha | 512×512 | Bentuk jelas pada saiz kecil |
| 12 | `fx_sparkle.png` | Kilauan lembut | PNG alpha | 512×512 | Hiasan seketika selepas jawapan betul |
| 13 | `ui_speech_bubble_blank.png` | Gelembung dialog | PNG alpha / CSS | 1024×512 | Ruang teks yang lapang |
| 14 | `ui_audio_icon.png` | Ikon audio besar | PNG alpha / SVG | 512×512 | Boleh ganti ikon kod untuk kekal tajam |

**Nota praktikal:** Banyak kad, butang dan bingkai lebih bagus dibuat terus melalui CSS/SVG supaya tajam pada semua telefon. Gambar yang patut dijana ialah **latar, watak dan objek khas**, bukannya setiap ikon asas. Untuk v0.1, fokus **dua animasi avatar (idle/walk)** dan **dua animasi NPC Guru (idle/talk)** jika sprite sheet berkualiti sudah tersedia. PNG statik ialah fallback sementara. **Jangan jana puluhan pose** dahulu. Lihat `JAWIKLIK_SPRITE_GUIDE.md`.

### Keutamaan animasi (satu imej PNG bagi satu aksi)

| Aksi | Nama fail dalam `public/assets/spritesheets/` | Status |
|---|---|---|
| Avatar berjalan ke sisi (menghadap kiri, sudut 3/4) | `avatar/avatar_walk_side.png` | Utama v0.1 |
| Avatar menunggu / bernafas / kelip mata | `avatar/avatar_idle.png` | Utama v0.1 |
| Guru Jawi bercakap / menunjuk mulut | `guru-jawi/guru_talk.png` | Utama v0.1 |
| Guru Jawi menunggu | `guru-jawi/guru_idle.png` | Utama v0.1 |
| Guru Jawi menunjuk kad | `guru-jawi/guru_point.png` | Sedia (tambahan) |
| Avatar membuat gerak menulis/menunjuk | `avatar/avatar_writing.png` | Sedia (main sekali, bukan pengganti kanvas finger-write) |

**Nota:** Aksi `walk_side` ialah avatar berjalan ke sisi (menghadap kiri) dalam sudut 3/4; untuk bergerak ke kanan, kod mencerminkan (flipX) sprite. Jangan namakan animasi untuk arah lain sebelum pose arah itu benar-benar dijana. Avatar tidak perlu semua arah bergerak pada prototaip pertama. Output AI hanyalah calon sprite sheet sehingga dimensi, grid dan setiap frame disahkan.

## 3. Bunyi / sebutan

| Fail | Jenis | Fungsi |
|---|---|---|
| `audio/voice/a_bas.mp3` | Rakaman guru | Sebutan bas |
| `audio/voice/a_jam.mp3` | Rakaman guru | Sebutan jam |
| `audio/voice/a_cat.mp3` | Rakaman guru | Sebutan cat |
| `audio/voice/a_gam.mp3` | Rakaman guru | Sebutan gam |
| `audio/sfx/tap_soft.mp3` | Efek lembut | Sentuhan kad/objek |
| `audio/sfx/success_chime.mp3` | Efek lembut | Jawapan tepat |
| `audio/sfx/flower_bloom.mp3` | Efek lembut | Bunga mekar |

Audio hendaklah pendek, jelas, sebutan **Bahasa Melayu Malaysia**, dinormal aras bunyi agar tidak mengejutkan murid. Penggunaan rakaman suara guru sendiri paling sesuai untuk sebutan suku kata. Tidak perlu muzik dalam versi pertama.

## 4. Prompt asas untuk kekalkan gaya konsisten

**Identiti gaya wajib (sudah digabungkan dalam setiap prompt di bawah):**

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.
```

### A. Latar menu — `bg_title_portrait.png` (format sumber)

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.

A portrait 9:16 magical miniature learning garden with a gentle winding path, round candy-like trees, blooming flowers, one small cozy cottage and floating light particles. Airy sky and clear visual breathing room in the central upper area for an app logo to be added in code. Layered landscape depth, balanced composition, phone-friendly, not crowded. Full background scene; no transparency. Do not include any logo or text.
```

### B. Taman Bunyi — `bg_sound_garden.png` (format sumber)

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.

A portrait 9:16 interactive sound garden for a cozy 2.5D educational game. Three-quarter overhead/isometric-feeling perspective; broad walkable winding path, a clear open central plaza for a player character and teacher NPC to be overlaid later, rounded mint trees, a sound-themed tree, soft blue sky details, several large cheerful flowers. Keep interaction spaces open and clear; cohesive scale and perspective. Full environment background, no characters, no signs with words, no text. Make it visually fun but not busy.
```

### C. Watak utama — `char_player_idle.png`

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.

ONE isolated full-body Malaysian primary-school-age chibi adventurer character, friendly round eyes, subtle cheek blush, modest colorful outfit with cream, sky-blue and peach accents, small shoes, soft toy-like volume, clear readable silhouette, standing idle at a slight 3/4 view matching a 2.5D isometric game. Arms relaxed, whole body visible, centered. TRUE alpha transparent background. No floor, no text, no props, no scene.
```

### D. NPC Guru Jawi — `char_npc_teacher.png`

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.

ONE isolated friendly Malaysian primary school Jawi teacher NPC, cute warm chibi style, modest professional outfit, welcoming expression, small wave, 3/4 view consistent with the player asset, rounded toy-like forms, legible silhouette. TRUE alpha transparent background, centered full-body only, no signage, no letters, no room, no text.
```

### E. Pokok Bunyi — `obj_sound_tree.png`

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.

ONE isolated enchanted sound tree prop for a mobile 2.5D learning garden: rounded mint foliage, pastel-blue glowing circular sound ornament integrated in the trunk (no glyphs or symbols), a few sunshine-yellow accents, peach blossoms, soft small toy-like volume. Three-quarter isometric perspective, centered, visible silhouette. TRUE alpha transparent background, no text, no floor or other objects.
```

### F. Papan latihan — `obj_word_board_blank.png`

```text
JawiKlik mobile educational game art direction. Cheerful cozy 2.5D toy-diorama aesthetic for Malaysian primary school children. Soft 3/4 isometric perspective, chunky rounded shapes, delightful chibi proportions, clean silhouettes, fresh playful pastel palette: warm cream #FFF3DB, lively mint #86DDBA, bright sky blue #7AC8F5, sunshine yellow #FFDB6B, sweet peach #FFAD9E, dreamy periwinkle dusty blue #8EA8E8. Gentle morning sunlight, soft ambient shadows, subtle toy-like depth, polished premium casual-game illustration. Cute and inviting but uncluttered, readable at small phone screen size. No lettering, no numerals, no watermarks, no fake Jawi symbols, no screenshot or UI mockup.

ONE isolated child-friendly blank wooden learning board on a small rounded stand, cream blank writing surface with soft mint frame, tiny peach and yellow corner decorations, 3/4 toy-like isometric perspective. The central writing surface must remain completely EMPTY for real Jawi text to be rendered by code. TRUE alpha transparent background. No letters, numbers, symbols or fake text.
```

**Semua prompt A–F sudah lengkap dan boleh terus disalin** tanpa menampal prompt induk secara berasingan. Gunakan aset watak yang sama sebagai rujukan untuk animasi sprite sheet.

## 5. Cara susun folder aset (v2 — sumber vs game)

```text
JawiKlik/
├── docs/
│   ├── JAWIKLIK_MASTER_BRIEF.md
│   ├── JAWIKLIK_GAME_FLOW.md
│   ├── JAWIKLIK_ASSET_LIST.md
│   └── JAWIKLIK_SPRITE_GUIDE.md
├── source-assets/                     # SIMPAN GAMBAR ASAL; tidak diterbitkan
│   ├── backgrounds/
│   │   ├── bg_title_portrait.png
│   │   └── bg_sound_garden.png
│   ├── characters/
│   │   ├── char_player_idle.png
│   │   └── char_npc_teacher.png
│   ├── spritesheets/
│   │   ├── avatar/
│   │   └── guru-jawi/
│   ├── objects/
│   └── ui/
├── public/
│   ├── assets/                         # HANYA aset yang digunakan dalam game
│   │   ├── backgrounds/
│   │   │   ├── bg_title_portrait.png   # atau .webp jika ditukar dengan betul
│   │   │   └── bg_sound_garden.png
│   │   ├── characters/
│   │   │   ├── char_player_idle.png    # fallback gambar statik
│   │   │   └── char_npc_teacher.png
│   │   ├── spritesheets/
│   │   │   ├── avatar/
│   │   │   │   ├── avatar_idle.png
│   │   │   │   ├── avatar_walk_side.png
│   │   │   │   └── avatar_writing.png
│   │   │   └── guru-jawi/
│   │   │       ├── guru_idle.png
│   │   │       ├── guru_talk.png
│   │   │       └── guru_point.png
│   │   ├── objects/
│   │   ├── ui/
│   │   └── fx/
│   └── audio/
│       ├── voice/
│       └── sfx/
└── src/                                # Kod permainan Claude bina kemudian
```

**Cara kerja ringkas:** Jana imej → simpan PNG asal di `source-assets/` → semak ketelusan, saiz dan kejelasan → **salin** aset yang diluluskan ke `public/assets/` → Claude rujuk laluan sebenar. Jika tiada penukaran format, kedua-dua salinan boleh berformat `.png`. **Jangan tukar sambungan `.png` kepada `.webp` tanpa menukar format kandungannya.** Untuk WebP, tukar fail sebenar dahulu lalu ubah semua laluan berkaitan dalam kod.

Folder `source-assets/` mesti dikecualikan daripada hasil terbitan/game production. Fail sumber tidak perlu diletakkan di dalam `public/`.

## 6. Semak setiap imej sebelum disimpan

- [ ] Mematuhi **enam warna JawiKlik**; ceria tetapi tidak neon/menyilau.
- [ ] Sudut perspektif dan skala konsisten antara semua objek.
- [ ] Latar dunia ada **ruang boleh dilalui** dan tempat NPC; bukan sekadar poster cantik.
- [ ] Watak/objek PNG mempunyai **alpha transparency sebenar**, tiada kotak putih atau corak checkerboard yang dicetak.
- [ ] Tiada tulisan atau simbol yang dijana secara rawak. **Jawi, arahan dan label mesti teks kod.**
- [ ] Subjek utama jelas jika dilihat pada saiz telefon, bukan hanya apabila dizum.
- [ ] Sprite sheet: 8 frame tepat (jika guna grid 4×2), semua sel sama saiz, badan/pakaian/kamera konsisten, tiada anggota berganda atau potongan.
- [ ] Saiz fail dimampatkan tanpa merosakkan kualiti; **PNG masih diterima** untuk latar, WebP hanya apabila penukaran sebenar dibuat.

## 7. Urutan jana yang paling menjimatkan masa/token

1. Jana **satu** latar `bg_sound_garden.png` dan simpan asal dalam `source-assets/backgrounds/`.
2. Jana **satu** avatar serta **satu** NPC statik dan simpan sebagai rujukan identiti watak.
3. Dengan rujukan watak sama, jana **avatar idle + walk** dan **NPC Guru idle + talk** dalam sprite sheet; semak kualiti setiap frame.
4. Salin hanya fail yang diluluskan ke `public/assets/`, kemudian bina prototaip satu Taman Bunyi dan satu misi.
5. Barulah jana papan, pokok, bunga, animasi `point` dan `writing` menurut keperluan sebenar.

**Jangan mulakan dengan 30–50 aset.** Kekalkan satu set visual yang selaras sebelum berkembang.


## 8. Arahan pantas untuk Claude apabila aset PNG belum ditukar

> **BM:** Semua fail PNG dalam `public/assets/` boleh digunakan terus. Jangan mencari `.webp` jika fail `.png` wujud. Jangan rename sambungan sebagai langkah penukaran. Gunakan laluan sebenar; `source-assets/` ialah sandaran dan tidak perlu dimuatkan dalam game. Untuk animasi, gunakan sprite sheet yang sudah disemak dengan tepat menurut `JAWIKLIK_SPRITE_GUIDE.md`. Jangan ubah fungsi lain.
>
> **EN:** Load existing PNG assets directly from `public/assets/`; do not assume WebP versions exist and never rename extensions as conversion. Keep `source-assets/` private to the development project. Animate only verified sprite sheets as documented. Do not modify unrelated features.
