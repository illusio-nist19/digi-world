# Package 5 children's story ebooks DW-EBK-009..013
$ErrorActionPreference = "Stop"
$assets = "C:\Users\ILLUSIONIST\.cursor\projects\c-Users-ILLUSIONIST-Projects-digi-world\assets"
$root = "C:\Users\ILLUSIONIST\Projects\digi-world"
$desktop = "C:\Users\ILLUSIONIST\Desktop\website products\Childer e-book"
$tools = "$root\products\_storybook-tools"

$books = @(
  @{ sku="DW-EBK-009"; slug="the-kindness-cave"; pdf="The-Kindness-Cave.pdf"; prefix="b9"; title="The Kindness Cave"; wisdom="Real treasure grows when you share it." },
  @{ sku="DW-EBK-010"; slug="ember-who-shared-his-fire"; pdf="Ember-Who-Shared-His-Fire.pdf"; prefix="b10"; title="Ember Who Shared His Fire"; wisdom="Share your gifts. Warmth grows when it travels." },
  @{ sku="DW-EBK-011"; slug="the-brave-little-lantern"; pdf="The-Brave-Little-Lantern.pdf"; prefix="b11"; title="The Brave Little Lantern"; wisdom="Courage is taking the next kind step while afraid." },
  @{ sku="DW-EBK-012"; slug="the-whispering-market"; pdf="The-Whispering-Market.pdf"; prefix="b12"; title="The Whispering Market"; wisdom="Pause. Listen. Then choose." },
  @{ sku="DW-EBK-013"; slug="the-fox-who-kept-his-word"; pdf="The-Fox-Who-Kept-His-Word.pdf"; prefix="b13"; title="The Fox Who Kept His Word"; wisdom="Mean what you say. Finish what you promise." }
)

if (-not (Test-Path "$tools\node_modules\pdf-lib")) {
  Set-Location $tools
  npm install --no-fund --no-audit
}

New-Item -ItemType Directory -Force -Path $desktop, "$root\products\releases", "$root\backend\vault", "$root\frontend\public\vault" | Out-Null

foreach ($b in $books) {
  $prod = "$root\products\$($b.slug)"
  $pages = "$prod\pages"
  $social = "$prod\social-kit"
  $imgOut = "$root\frontend\public\images\products\$($b.slug)"
  New-Item -ItemType Directory -Force -Path $pages, $social, $imgOut | Out-Null

  $coverSrc = "$assets\$($b.prefix)-cover.png"
  if (-not (Test-Path $coverSrc)) { throw "Missing cover $coverSrc" }
  Copy-Item $coverSrc "$prod\cover.png" -Force

  1..15 | ForEach-Object {
    $n = "{0:D2}" -f $_
    $src = "$assets\$($b.prefix)-$n.png"
    if (-not (Test-Path $src)) { throw "Missing page $src" }
    Copy-Item $src "$pages\$n.png" -Force
  }
  $endSrc = "$assets\$($b.prefix)-end.png"
  if (Test-Path $endSrc) { Copy-Item $endSrc "$pages\end.png" -Force }

  Copy-Item "$prod\cover.png" "$imgOut\01.png" -Force
  Copy-Item "$pages\05.png" "$imgOut\02.png" -Force
  Copy-Item "$pages\08.png" "$imgOut\03.png" -Force

  $map = @(
    @{s="$($b.prefix)-cover.png"; d="01-cover.png"},
    @{s="$($b.prefix)-01.png"; d="02-page01.png"},
    @{s="$($b.prefix)-05.png"; d="03-scene.png"},
    @{s="$($b.prefix)-07.png"; d="04-dialogue.png"},
    @{s="$($b.prefix)-08.png"; d="05-wisdom.png"},
    @{s="$($b.prefix)-10.png"; d="06-turn.png"},
    @{s="$($b.prefix)-14.png"; d="07-closing.png"},
    @{s="$($b.prefix)-15.png"; d="08-end.png"}
  )
  foreach ($m in $map) {
    Copy-Item "$assets\$($m.s)" "$social\$($m.d)" -Force
  }

  $cap = @"
$($b.title) - Social captions
Digi World · $($b.sku)

INSTAGRAM / FACEBOOK carousel (01-08):
Hook: Kids need this wisdom before the world gets loud.

Caption:
$($b.title) - a 15-page illustrated story with funny dialogues and one lesson that sticks:
$($b.wisdom)

Painterly art. Instant PDF. Perfect bedtime / storytime.

Link in bio · Digi World
#childrensbooks #bedtimestory #kidsbooks #parenting #momlife #dadlife #digiworld

TIKTOK:
On-screen: "$($b.wisdom)"
Caption: Original 15-page kids storybook - funny + wise. Link in bio.
#parentsoftiktok #storytime #kidsbooks #momtok
"@
  Set-Content -Encoding UTF8 -Path "$social\CAPTIONS.txt" -Value $cap

  $start = @"
$($b.title.ToUpper())
Digi World · Storybook · $($b.sku)
Ages 3-8 · Personal family license

WHAT YOU GOT
1. $($b.pdf) - cover + 15 illustrated pages (+ end)
2. STORY.txt - full text for read-aloud
3. LICENSE.txt
4. social-kit/ - TikTok · Instagram · Facebook carousel PNGs + captions

HOW TO USE
Open the PDF in landscape on tablet/laptop (full-bleed story art - not a phone screenshot).
Dim lights. Read dialogues aloud. Wisdom: $($b.wisdom)

SOCIAL
Post social-kit images 01-08 with CAPTIONS.txt.

SUPPORT hello@digi-world.online · 7-day replace if corrupt
"@
  Set-Content -Encoding UTF8 -Path "$prod\00-START-HERE.txt" -Value $start

  $lic = @"
$($b.title) - LICENSE
Digi World · $($b.sku)

YOU MAY: personal family use, print for bedtime, share 1-2 page screenshots promoting your purchase.
YOU MAY NOT: resell, rebrand, marketplace dump, commercial classroom use without studio licence.
hello@digi-world.online
"@
  Set-Content -Encoding UTF8 -Path "$prod\LICENSE.txt" -Value $lic

  Copy-Item "$tools\build-pdf.mjs" "$prod\build-pdf.mjs" -Force
  Copy-Item "$tools\package.json" "$prod\package.json" -Force
  if (-not (Test-Path "$prod\node_modules\pdf-lib")) {
    New-Item -ItemType Directory -Force -Path "$prod\node_modules" | Out-Null
    Copy-Item "$tools\node_modules\*" "$prod\node_modules\" -Recurse -Force
  }

  Set-Location $prod
  $env:PDF_NAME = $b.pdf
  node build-pdf.mjs

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
