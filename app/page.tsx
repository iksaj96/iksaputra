"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Image from "next/image";

// Logo: public/logo.png (ukuran asli 595 x 640)
const LOGO = "/logo.png";
const LOGO_W = 595;
const LOGO_H = 640;
// Gambar pengganti berita tanpa foto. Salin app/opengraph-image.png ke public/opengraph.png.
// Kosongkan ("") kalau tidak ingin dipakai.
const POSTER = "/opengraph.png";

const stats = [
  ["ORDA", "Organisasi daerah santri di lingkungan pesantren"],
  ["Lubangsa", "Daerah naungan di PP. Annuqayah"],
  ["Guluk-Guluk", "Lokasi pesantren, Kabupaten Sumenep"],
  ["6", "Fungsi utama organisasi"],
];
const identitas = [
  ["Nama organisasi", "Ikatan Santri Pantai Utara"],
  ["Akronim", "IKSAPUTRA"],
  ["Kategori", "ORDA (Organisasi Daerah)"],
  ["Wilayah identitas", "Pantai Utara, Kabupaten Sumenep"],
  ["Lingkungan pesantren", "Pondok Pesantren Annuqayah"],
  ["Daerah naungan", "Lubangsa"],
  ["Lokasi", "Guluk-Guluk, Sumenep, Jawa Timur"],
  ["Basis anggota", "Santri asal wilayah Pantai Utara"],
];
const fungsi = [
  ["Kekeluargaan", "Mempererat hubungan antarsantri yang berasal dari wilayah Pantai Utara.", "users"],
  ["Sosial", "Membangun solidaritas dan kepedulian antaranggota.", "heart"],
  ["Pendidikan", "Ruang belajar berorganisasi, bermusyawarah, dan bertanggung jawab.", "book"],
  ["Keagamaan", "Mendukung kehidupan keagamaan santri sesuai tata kehidupan pesantren.", "moon"],
  ["Pengembangan diri", "Melatih kepemimpinan, komunikasi, kerja sama, dan pengelolaan kegiatan.", "spark"],
  ["Identitas daerah", "Memelihara hubungan dengan daerah asal tanpa mengesampingkan identitas sebagai santri.", "pin"],
];
const struktur = [
  ["Pelindung atau pembina", "Nama dan kedudukan pembina"],
  ["Ketua dan wakil ketua", "Nama pada periode berjalan"],
  ["Sekretaris", "Pengelolaan administrasi dan arsip"],
  ["Bendahara", "Pengelolaan keuangan"],
  ["Divisi atau departemen", "Nama bidang dan pembagian tugas"],
  ["Anggota", "Ketentuan keanggotaan dan pendataan"],
];
const kegiatan = [
  ["Kegiatan rutin internal", "Pertemuan berkala pengurus dan anggota."],
  ["Silaturahmi anggota", "Forum kebersamaan santri sedaerah."],
  ["Keagamaan dan pendidikan", "Kegiatan yang mendukung kehidupan belajar santri."],
  ["Olahraga, seni, minat", "Wadah mengembangkan bakat anggota."],
  ["Sosial dan pengabdian", "Kepedulian terhadap sesama dan masyarakat."],
  ["Kaderisasi", "Regenerasi dan pembinaan calon pengurus."],
];
const sejarah = [
  "Tahun dan tanggal berdiri",
  "Nama pendiri atau perintis",
  "Urutan kepemimpinan tiap periode",
  "Peristiwa penting organisasi",
  "Logo, lambang, dan maknanya",
  "Semboyan atau jargon resmi",
];

type Berita = { tgl: string; h: string; p: string; href?: string; img?: string };
// Ganti contoh ini dengan berita asli. Gambar: simpan di public/berita/ lalu isi img, misalnya "/berita/rapat.jpg".
const berita: Berita[] = [
  { tgl: "Contoh", h: "Judul berita pertama", p: "Ringkasan singkat berita atau kabar kegiatan IKSAPUTRA akan tampil di sini." },
  { tgl: "Contoh", h: "Judul berita kedua", p: "Ringkasan singkat berita kedua akan tampil di sini." },
  { tgl: "Contoh", h: "Judul berita ketiga", p: "Ringkasan singkat berita ketiga akan tampil di sini." },
];

type Tulisan = { jenis: string; judul: string; penulis: string; ringkas: string; isi: string[]; href?: string };
const JENIS = ["Semua", "Esai", "Puisi", "Cerpen", "Opini"];
// Ganti contoh ini dengan tulisan asli anggota. `isi` = satu string per paragraf.
const tulisan: Tulisan[] = [
  { jenis: "Esai", judul: "Judul esai anggota", penulis: "Nama penulis", ringkas: "Contoh: ringkasan singkat esai akan tampil di sini.", isi: ["Paragraf pertama. Ganti dengan tulisan asli anggota.", "Paragraf kedua."] },
  { jenis: "Puisi", judul: "Judul puisi anggota", penulis: "Nama penulis", ringkas: "Contoh: cuplikan atau gambaran singkat puisi.", isi: ["Bait pertama. Ganti dengan karya asli anggota.", "Bait kedua."] },
  { jenis: "Cerpen", judul: "Judul cerpen anggota", penulis: "Nama penulis", ringkas: "Contoh: sinopsis singkat cerpen.", isi: ["Pembuka cerpen. Ganti dengan karya asli anggota."] },
  { jenis: "Opini", judul: "Judul opini anggota", penulis: "Nama penulis", ringkas: "Contoh: inti gagasan opini.", isi: ["Paragraf pertama opini. Ganti dengan tulisan asli anggota."] },
];

type Foto = { src?: string; cap: string };
// Taruh foto di public/galeri/ lalu isi `src`, misalnya "/galeri/rapat.jpg".
const galeri: Foto[] = [
  { cap: "Kegiatan organisasi" },
  { cap: "Silaturahmi anggota" },
  { cap: "Pelantikan pengurus" },
  { cap: "Kegiatan keagamaan" },
  { cap: "Olahraga dan seni" },
  { cap: "Kebersamaan santri" },
];

const menu: [string, string][] = [
  ["tentang", "Tentang"],
  ["fungsi", "Fungsi"],
  ["struktur", "Struktur"],
  ["kegiatan", "Kegiatan"],
  ["berita", "Berita"],
  ["tulis", "Karya Tulis"],
  ["galeri", "Galeri"],
  ["arsip", "Arsip"],
];
// Urutan halaman: hero + semua menu. Nada latar tiap halaman: d gelap, l terang, c krem, g gradasi hijau.
const PAGES: [string, string][] = [["beranda", "Beranda"], ...menu];
const TONE = ["d", "l", "d", "l", "g", "l", "c", "d", "g"];

const P: Record<string, string> = {
  users: "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 20v-1a4 4 0 0 0-3-3.9M16 4.1a3.5 3.5 0 0 1 0 6.8",
  heart: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 5.5-7 10-7 10z",
  book: "M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17zM8 7h8M8 11h6",
  moon: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z",
  pin: "M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  photo: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M16 9h.01",
  menu: "M4 7h16M4 12h16M4 17h16",
  x: "M6 6l12 12M18 6 6 18",
  pen: "M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19l-4 1zM14 7l3 3",
  arr: "M5 12h14M13 6l6 6-6 6",
  arl: "M19 12H5M11 6l-6 6 6 6",
};
function Ico({ n, c = "" }: { n: string; c?: string }) {
  return (<svg className={`ic ${c}`} viewBox="0 0 24 24" aria-hidden="true"><path d={P[n]} /></svg>);
}
function Mark({ size, hero = false }: { size: number; hero?: boolean }) {
  if (!LOGO) return <span className="mono" style={{ width: size, height: size, fontSize: size * 0.5 }}>I</span>;
  return hero ? (
    <Image className="lg" src={LOGO} alt="" width={LOGO_W} height={LOGO_H} priority />
  ) : (
    <Image src={LOGO} alt="" width={Math.round((size * LOGO_W) / LOGO_H)} height={size} style={{ width: "auto", height: size }} />
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
const st = (n: number) => ({ "--d": `${Math.round(n * 90)}ms` }) as CSSProperties;
const behavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

function Eb({ i }: { i: number }) {
  return <p className="eb rv">{pad(i)} · {PAGES[i][1]}</p>;
}
function Big({ n }: { n: string }) {
  return (<div className="deco" aria-hidden="true"><span className="big">{n}</span></div>);
}
function Thumb({ src, alt, sizes, cls = "" }: { src?: string; alt: string; sizes: string; cls?: string }) {
  const s = src || POSTER;
  return (
    <div className={`thumb ${cls}${src ? "" : " poster"}`}>
      {s ? <Image src={s} alt={src ? alt : ""} fill sizes={sizes} /> : <Ico n="photo" c="phi" />}
    </div>
  );
}
function Nd({ s, top = false }: { s: string[]; top?: boolean }) {
  return (
    <div className={`tn${top ? " top" : ""}`}>
      <b>{s[0]}</b><span>{s[1]}</span><small>belum terverifikasi</small>
    </div>
  );
}

const star = (c: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='none' stroke='%23${c}' stroke-opacity='.1'%3E%3Crect x='20' y='20' width='40' height='40'/%3E%3Crect x='20' y='20' width='40' height='40' transform='rotate(45 40 40)'/%3E%3C/g%3E%3C/svg%3E")`;
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const WAVE = `q150 -34 300 0${" t300 0".repeat(7)}`;

const css = `.ip{--g:linear-gradient(90deg,#5ee89b,#2fbf71 60%,#1a9d5c);--gold:#d9b95b;--ui:#e9f6ee;--serif:Georgia,"Iowan Old Style","Palatino Linotype","Times New Roman",serif;position:fixed;inset:0;background:#04140c;color:#e9f6ee;font:17px/1.65 var(--font-body),system-ui,sans-serif}
.ip.tl{--ui:#0f2e1d}
.ip *{box-sizing:border-box}
.ip h1,.ip h2,.ip h3,.ip p,.ip ol,.ip dl,.ip figure{margin:0}
.ip h1,.ip h2,.ip h3,.ip b,.brand{font-family:var(--font-display),system-ui,sans-serif}
.ip a{color:inherit;text-decoration:none}
:where(.ip button){font:inherit;color:inherit}
.ip a:focus-visible,.ip button:focus-visible{outline:3px solid var(--gold);outline-offset:3px}
.ip i{font-style:normal}
.mono{display:grid;place-items:center;border-radius:50%;background:var(--g);color:#04140c;font-family:var(--font-display),system-ui,sans-serif;font-weight:800}
.ip svg.ic{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.ip svg.phi{position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px 0 0 -22px;stroke:rgba(255,255,255,.4)}

.prog{position:fixed;top:0;left:0;right:0;height:3px;z-index:50}
.prog i{display:block;height:100%;background:linear-gradient(90deg,#5ee89b,#d9b95b);transform:scaleX(0);transform-origin:left}
.nav{position:fixed;inset:0 0 auto 0;z-index:20;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:10px clamp(18px,3vw,36px);background:rgba(4,20,12,.82);backdrop-filter:blur(10px);border-bottom:1px solid rgba(120,230,170,.2);color:#e9f6ee}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:20px;letter-spacing:.03em;color:#fff}
.nav nav{display:flex;gap:22px;font-size:14.5px;font-weight:500}
.nav nav a{position:relative;padding:4px 0;opacity:.78;transition:opacity .2s}
.nav nav a::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;background:var(--g);transform:scaleX(0);transform-origin:left;transition:transform .3s}
.nav nav a:hover,.nav nav a.on{opacity:1}.nav nav a.on::after{transform:scaleX(1)}
.burger{display:none;place-items:center;width:44px;height:44px;border:1px solid rgba(120,230,170,.25);border-radius:12px;background:transparent;color:#fff;cursor:pointer}
.scrim,.drawer{display:none}
.scrim{position:fixed;inset:0;z-index:30;background:rgba(0,0,0,.6);opacity:0;visibility:hidden;transition:opacity .25s,visibility .25s}
.scrim.on{opacity:1;visibility:visible}
.drawer{position:fixed;top:0;right:0;bottom:0;z-index:40;width:min(84vw,320px);padding:18px 20px 28px;flex-direction:column;gap:4px;overflow-y:auto;background:linear-gradient(180deg,#0c5a36,#04140c 34%);border-left:1px solid rgba(120,230,170,.2);color:#fff;transform:translateX(100%);visibility:hidden;transition:transform .28s ease,visibility .28s}
.drawer.on{transform:none;visibility:visible}
.dhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.ip .drawer a.dl{padding:12px 12px;border-radius:14px;font-weight:600;font-size:18px;color:#fff}
.ip .drawer a.dl:hover{background:rgba(94,232,155,.14)}
.dfoot{margin-top:auto;padding-top:24px;font-size:13px;color:#9cc4ad}

.dots{position:fixed;right:18px;top:50%;z-index:15;display:flex;flex-direction:column;gap:6px;translate:0 -50%}
.dots button{position:relative;display:grid;place-items:center;width:24px;height:24px;border:0;background:none;cursor:pointer}
.dots button::after{content:"";width:9px;height:9px;border-radius:50%;border:1.5px solid var(--ui);transition:transform .25s,background .25s,border-color .25s}
.dots button.on::after{background:var(--gold);border-color:var(--gold);transform:scale(1.5)}
.dots span{position:absolute;right:32px;padding:4px 12px;border-radius:99px;background:#04140c;border:1px solid rgba(120,230,170,.3);color:#fff;font-size:13px;white-space:nowrap;opacity:0;translate:8px 0;pointer-events:none;transition:opacity .2s,translate .2s}
.dots button:hover span,.dots button:focus-visible span{opacity:1;translate:0 0}
.cnt{position:fixed;left:clamp(18px,3vw,36px);bottom:20px;z-index:15;display:flex;align-items:center;gap:10px;color:var(--ui);font:700 15px var(--font-display),system-ui,sans-serif;letter-spacing:.12em}
.cnt i{display:block;width:34px;height:1px;background:currentColor;opacity:.55}
.cnt span{opacity:.55}

.pages{height:100%;overflow-x:hidden;overflow-y:auto;scroll-snap-type:y mandatory;overscroll-behavior:contain;scrollbar-width:none}
.pages::-webkit-scrollbar{display:none}
.pg{position:relative;height:100%;display:flex;flex-direction:column;justify-content:flex-start;padding:72px 0 28px;overflow-x:hidden;overflow-y:auto;scrollbar-width:none;scroll-snap-align:start;scroll-snap-stop:always}
.pg::-webkit-scrollbar{display:none}
.pg.d{background:#04140c;color:#e9f6ee;--mut:#a8c9b6;--ln:rgba(120,230,170,.22)}
.pg.l{background:#f4faf6;color:#0f2e1d;--mut:#4d6b5a;--ln:rgba(15,90,50,.2)}
.pg.c{background:#f3ebd6;color:#2a2410;--mut:#6b5f38;--ln:rgba(90,70,10,.22)}
.pg.g{background:linear-gradient(135deg,#052e1a,#0c5a36 60%,#14864f);color:#fff;--mut:#d2ecdd;--ln:rgba(255,255,255,.3)}
.pg.d::before,.pg.g::before{content:"";position:absolute;inset:0;background-image:${star("78e6aa")};background-size:80px 80px;pointer-events:none}
.pg.l::before{content:"";position:absolute;inset:0;background-image:${star("0c5a36")};background-size:80px 80px;pointer-events:none}
.fit{position:relative;z-index:1;width:100%;margin-block:auto;flex:none;transform-origin:0 0}
.wrap{position:relative;z-index:1;width:100%;max-width:1200px;margin:0 auto;padding:0 clamp(24px,6vw,84px)}
.deco{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}
.big{position:absolute;right:4vw;bottom:-.14em;font:800 clamp(180px,30vw,440px)/1 var(--font-display),system-ui,sans-serif;color:transparent;-webkit-text-stroke:1px var(--ln);user-select:none}
.eb{display:flex;align-items:center;gap:14px;font:700 13px var(--font-display),system-ui,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:var(--gold)}
.eb::before{content:"";width:44px;height:1px;background:currentColor}
.pg.l .eb,.pg.c .eb{color:#7a5a08}
.ip h2{margin-top:12px;font-size:clamp(30px,4.4vw,58px);line-height:1.05;font-weight:800;letter-spacing:-.025em;max-width:20ch}
.pg.d h2,.pg.g h2,.pg.d h3,.pg.g h3{color:#fff}
.lead{max-width:56ch;margin-top:14px;font-size:clamp(16px,1.5vw,19px);color:var(--mut)}
.tag{display:inline-block;padding:2px 10px;border:1px solid rgba(217,185,91,.6);border-radius:99px;font-size:12px;font-weight:600;color:#7a5a08;white-space:nowrap}
.pg.d .tag,.pg.g .tag{color:#ecdba3}
.ip .lnk{display:inline-block;margin-top:10px;font-weight:700;color:#0c5a36;border-bottom:2px solid var(--gold)}
.ip time{display:block;margin-bottom:6px;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#7a5a08}

.pg.hero{padding-bottom:56px;text-align:center;background:radial-gradient(760px 520px at 50% 40%,rgba(47,191,113,.28),transparent 70%),radial-gradient(640px 440px at 6% 0,rgba(20,134,79,.3),transparent 70%),linear-gradient(180deg,#04140c,#071d12)}
.pg.hero::after{content:"";position:absolute;inset:0;background-image:${GRAIN};opacity:.08;pointer-events:none}
.hc{display:flex;flex-direction:column;align-items:center;translate:0 calc(var(--hp,0)*-60px);opacity:calc(1 - var(--hp,0)*1.2)}
.badge{display:inline-block;padding:7px 16px;border:1px solid rgba(217,185,91,.55);border-radius:99px;font-size:14px;color:#ecdba3}
.emblem{--es:min(26svh,240px);position:relative;width:var(--es);height:var(--es);margin:22px 0 18px;display:grid;place-items:center;scale:calc(1 - var(--hp,0)*.2)}
.emblem::before{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 28%,#14864f,#0a3d25 58%,#04140c);border:1px solid rgba(217,185,91,.6)}
.emblem::after{content:"";position:absolute;inset:-60%;border-radius:50%;background:radial-gradient(circle,rgba(47,191,113,.26),transparent 62%);pointer-events:none}
.orb{position:absolute;border-radius:50%;border:1px solid var(--ln)}
.o1{inset:-16px}.o2{inset:-38px;border-style:dashed}
.orb::after{content:"";position:absolute;top:-4px;left:50%;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:var(--gold)}
.emblem img.lg{position:relative;width:54%;height:auto;filter:drop-shadow(0 8px 20px rgba(0,0,0,.45))}
.emblem .mono{position:relative;width:46%!important;height:46%!important;font-size:clamp(48px,10svh,110px)!important;background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.35)}
.hc h1{display:flex;justify-content:center;font-size:clamp(44px,min(12.5vw,19svh),200px);line-height:.92;font-weight:800;letter-spacing:-.035em;color:#fff;text-shadow:0 10px 60px rgba(47,191,113,.35)}
.hc h1 span{display:inline-block}
.full{margin-top:14px;font:600 clamp(13px,1.5vw,18px) var(--font-display),system-ui,sans-serif;letter-spacing:.42em;text-transform:uppercase;color:var(--gold)}
.hsub{max-width:54ch;margin-top:14px;font-size:clamp(15px,1.4vw,18px);color:var(--mut)}
.cta{display:flex;flex-wrap:wrap;justify-content:center;gap:14px;margin-top:22px}
.btn{display:inline-block;padding:13px 26px;border-radius:99px;font-weight:700;transition:translate .2s}
.btn:hover{translate:0 -2px}
.ip .pri{background:var(--g);color:#04140c}.ip .sec2{border:1px solid rgba(255,255,255,.5);color:#fff}
.wv{position:absolute;left:0;bottom:0;width:200%;height:90px;opacity:.55;pointer-events:none}
.wv path{fill:none;stroke:rgba(120,230,170,.55);stroke-width:1.4;vector-effect:non-scaling-stroke}
.hint{position:absolute;left:50%;bottom:14px;z-index:2;translate:-50% 0;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--mut)}
.hint i{display:block;width:1px;height:30px;background:linear-gradient(var(--gold),transparent);transform-origin:top}

.ab{display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(32px,6vw,88px);align-items:center}
.stmt{max-width:32ch;margin-top:18px;font:400 clamp(19px,2.1vw,28px)/1.4 var(--serif);color:#16402a}
.sts{display:grid;grid-template-columns:1fr 1fr;gap:16px 24px;margin-top:26px;padding-top:20px;border-top:1px solid var(--ln)}
.sts b{display:block;font-size:clamp(22px,2.4vw,30px);line-height:1.1;font-weight:800;background:linear-gradient(90deg,#0c5a36,#2fbf71);-webkit-background-clip:text;background-clip:text;color:transparent}
.sts span{display:block;margin-top:2px;font-size:13.5px;line-height:1.45;color:var(--mut)}
.dos{position:relative;padding:26px 28px 20px;background:#fff;border:1px solid var(--ln);border-radius:6px;box-shadow:0 30px 60px -30px rgba(12,90,54,.4);rotate:-1.2deg}
.dos::before{content:"";position:absolute;top:-12px;left:50%;width:96px;height:24px;margin-left:-48px;background:rgba(217,185,91,.55);rotate:2deg}
.ip .dos h3{margin-bottom:6px;padding-bottom:10px;border-bottom:2px solid #0f2e1d;font-size:12px;font-weight:800;letter-spacing:.26em;text-transform:uppercase;color:#7a5a08}
.dos dl div{display:grid;grid-template-columns:.85fr 1.15fr;gap:12px;padding:8px 0;border-bottom:1px dashed var(--ln)}
.dos dt{font-size:13px;color:var(--mut)}
.dos dd{margin:0;font-weight:700;color:#0f2e1d}
.stamp{margin-top:14px;padding:10px 14px;border:1px dashed rgba(166,122,10,.6);border-radius:8px;font-size:13.5px;line-height:1.5;color:#6b5f38}

.fx{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:clamp(24px,5vw,72px);margin-top:30px;align-items:stretch}
.fl{display:flex;flex-direction:column;border-top:1px solid var(--ln)}
.fb{display:flex;align-items:baseline;gap:16px;padding:13px 4px;border:0;border-bottom:1px solid var(--ln);background:none;text-align:left;cursor:pointer;color:var(--mut);transition:color .25s}
.fb .fn{font:700 13px var(--font-display),system-ui,sans-serif;letter-spacing:.14em;color:var(--gold)}
.fb .ft{font:700 clamp(18px,2vw,26px) var(--font-display),system-ui,sans-serif}
.fb:hover{color:#fff}
.fb.on{color:#fff;box-shadow:inset 3px 0 0 var(--gold);padding-left:18px}
.fd{position:relative;display:flex;flex-direction:column;justify-content:center;min-height:300px;padding:34px clamp(22px,3vw,44px);border:1px solid var(--ln);border-radius:22px;background:linear-gradient(160deg,rgba(47,191,113,.16),rgba(4,20,12,.4));overflow:hidden}
.fnum{position:absolute;right:18px;top:-18px;font:800 clamp(120px,16vw,220px)/1 var(--font-display),system-ui,sans-serif;color:transparent;-webkit-text-stroke:1px rgba(120,230,170,.28);pointer-events:none}
.fd .ico{position:relative;display:grid;place-items:center;width:84px;height:84px;margin-bottom:22px;border-radius:24px;background:linear-gradient(160deg,#5ee89b,#14864f);color:#04140c}
.ip .fd svg.ic{width:44px;height:44px;stroke-width:1.5}
.ip .fd h3{position:relative;font-size:clamp(28px,3.6vw,48px);line-height:1.05;letter-spacing:-.02em}
.fd p{position:relative;max-width:44ch;margin-top:14px;font-size:clamp(16px,1.6vw,20px);color:var(--mut)}

.sw{display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(32px,6vw,88px);align-items:center}
.legend{display:flex;align-items:center;gap:12px;margin-top:22px;font-size:14.5px;color:var(--mut)}
.legend i{display:block;width:34px;height:20px;border:1.5px dashed #2f8f5d;border-radius:6px;background:#fff;flex:none}
.tree{display:flex;flex-direction:column;align-items:center;width:100%}
.tn{position:relative;width:min(100%,300px);padding:11px 14px;text-align:center;border:1.5px dashed #2f8f5d;border-radius:16px;background:#fff}
.tn b{display:block;font-size:17px;line-height:1.25;color:#0f2e1d}
.tn span{display:block;margin-top:2px;font-size:13.5px;line-height:1.4;color:var(--mut)}
.tn small{display:inline-block;margin-top:6px;padding:1px 10px;border:1px solid rgba(166,122,10,.55);border-radius:99px;font-size:11.5px;font-weight:700;color:#7a5a08}
.tn.top{background:#0c5a36;border:1.5px solid #0c5a36}
.tn.top b{color:#fff}.tn.top span{color:#cfeedd}.tn.top small{color:#ecdba3;border-color:rgba(236,219,163,.6)}
.tv{display:block;width:2px;height:22px;background:#2f8f5d}
.trow{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:14px;width:100%;padding-top:22px}
.trow::before{content:"";position:absolute;top:0;left:calc((100% - 28px)/6);right:calc((100% - 28px)/6);height:2px;background:#2f8f5d}
.trow .tn{width:100%}
.trow .tn::before{content:"";position:absolute;top:-22px;left:50%;width:2px;height:22px;margin-left:-1px;background:#2f8f5d}

.kh{display:flex;justify-content:space-between;align-items:flex-end;gap:24px}
.arrs{display:flex;gap:10px}
.arrs button{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.5);background:transparent;cursor:pointer;transition:background .2s}
.arrs button:hover{background:rgba(255,255,255,.16)}
.trk{position:relative;z-index:1;display:flex;gap:18px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding-inline:clamp(24px,6vw,84px);margin-top:30px;padding:6px clamp(24px,6vw,84px) 22px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.4) transparent}
.kc{position:relative;flex:0 0 min(78vw,330px);display:flex;flex-direction:column;justify-content:flex-end;min-height:min(40svh,300px);padding:26px 24px;border:1px solid var(--ln);border-radius:20px;background:rgba(4,30,17,.5);overflow:hidden;scroll-snap-align:start}
.kn{position:absolute;left:18px;top:6px;font:800 120px/1 var(--font-display),system-ui,sans-serif;color:transparent;-webkit-text-stroke:1px rgba(255,255,255,.4)}
.ip .kc h3{position:relative;margin-bottom:8px;font-size:24px}
.kc p{position:relative;color:var(--mut)}

.bw{display:grid;grid-template-columns:1.25fr 1fr;gap:clamp(24px,4vw,56px);margin-top:28px;align-items:start}
.thumb{position:relative;overflow:hidden;border-radius:6px;background:linear-gradient(135deg,#0c5a36,#2fbf71)}
.thumb img{object-fit:cover}
.thumb.poster{background:#04140c}
.bi .thumb.poster img{object-position:14% 50%}
.bf .thumb{height:min(30svh,260px)}
.bf .bt{padding-top:16px}
.tg{display:inline-block;margin-bottom:8px;padding:2px 10px;border-radius:99px;background:#0c5a36;color:#fff;font-size:12px;font-weight:700;letter-spacing:.06em}
.ip .bf h3{font-size:clamp(24px,2.8vw,38px);line-height:1.12;letter-spacing:-.02em;color:#0f2e1d}
.bf p{margin-top:8px;color:var(--mut)}
.bl{display:flex;flex-direction:column}
.bi{display:flex;gap:16px;padding:16px 0;border-top:2px solid #0f2e1d}
.bi .thumb{flex:none;width:120px;height:92px}
.ip .bi h3{font-size:19px;line-height:1.25;color:#0f2e1d}
.bi p{margin-top:4px;font-size:15px;color:var(--mut)}

.tw{display:grid;grid-template-columns:.95fr 1.05fr;gap:clamp(28px,5vw,72px);align-items:center}
.tabs{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.tab{padding:8px 18px;border-radius:99px;border:1px solid rgba(90,70,10,.3);background:#fffdf6;color:#2a2410;font:600 15px var(--font-body),system-ui,sans-serif;cursor:pointer;transition:background .2s,color .2s}
.tab.on{background:#0c5a36;border-color:#0c5a36;color:#fff}
.toc{list-style:none;padding:0;margin-top:20px}
.ti{width:100%;display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:baseline;padding:12px 8px;text-align:left;border:0;border-top:1px solid var(--ln);background:none;cursor:pointer;transition:background .25s}
.toc li:last-child .ti{border-bottom:1px solid var(--ln)}
.ti .tx{font:700 13px var(--font-display),system-ui,sans-serif;color:#7a5a08}
.ti .tt{font-family:var(--serif);font-size:18px;font-weight:700}
.ti .ta{font-size:13.5px;color:var(--mut)}
.ti:hover{background:rgba(255,255,255,.55)}
.ti.on{background:rgba(255,255,255,.7);box-shadow:inset 3px 0 0 #0c5a36}
.ti.on .tt{color:#0c5a36}
.book{position:relative;min-height:min(50svh,430px);margin-left:10px;padding:30px 30px 26px 76px;border-radius:4px 14px 14px 4px;color:#2a2410;background:linear-gradient(90deg,#d8cba3 0,#efe6c8 30px,transparent 31px),linear-gradient(90deg,transparent 62px,rgba(217,185,91,.8) 62px 63px,transparent 63px),repeating-linear-gradient(transparent 0 31px,rgba(47,140,90,.2) 31px 32px),#fffdf6;box-shadow:5px 5px 0 -1px #f0e7cb,5px 5px 0 0 rgba(90,70,10,.25),10px 10px 0 -1px #e8dcb8,10px 10px 0 0 rgba(90,70,10,.2),0 36px 60px -30px rgba(60,40,0,.55)}
.rib{position:absolute;top:-6px;right:34px;width:24px;height:84px;background:#0c5a36;clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%)}
.bk em{font:700 13px var(--font-display),system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#7a5a08}
.ip .bk h3{margin:8px 0 4px;font:700 clamp(24px,2.8vw,36px)/1.15 var(--serif);color:#0f2e1d}
.bk small{display:block;margin-bottom:22px;font-weight:600;color:#0c5a36}
.bk p{font:400 17px/32px var(--serif);color:#3a3416}
.rd{display:inline-flex;align-items:center;gap:8px;margin-top:20px;padding:10px 20px;border:0;border-radius:99px;background:#0c5a36;color:#fff;font-weight:700;cursor:pointer}
.ip .rd svg{width:18px;height:18px}
.empty{color:var(--mut)}

.gh{display:flex;justify-content:space-between;align-items:flex-end;gap:32px}
.gh .lead{margin:0;max-width:38ch}
.mos{display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(3,1fr);gap:12px;height:min(52svh,500px);margin-top:26px}
.ph{position:relative;overflow:hidden;display:flex;align-items:flex-end;padding:0;border:1px solid var(--ln);border-radius:14px;background:linear-gradient(135deg,#0c5a36,#04140c);text-align:left;cursor:zoom-in}
.ph:nth-child(2n){background:linear-gradient(200deg,#2fbf71,#0c5a36 60%,#04140c)}
.ph:nth-child(3n){background:linear-gradient(150deg,#14864f,#052e1a)}
.ph:nth-child(1){grid-area:1/1/3/3}
.ph:nth-child(2){grid-area:1/3/2/5}
.ph:nth-child(3){grid-area:1/5/3/7}
.ph:nth-child(4){grid-area:2/3/4/5}
.ph:nth-child(5){grid-area:3/1/4/3}
.ph:nth-child(6){grid-area:3/5/4/7}
.ph:nth-child(n+7){grid-column:span 2}
.ph img{object-fit:cover;transition:transform .7s}.ph:hover img{transform:scale(1.06)}
.ph span{position:relative;width:100%;padding:34px 16px 12px;font-weight:700;color:#fff;background:linear-gradient(180deg,rgba(4,20,12,0),rgba(4,20,12,.85))}

.modal{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:20px;background:rgba(2,12,7,.82)}
.paper{width:min(660px,100%);max-height:86vh;overflow:auto;padding:38px 34px 22px 62px;border-radius:8px 22px 8px 22px;background:linear-gradient(90deg,transparent 41px,rgba(217,185,91,.7) 41px 42px,transparent 42px),repeating-linear-gradient(transparent 0 31px,rgba(47,191,113,.2) 31px 32px),#fffdf6;color:#233f30;font-family:var(--serif);line-height:32px}
.paper em{font:700 13px var(--font-display),system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#7a5a08}
.ip .paper h3{margin:0;font:700 28px/36px var(--serif);color:#0f2e1d}
.paper small{display:block;margin-bottom:32px;color:#0c5a36;font-weight:600}
.ip .paper p{margin:0 0 32px;font-size:18px}
.ip .paper a{color:#0c5a36;text-decoration:underline}
.mclose{float:right;display:grid;place-items:center;width:40px;height:40px;margin:-16px -12px 0 12px;border:1px solid rgba(15,90,50,.25);border-radius:12px;background:#fff;color:#0f2e1d;cursor:pointer}
.lbc,.lbn{position:absolute;display:grid;place-items:center;width:46px;height:46px;border:1px solid rgba(255,255,255,.4);border-radius:50%;background:rgba(4,20,12,.6);color:#fff;cursor:pointer}
.lbc{top:18px;right:18px}
.lbn{top:50%;translate:0 -50%}.lbn.l{left:18px}.lbn.r{right:18px}
.lbf{width:min(92vw,1000px)}
.lbi{position:relative;width:100%;height:min(72vh,680px);overflow:hidden;border-radius:12px;background:linear-gradient(135deg,#0c5a36,#04140c)}
.lbi img{object-fit:contain}
.lbf figcaption{display:flex;justify-content:space-between;gap:16px;margin-top:12px;font-weight:700;color:#fff}
.lbf figcaption span{color:var(--gold)}

.pg.last{padding-bottom:0}
.drs{list-style:none;padding:0;margin:30px 0 0;display:grid;grid-template-columns:repeat(3,1fr);gap:26px 18px}
.dr{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding:26px 20px 18px;border:1.5px dashed rgba(217,185,91,.55);border-radius:6px 6px 14px 14px;background:rgba(255,255,255,.05)}
.dr::before{content:attr(data-n);position:absolute;top:-13px;left:18px;padding:2px 12px;border:1px solid rgba(217,185,91,.55);border-bottom:0;border-radius:8px 8px 0 0;background:#0a3a22;font-size:12px;letter-spacing:.14em;color:var(--gold)}
.dr b{font-size:17px;line-height:1.3;color:#fff}
.foot{position:relative;z-index:1;flex:none;padding:18px 0;border-top:1px solid var(--ln);background:rgba(3,14,8,.7);font-size:15px}
.fw{display:flex;gap:18px;align-items:flex-start}
.foot p{max-width:60ch;margin:2px 0 6px;color:var(--mut)}.foot small{color:#9cc4ad}.foot b{color:#fff}

@media (prefers-reduced-motion:no-preference){
  .pages{scroll-behavior:smooth}
  .pages.js .pg .rv{opacity:0;translate:0 28px;transition:opacity .45s ease,translate .45s ease}
  .pages.js .pg.act .rv{opacity:1;translate:0 0;transition:opacity .9s cubic-bezier(.2,.7,.2,1) var(--d,0ms),translate .9s cubic-bezier(.2,.7,.2,1) var(--d,0ms)}
  .pages.js .pg .big{opacity:0;translate:8vw 0;transition:opacity .5s,translate .5s}
  .pages.js .pg.act .big{opacity:1;translate:0 0;transition:opacity 1.2s,translate 1.4s cubic-bezier(.2,.7,.2,1)}
  .hero .rv{animation:up .9s cubic-bezier(.2,.7,.2,1) var(--d,0ms) backwards}
  .fd,.bk{animation:swap .6s cubic-bezier(.2,.7,.2,1) both}
  .o1{animation:spin 50s linear infinite}
  .o2{animation:spin 80s linear infinite reverse}
  .wv{animation:wave 26s linear infinite}
  .hint i{animation:drip 2.2s ease-in-out infinite}
  @keyframes up{from{opacity:0;translate:0 28px}}
  @keyframes swap{from{opacity:0;translate:0 18px}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes wave{to{transform:translateX(-50%)}}
  @keyframes drip{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
}
@media (prefers-reduced-motion:reduce){
  .ip *,.ip *::before,.ip *::after{animation:none!important;transition:none!important}
}
@media (max-height:640px){.hint{display:none}.pg.hero{padding-bottom:28px}}
@media (max-width:1080px){
  .nav nav{display:none}.burger{display:grid}.scrim{display:block}.drawer{display:flex}
  .cnt{left:auto;right:76px;top:20px;bottom:auto;z-index:25;color:#fff}
}
@media (max-width:900px){
  .dots{display:none}
  .ab,.sw,.tw,.bw,.fx{grid-template-columns:1fr;gap:26px}
  .fl{flex-direction:row;gap:8px;overflow-x:auto;border-top:0;padding-bottom:6px}
  .fb{flex:none;padding:8px 16px;border:1px solid var(--ln);border-radius:99px}
  .fb .fn{display:none}
  .fb.on{padding-left:16px;box-shadow:none;background:var(--gold);color:#04140c}
  .gh{flex-direction:column;align-items:flex-start;gap:0}.gh .lead{margin-top:14px}
  .drs{grid-template-columns:1fr 1fr}
  .big{font-size:clamp(140px,40vw,260px)}
  .bf .thumb{height:180px}
}
@media (max-width:640px){
  .ip{font-size:16px}
  .full{letter-spacing:.2em}
  .btn{width:100%;text-align:center}
  .dos{rotate:0deg}.dos dl div{grid-template-columns:1fr;gap:2px}
  .trow{grid-template-columns:1fr;gap:12px;padding-top:0}
  .trow::before{display:none}
  .trow .tn::before{display:none}
  .trow .tn+.tn::before{display:block;top:-12px;height:12px}
  .book{padding:26px 20px 22px 60px}
  .ti{grid-template-columns:30px 1fr}.ti .ta{grid-column:2}
  .mos{grid-template-columns:1fr 1fr;grid-template-rows:none;grid-auto-rows:120px;height:auto}
  .mos .ph{grid-area:auto!important}
  .mos .ph:nth-child(1){grid-column:span 2!important}
  .drs{grid-template-columns:1fr}
  .kh{align-items:flex-start}
  .paper{padding:30px 20px 18px 50px}
  .lbn{top:auto;bottom:18px;translate:0 0}
}`;

export default function Home() {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [fi, setFi] = useState(0);
  const [jenis, setJenis] = useState("Semua");
  const [pil, setPil] = useState(0);
  const [baca, setBaca] = useState<Tulisan | null>(null);
  const [lb, setLb] = useState<number | null>(null);

  const sc = useRef<HTMLElement>(null);
  const bar = useRef<HTMLElement>(null);
  const hero = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const idxRef = useRef(0);
  const lockRef = useRef(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lbRef = useRef<HTMLButtonElement>(null);

  const daftar = tulisan.filter((t) => jenis === "Semua" || t.jenis === jenis);
  const sel: Tulisan | undefined = daftar[Math.min(pil, daftar.length - 1)];
  const fcur = fungsi[fi] ?? fungsi[0];
  const [utama, ...lain] = berita;
  const tone = TONE[idx];
  const pg = (i: number, extra = "") => `pg ${TONE[i]}${extra ? " " + extra : ""}${i === idx ? " act" : ""}`;

  const go = useCallback((i: number) => {
    const n = Math.max(0, Math.min(PAGES.length - 1, i));
    document.getElementById(PAGES[n][0])?.scrollIntoView({ behavior: behavior(), block: "start" });
  }, []);
  const jump = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    go(PAGES.findIndex((p) => p[0] === id));
  };
  const slide = (d: number) => track.current?.scrollBy({ left: d * 360, behavior: behavior() });

  // Skalakan isi tiap halaman supaya selalu muat di tinggi layar
  const fit = useCallback(() => {
    const floor = window.innerWidth <= 640 ? 0.82 : 0.55;
    document.querySelectorAll<HTMLElement>(".ip .pg").forEach((pgEl) => {
      const f = pgEl.querySelector<HTMLElement>(":scope > .fit");
      if (!f) return;
      const cs = getComputedStyle(pgEl);
      const foot = pgEl.querySelector<HTMLElement>(":scope > .foot");
      const avail = pgEl.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (foot ? foot.offsetHeight : 0);
      if (avail <= 0) return;
      const apply = (z: number) => {
        f.style.width = z < 1 ? `${100 / z}%` : "";
        f.style.transform = z < 1 ? `scale(${z})` : "";
        return f.offsetHeight;
      };
      let z = 1;
      let h = apply(1);
      for (let k = 0; k < 6; k++) {
        const nz = Math.max(floor, Math.min(1, avail / h));
        if (Math.abs(nz - z) < 0.004) break;
        z = nz;
        h = apply(z);
      }
      if (z < 1) {
        const need = h * z;
        const sy = Math.max(0, (avail - need) / 2) - Math.max(0, (avail - h) / 2);
        f.style.transform = `translate(0px, ${sy.toFixed(1)}px) scale(${z.toFixed(4)})`;
      }
    });
  }, []);

  useEffect(() => {
    fit();
    const t = window.setTimeout(fit, 400);
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => { window.clearTimeout(t); window.removeEventListener("resize", fit); };
  }, [fit]);
  useEffect(() => { fit(); }, [fit, jenis, pil, fi]);

  // Halaman aktif, progres scroll, dan parallax hero
  useEffect(() => {
    const root = sc.current;
    if (!root) return;
    root.classList.add("js");
    const secs = PAGES.map(([id]) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const i = secs.indexOf(e.target as HTMLElement);
        if (i >= 0) { idxRef.current = i; setIdx(i); }
      });
    }, { root, rootMargin: "-50% 0px -49% 0px", threshold: 0 });
    secs.forEach((s) => io.observe(s));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tick = false;
    const frame = () => {
      tick = false;
      const h = root.scrollHeight - root.clientHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? root.scrollTop / h : 0})`;
      if (!reduce && hero.current) {
        hero.current.style.setProperty("--hp", Math.max(0, Math.min(1, root.scrollTop / root.clientHeight)).toFixed(3));
      }
    };
    const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(frame); } };
    root.addEventListener("scroll", onScroll, { passive: true });
    frame();
    return () => { io.disconnect(); root.removeEventListener("scroll", onScroll); };
  }, []);

  // Sekali gulir roda mouse atau touchpad = satu halaman
  useEffect(() => {
    const root = sc.current;
    if (!root) return;
    let last = 0;
    let prev = 0;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const dir = Math.sign(e.deltaY);
      if (!dir) return;
      const pgEl = (e.target as HTMLElement).closest<HTMLElement>(".pg");
      // Halaman yang isinya benar-benar lebih tinggi dari layar: scroll di dalam halaman dulu
      if (pgEl && pgEl.scrollHeight > pgEl.clientHeight + 40) {
        const edge = dir > 0 ? pgEl.scrollTop + pgEl.clientHeight >= pgEl.scrollHeight - 2 : pgEl.scrollTop <= 1;
        if (!edge) return;
      }
      e.preventDefault();
      const now = performance.now();
      const mag = Math.abs(e.deltaY);
      const tail = now - last < 70 && mag <= prev;
      last = now;
      prev = mag;
      if (now < lockRef.current || tail) return;
      lockRef.current = now + 850;
      go(idxRef.current + dir);
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [go]);

  // Kunci scroll saat ada overlay, dan fokus ke tombol tutup
  useEffect(() => {
    if (sc.current) sc.current.style.overflowY = open || baca || lb !== null ? "hidden" : "";
  }, [open, baca, lb]);
  useEffect(() => { if (baca) closeRef.current?.focus(); }, [baca]);
  useEffect(() => { if (lb !== null) lbRef.current?.focus(); }, [lb]);

  // Keyboard: Escape, lightbox, dan navigasi halaman
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setBaca(null); setLb(null); return; }
      if (lb !== null) {
        if (e.key === "ArrowRight") { e.preventDefault(); setLb((v) => (v === null ? v : (v + 1) % galeri.length)); }
        if (e.key === "ArrowLeft") { e.preventDefault(); setLb((v) => (v === null ? v : (v - 1 + galeri.length) % galeri.length)); }
        return;
      }
      if (open || baca || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const c = idxRef.current;
      const cur = document.getElementById(PAGES[c][0]);
      if (cur && cur.scrollHeight > cur.clientHeight + 40) return;
      let n = -1;
      if (e.key === "ArrowDown" || e.key === "PageDown") n = c + 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") n = c - 1;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = PAGES.length - 1;
      if (n < 0) return;
      e.preventDefault();
      const now = performance.now();
      if (now < lockRef.current) return;
      lockRef.current = now + 700;
      go(n);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, baca, lb, go]);

  return (
    <div className={`ip t${tone === "l" || tone === "c" ? "l" : "d"}`} id="top">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="prog" aria-hidden="true"><i ref={bar} /></div>

      <header className="nav">
        <a href="#beranda" className="brand" onClick={jump("beranda")}><Mark size={36} /><span>IKSAPUTRA</span></a>
        <nav aria-label="Navigasi utama">
          {menu.map(([id, t]) => (
            <a key={id} href={`#${id}`} onClick={jump(id)} className={PAGES[idx][0] === id ? "on" : ""}>{t}</a>
          ))}
        </nav>
        <button className="burger" aria-label="Buka menu" aria-expanded={open} onClick={() => setOpen(true)}><Ico n="menu" /></button>
      </header>
      <div className={`scrim${open ? " on" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`drawer${open ? " on" : ""}`} aria-hidden={!open} aria-label="Menu">
        <div className="dhead">
          <span className="brand"><Mark size={36} /><span>IKSAPUTRA</span></span>
          <button className="burger" aria-label="Tutup menu" onClick={() => setOpen(false)}><Ico n="x" /></button>
        </div>
        {PAGES.map(([id, t]) => (<a key={id} className="dl" href={`#${id}`} onClick={jump(id)}>{t}</a>))}
        <p className="dfoot">PP. Annuqayah Daerah Lubangsa, Guluk-Guluk, Sumenep</p>
      </aside>

      <nav className="dots" aria-label="Halaman">
        {PAGES.map(([id, t], i) => (
          <button key={id} className={i === idx ? "on" : ""} aria-label={`Ke halaman ${t}`} aria-current={i === idx} onClick={() => go(i)}>
            <span>{t}</span>
          </button>
        ))}
      </nav>
      <div className="cnt" aria-hidden="true"><b>{pad(idx + 1)}</b><i /><span>{pad(PAGES.length)}</span></div>

      <main className="pages" ref={sc}>
        <section id="beranda" ref={hero} className={pg(0, "hero")} aria-label="Beranda">
          <div className="fit">
            <div className="wrap hc">
              <p className="badge rv" style={st(0)}>PP. Annuqayah Daerah Lubangsa, Guluk-Guluk, Sumenep</p>
              <div className="emblem rv" style={st(1)}>
                <i className="orb o1" /><i className="orb o2" />
                <Mark size={220} hero />
              </div>
              <h1 aria-label="IKSAPUTRA">
                {"IKSAPUTRA".split("").map((ch, i) => (
                  <span key={i} className="rv" aria-hidden="true" style={st(2 + i * 0.4)}>{ch}</span>
                ))}
              </h1>
              <p className="full rv" style={st(6)}>Ikatan Santri Pantai Utara</p>
              <p className="hsub rv" style={st(7)}>Organisasi daerah bagi santri asal wilayah Pantai Utara Kabupaten Sumenep di lingkungan Pondok Pesantren Annuqayah, Daerah Lubangsa.</p>
              <div className="cta rv" style={st(8)}>
                <a className="btn pri" href="#tentang" onClick={jump("tentang")}>Kenali IKSAPUTRA</a>
                <a className="btn sec2" href="#berita" onClick={jump("berita")}>Baca berita</a>
              </div>
            </div>
          </div>
          <svg className="wv" viewBox="0 0 2400 100" preserveAspectRatio="none" aria-hidden="true">
            <path d={`M0 40 ${WAVE}`} /><path d={`M0 62 ${WAVE}`} opacity=".7" /><path d={`M0 84 ${WAVE}`} opacity=".45" />
          </svg>
          <a className="hint" href="#tentang" onClick={jump("tentang")} aria-label="Gulir ke halaman berikutnya"><span>Gulir</span><i /></a>
        </section>

        <section id="tentang" className={pg(1)}>
          <Big n="01" />
          <div className="fit">
            <div className="wrap ab">
              <div>
                <Eb i={1} />
                <h2 className="rv" style={st(1)}>Tentang IKSAPUTRA</h2>
                <p className="stmt rv" style={st(2)}>IKSAPUTRA adalah ORDA (Organisasi Daerah) yang mempertemukan santri berdasarkan kesamaan daerah asal, yakni Pantai Utara Kabupaten Sumenep, di bawah naungan Daerah Lubangsa.</p>
                <div className="sts">
                  {stats.map(([n, t], i) => (<div key={n} className="rv" style={st(3 + i * 0.6)}><b>{n}</b><span>{t}</span></div>))}
                </div>
              </div>
              <div className="rv" style={st(2)}>
                <div className="dos">
                  <h3>Lembar identitas</h3>
                  <dl>{identitas.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}</dl>
                  <p className="stamp">Sejarah pendirian, nama pendiri, dan pengurus terkini belum terverifikasi. Bagian tersebut akan diisi setelah ada keterangan resmi dari pengurus.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="fungsi" className={pg(2)}>
          <Big n="02" />
          <div className="fit">
            <div className="wrap">
              <Eb i={2} />
              <h2 className="rv" style={st(1)}>Fungsi organisasi</h2>
              <p className="lead rv" style={st(2)}>Kerangka fungsi yang relevan bagi organisasi daerah santri. Belum tentu semuanya tercantum dalam AD/ART IKSAPUTRA.</p>
              <div className="fx rv" style={st(3)}>
                <div className="fl" role="tablist" aria-orientation="vertical" aria-label="Fungsi organisasi">
                  {fungsi.map(([h], i) => (
                    <button key={h} role="tab" id={`ft${i}`} aria-selected={fi === i} aria-controls="fpanel" className={`fb${fi === i ? " on" : ""}`} onClick={() => setFi(i)}>
                      <span className="fn">{pad(i + 1)}</span><span className="ft">{h}</span>
                    </button>
                  ))}
                </div>
                <div className="fd" id="fpanel" role="tabpanel" aria-labelledby={`ft${fi}`} key={fi}>
                  <span className="fnum" aria-hidden="true">{pad(fi + 1)}</span>
                  <i className="ico"><Ico n={fcur[2]} /></i>
                  <h3>{fcur[0]}</h3>
                  <p>{fcur[1]}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="struktur" className={pg(3)}>
          <Big n="03" />
          <div className="fit">
            <div className="wrap sw">
              <div>
                <Eb i={3} />
                <h2 className="rv" style={st(1)}>Struktur kepengurusan</h2>
                <p className="lead rv" style={st(2)}>Susunan resmi belum terverifikasi. Berikut unsur yang akan dilengkapi bersama pengurus.</p>
                <p className="legend rv" style={st(3)}><i />Garis putus-putus menandai bagian yang belum terverifikasi.</p>
              </div>
              <div className="tree rv" style={st(2)}>
                <Nd s={struktur[0]} top />
                <i className="tv" />
                <Nd s={struktur[1]} />
                <i className="tv" />
                <div className="trow">{struktur.slice(2, 5).map((s) => (<Nd key={s[0]} s={s} />))}</div>
                <i className="tv" />
                <Nd s={struktur[5]} />
              </div>
            </div>
          </div>
        </section>

        <section id="kegiatan" className={pg(4)}>
          <Big n="04" />
          <div className="fit">
            <div className="wrap kh">
              <div>
                <Eb i={4} />
                <h2 className="rv" style={st(1)}>Program dan kegiatan</h2>
                <p className="lead rv" style={st(2)}>Ragam kegiatan yang lazim di organisasi daerah. Program yang benar-benar terlaksana akan ditambahkan dari dokumentasi pengurus.</p>
              </div>
              <div className="arrs rv" style={st(3)}>
                <button aria-label="Geser ke kiri" onClick={() => slide(-1)}><Ico n="arl" /></button>
                <button aria-label="Geser ke kanan" onClick={() => slide(1)}><Ico n="arr" /></button>
              </div>
            </div>
            <div className="trk rv" style={st(3)} ref={track} tabIndex={0} aria-label="Daftar kegiatan, geser ke samping">
              {kegiatan.map(([h, p], i) => (
                <article className="kc" key={h}>
                  <span className="kn" aria-hidden="true">{pad(i + 1)}</span>
                  <h3>{h}</h3><p>{p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="berita" className={pg(5)}>
          <Big n="05" />
          <div className="fit">
            <div className="wrap">
              <Eb i={5} />
              <h2 className="rv" style={st(1)}>Berita IKSAPUTRA</h2>
              <p className="lead rv" style={st(2)}>Kabar kegiatan dan perkembangan organisasi.</p>
              <div className="bw">
                {utama && (
                  <article className="bf rv" style={st(3)}>
                    <Thumb src={utama.img} alt={utama.h} sizes="(max-width:900px) 100vw, 55vw" />
                    <div className="bt">
                      <span className="tg">Berita utama</span>
                      <time>{utama.tgl}</time>
                      <h3>{utama.h}</h3>
                      <p>{utama.p}</p>
                      {utama.href && <a className="lnk" href={utama.href} target="_blank" rel="noopener noreferrer">Baca selengkapnya</a>}
                    </div>
                  </article>
                )}
                <div className="bl">
                  {lain.map((b, i) => (
                    <article className="bi rv" key={b.h} style={st(4 + i)}>
                      <Thumb src={b.img} alt={b.h} sizes="120px" />
                      <div>
                        <time>{b.tgl}</time>
                        <h3>{b.h}</h3>
                        <p>{b.p}</p>
                        {b.href && <a className="lnk" href={b.href} target="_blank" rel="noopener noreferrer">Baca selengkapnya</a>}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tulis" className={pg(6)}>
          <Big n="06" />
          <div className="fit">
            <div className="wrap tw">
              <div>
                <Eb i={6} />
                <h2 className="rv" style={st(1)}>Karya tulis anggota</h2>
                <p className="lead rv" style={st(2)}>Ruang bagi santri Pantai Utara menuangkan gagasan lewat esai, puisi, cerpen, dan opini.</p>
                <div className="tabs rv" style={st(3)} role="tablist" aria-label="Jenis tulisan">
                  {JENIS.map((j) => (
                    <button key={j} role="tab" aria-selected={jenis === j} className={`tab${jenis === j ? " on" : ""}`} onClick={() => { setJenis(j); setPil(0); }}>{j}</button>
                  ))}
                </div>
                {/* TODO: tambahkan cara mengirim tulisan (kontak pengurus) setelah dikonfirmasi */}
                <ol className="toc rv" style={st(4)}>
                  {daftar.map((t, i) => (
                    <li key={`${t.judul}-${i}`}>
                      <button className={`ti${sel === t ? " on" : ""}`} aria-current={sel === t} onClick={() => setPil(i)}>
                        <span className="tx">{pad(i + 1)}</span><span className="tt">{t.judul}</span><span className="ta">{t.penulis}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rv" style={st(3)}>
                <div className="book">
                  <i className="rib" aria-hidden="true" />
                  {sel ? (
                    <article className="bk" key={sel.judul}>
                      <em>{sel.jenis}</em>
                      <h3>{sel.judul}</h3>
                      <small>Oleh {sel.penulis}</small>
                      <p>{sel.ringkas}</p>
                      <button className="rd" onClick={() => setBaca(sel)}>Baca selengkapnya <Ico n="arr" /></button>
                    </article>
                  ) : (
                    <p className="empty">Belum ada tulisan untuk jenis ini.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="galeri" className={pg(7)}>
          <Big n="07" />
          <div className="fit">
            <div className="wrap">
              <div className="gh">
                <div><Eb i={7} /><h2 className="rv" style={st(1)}>Galeri kegiatan</h2></div>
                <p className="lead rv" style={st(2)}>Dokumentasi kebersamaan santri Pantai Utara.</p>
              </div>
              <div className="mos rv" style={st(3)}>
                {galeri.map((f, i) => (
                  <button key={f.cap} className="ph" aria-label={`Buka foto: ${f.cap}`} onClick={() => setLb(i)}>
                    {f.src ? <Image src={f.src} alt={f.cap} fill sizes="(max-width:640px) 100vw, 33vw" /> : <Ico n="photo" c="phi" />}
                    <span>{f.cap}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="arsip" className={pg(8, "last")}>
          <Big n="08" />
          <div className="fit">
            <div className="wrap">
              <Eb i={8} />
              <h2 className="rv" style={st(1)}>Masih kami lengkapi</h2>
              <p className="lead rv" style={st(2)}>Arsip organisasi sedang disusun. Informasi berikut belum terverifikasi dan menunggu keterangan pengurus, alumni, atau arsip organisasi:</p>
              <ul className="drs">
                {sejarah.map((s, i) => (
                  <li key={s} className="dr rv" data-n={`No. ${pad(i + 1)}`} style={st(3 + i * 0.5)}>
                    <b>{s}</b><span className="tag">belum terverifikasi</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <footer className="foot">
            <div className="wrap fw">
              <Mark size={52} />
              <div>
                <b>IKSAPUTRA</b>
                <p>Ikatan Santri Pantai Utara, PP. Annuqayah Daerah Lubangsa, Guluk-Guluk, Sumenep, Jawa Timur.</p>
                {/* TODO: tambahkan kontak resmi (Instagram, WhatsApp, email) setelah dikonfirmasi pengurus */}
                <small>Profil ini masih dalam penyusunan dan belum menjadi sejarah resmi organisasi.</small>
              </div>
            </div>
          </footer>
        </section>
      </main>

      {baca && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={baca.judul} onClick={() => setBaca(null)}>
          <article className="paper" onClick={(e) => e.stopPropagation()}>
            <button ref={closeRef} className="mclose" aria-label="Tutup" onClick={() => setBaca(null)}><Ico n="x" /></button>
            <em>{baca.jenis}</em>
            <h3>{baca.judul}</h3>
            <small>Oleh {baca.penulis}</small>
            {baca.isi.map((p, i) => (<p key={i}>{p}</p>))}
            {baca.href && <p><a href={baca.href} target="_blank" rel="noopener noreferrer">Sumber asli</a></p>}
          </article>
        </div>
      )}

      {lb !== null && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={galeri[lb].cap} onClick={() => setLb(null)}>
          <button ref={lbRef} className="lbc" aria-label="Tutup" onClick={() => setLb(null)}><Ico n="x" /></button>
          <button className="lbn l" aria-label="Foto sebelumnya" onClick={(e) => { e.stopPropagation(); setLb((lb - 1 + galeri.length) % galeri.length); }}><Ico n="arl" /></button>
          <button className="lbn r" aria-label="Foto berikutnya" onClick={(e) => { e.stopPropagation(); setLb((lb + 1) % galeri.length); }}><Ico n="arr" /></button>
          <figure className="lbf" onClick={(e) => e.stopPropagation()}>
            <div className="lbi">
              {galeri[lb].src ? <Image src={galeri[lb].src as string} alt={galeri[lb].cap} fill sizes="92vw" /> : <Ico n="photo" c="phi" />}
            </div>
            <figcaption>{galeri[lb].cap}<span>{pad(lb + 1)} / {pad(galeri.length)}</span></figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}