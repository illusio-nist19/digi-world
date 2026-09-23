# Package 5 children's 9-page story ebooks DW-EBK-019..023
$ErrorActionPreference = "Stop"
$assets = "C:\Users\ILLUSIONIST\.cursor\projects\c-Users-ILLUSIONIST-Projects-digi-world\assets"
$root = "C:\Users\ILLUSIONIST\Projects\digi-world"
$desktop = "C:\Users\ILLUSIONIST\Desktop\website products\Childer e-book"
$tools = "$root\products\_storybook-tools"

$books = @(
  @{ sku="DW-EBK-019"; slug="luna-and-the-three-soft-chairs"; pdf="Luna-and-the-Three-Soft-Chairs.pdf"; prefix="b19"; title="Luna and the Three Soft Chairs"; wisdom="Ask before you borrow - kindness keeps homes warm." },
  @{ sku="DW-EBK-020"; slug="pip-and-the-sky-beans"; pdf="Pip-and-the-Sky-Beans.pdf"; prefix="b20"; title="Pip and the Sky Beans"; wisdom="Courage climbs; greed falls." },
  @{ sku="DW-EBK-021"; slug="the-speckled-duckling"; pdf="The-Speckled-Duckling.pdf"; prefix="b21"; title="The Speckled Duckling"; wisdom="Growing different still means you belong." },
  @{ sku="DW-EBK-022"; slug="cinders-and-the-kind-slippers"; pdf="Cinders-and-the-Kind-Slippers.pdf"; prefix="b22"; title="Cinders and the Kind Slippers"; wisdom="Kindness is the real glass slipper." },
  @{ sku="DW-EBK-023"; slug="tiny-paws-big-rescue"; pdf="Tiny-Paws-Big-Rescue.pdf"; prefix="b23"; title="Tiny Paw's Big Rescue"; wisdom="Even tiny paws can keep a big promise." }
)

if (-not (Test-Path "$tools\node_modules\pdf-lib")) {
  Set-Location $tools
  npm install --no-fund --no-audit
}

New-Item -ItemType Directory -Force -Path $desktop, "$root\products\releases", "$root\backend\vault", "$root\frontend\public\vault" | Out-Null

foreach ($b in $books) {
  Write-Host "=== $($b.sku) $($b.title) ==="
  $prod = "$root\products\$($b.slug)"
  $pages = "$prod\pages"
  $social = "$prod\social-kit"
  $imgOut = "$root\frontend\public\images\products\$($b.slug)"
  New-Item -ItemType Directory -Force -Path $pages, $social, $imgOut | Out-Null

  $coverSrc = "$assets\$($b.prefix)-cover.png"
  if (-not (Test-Path $coverSrc)) { throw "Missing cover $coverSrc" }
  Copy-Item $coverSrc "$prod\cover.png" -Force

  1..9 | ForEach-Object {
    $n = "{0:D2}" -f $_
    $src = "$assets\$($b.prefix)-$n.png"
    if (-not (Test-Path $src)) { throw "Missing page $src" }
    Copy-Item $src "$pages\$n.png" -Force
  }

  Copy-Item "$prod\cover.png" "$imgOut\01.png" -Force
  Copy-Item "$pages\05.png" "$imgOut\02.png" -Force
  Copy-Item "$pages\08.png" "$imgOut\03.png" -Force

  $map = @(
    @{s="$($b.prefix)-cover.png"; d="01-cover.png"},
    @{s="$($b.prefix)-01.png"; d="02-page01.png"},
    @{s="$($b.prefix)-03.png"; d="03-funny.png"},
    @{s="$($b.prefix)-05.png"; d="04-turn.png"},
    @{s="$($b.prefix)-07.png"; d="05-climax.png"},
    @{s="$($b.prefix)-08.png"; d="06-wisdom.png"},
    @{s="$($b.prefix)-09.png"; d="07-end.png"}
  )
  foreach ($m in $map) {
    Copy-Item "$assets\$($m.s)" "$social\$($m.d)" -Force
  }

  $cap = @"
$($b.title) - Social captions
Digi World · $($b.sku)

INSTAGRAM / FACEBOOK carousel (01-07 JPG):
Hook: Kids need this wisdom before the world gets loud.

Caption:
$($b.title) — a 9-page illustrated story with funny dialogues and one lesson that sticks:
$($b.wisdom)

Painterly 3D story art. Instant PDF. Perfect bedtime / storytime.

Link in bio · Digi World
#childrensbooks #bedtimestory #kidsbooks #parenting #momlife #dadlife #digiworld #storytime

TIKTOK (upload JPG carousel or screen-record PDF pages):
On-screen: "$($b.wisdom)"
Caption: Original 9-page kids storybook — funny + wise. Link in bio.
#parentsoftiktok #storytime #kidsbooks #momtok #bedtimestories
"@
  Set-Content -Encoding UTF8 -Path "$social\CAPTIONS.txt" -Value $cap

  $start = @"
$($b.title.ToUpper())
Digi World · Storybook · $($b.sku)
Ages 3-8 · Personal family license

WHAT YOU GOT
1. $($b.pdf) — cover + 9 illustrated story pages (landscape full-bleed art)
2. STORY.txt — full text for read-aloud
3. LICENSE.txt
4. social-kit/ — TikTok · Instagram · Facebook carousel images + captions

HOW TO USE
Open the PDF in landscape on tablet/laptop (full-bleed story art — not a phone screenshot).
Dim lights. Read dialogues aloud. Wisdom: $($b.wisdom)

SOCIAL
Post social-kit images with CAPTIONS.txt (JPG preferred for TikTok).

SUPPORT hello@digi-world.online · 7-day replace if corrupt
"@
  Set-Content -Encoding UTF8 -Path "$prod\00-START-HERE.txt" -Value $start

  $lic = @"
$($b.title) — LICENSE
Digi World · $($b.sku)

YOU MAY: personal family use, print for bedtime, share 1-2 page screenshots promoting your purchase.
YOU MAY NOT: resell, rebrand, marketplace dump, commercial classroom use without studio licence.
hello@digi-world.online
"@
  Set-Content -Encoding UTF8 -Path "$prod\LICENSE.txt" -Value $lic

  Copy-Item "$tools\build-pdf-9.mjs" "$prod\build-pdf.mjs" -Force
  Copy-Item "$tools\package.json" "$prod\package.json" -Force
  if (-not (Test-Path "$prod\node_modules\pdf-lib")) {
    New-Item -ItemType Directory -Force -Path "$prod\node_modules" | Out-Null
    Copy-Item "$tools\node_modules\*" "$prod\node_modules\" -Recurse -Force
  }

  Set-Location $prod
  $env:PDF_NAME = $b.pdf
  $env:PAGE_COUNT = "9"
  node build-pdf.mjs

  Set-Location "$root\frontend"
  node --input-type=module -e @"
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
const social = process.argv[1];
for (const f of fs.readdirSync(social).filter(x => x.endsWith('.png'))) {
  const out = path.join(social, f.replace(/\.png$/i, '.jpg'));
  await sharp(path.join(social, f)).jpeg({ quality: 90, mozjpeg: true }).toFile(out);
  fs.unlinkSync(path.join(social, f));
}
const cover = path.join(social, '..', 'cover.png');
const heroJpg = path.join(process.argv[2], '01.jpg');
await sharp(cover).jpeg({ quality: 90, mozjpeg: true }).resize({ width: 1600, withoutEnlargement: true }).toFile(heroJpg);
console.log('jpg ok', social);
"@ "$social" "$imgOut"

  $pack = "$prod\_pack"
  if (Test-Path $pack) { Remove-Item $pack -Recurse -Force }
  New-Item -ItemType Directory -Force -Path $pack | Out-Null
  Copy-Item "$prod\00-START-HERE.txt","$prod\LICENSE.txt","$prod\STORY.txt","$prod\$($b.pdf)" $pack -Force
  Copy-Item $social "$pack\social-kit" -Recurse -Force

  $zipName = "$($b.sku)-$($b.slug).zip"
  $zipPath = "$root\products\releases\$zipName"
  if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
  Compress-Archive -Path "$pack\*" -DestinationPath $zipPath -Force
  Copy-Item $zipPath "$root\backend\vault\$zipName" -Force
  Copy-Item $zipPath "$root\frontend\public\vault\$zipName" -Force

  $deskBook = Join-Path $desktop $b.title
  New-Item -ItemType Directory -Force -Path $deskBook | Out-Null
  Copy-Item "$pack\*" $deskBook -Recurse -Force
  Copy-Item $zipPath (Join-Path $desktop $zipName) -Force

  Write-Host "OK $($b.sku) $zipName"
}

Write-Host "ALL DONE"
Get-ChildItem $desktop | Select-Object Name, Length
