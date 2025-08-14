## Export Presets (إعدادات التصدير)

### Vector (متجه)
- SVG (Scalable Vector Graphics — رسومات متجهية قابلة للتدرّج):
  - Outline strokes عند الحاجة؛ Remove metadata غير الضروري؛ Responsive.
- PDF (Portable Document Format — صيغة مستند منقول):
  - PDF/X‑4؛ ألوان: sRGB و CMYK (Cyan Magenta Yellow Key — سماوي/أرجواني/أصفر/أسود) عند الطباعة.
- EPS (Encapsulated PostScript — بوست سكريبت مغلف):
  - متوافق مع الطباعة التقليدية.

### Raster (بيكسل)
- PNG (Portable Network Graphics — رسوميات محمولة):
  - خلفية شفافة؛ 1x/2x/3x؛ 1080 و 2048 و 4096 بكسل.

### Motion (موشن)
- Renders: H.264 MP4، WebM عند الحاجة؛ Bitrate مطابق للمنصة.
- AE (Adobe After Effects — أدوبي أفتر إفكتس):
  - 1080p/2160p؛ 24/30 FPS (Frames Per Second — الإطارات بالثانية).
  - Presets: ارفع `.epr` (EPR — Encoder Preset — إعداد ترميز) لـ (YouTube 1080p/Instagram/Reels) ضمن `assets-placeholders/03_Motion/`.

### PDF (طباعة)
- ارفع `.joboptions` (PDF/X‑4) ضمن `export-presets/`.

### Color Profiles (بروفايلات اللون)
- ICC (International Color Consortium — اتحاد اللون الدولي): `sRGB_v4_ICC_preference.icc`, `FOGRA39.icc` داخل `export-presets/`.
