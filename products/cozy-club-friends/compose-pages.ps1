# Print pages @ ~200dpi (fast PDF) + keep quality. Color guide top-left.
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$outDir = Join-Path $root "pages"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$pageW = 1700
$pageH = 2200
$margin = 60
$guidePad = 28
$guideMax = 360
$guideBorder = 6

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$enc = [System.Drawing.Imaging.Encoder]::Quality
$eps = New-Object System.Drawing.Imaging.EncoderParameters 1
$eps.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter $enc, 92L

1..18 | ForEach-Object {
  $n = "{0:D2}" -f $_
  $line = [System.Drawing.Bitmap]::FromFile((Join-Path $root "line\$n.png"))
  $color = [System.Drawing.Bitmap]::FromFile((Join-Path $root "color\$n.png"))
  $page = New-Object System.Drawing.Bitmap $pageW, $pageH
  $g = [System.Drawing.Graphics]::FromImage($page)
  $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

  $mainW = $pageW - 2 * $margin
  $mainH = $pageH - 2 * $margin - 30
  $scale = [Math]::Min($mainW / [double]$line.Width, $mainH / [double]$line.Height)
  $dw = [int]($line.Width * $scale)
  $dh = [int]($line.Height * $scale)
  $dx = $margin + [int](($mainW - $dw) / 2)
  $dy = $margin + 30 + [int](($mainH - $dh) / 2)
  $g.DrawImage($line, $dx, $dy, $dw, $dh)

  $gScale = [Math]::Min($guideMax / [double]$color.Width, $guideMax / [double]$color.Height)
  $gw = [int]($color.Width * $gScale)
  $gh = [int]($color.Height * $gScale)
  $gx = $guidePad; $gy = $guidePad
  $bg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $g.FillRectangle($bg, $gx - 10, $gy - 10, $gw + 20, $gh + 20)
  $bg.Dispose()
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(198, 163, 90), $guideBorder)
  $g.DrawRectangle($pen, $gx - 3, $gy - 3, $gw + 6, $gh + 6)
  $pen.Dispose()
  $g.DrawImage($color, $gx, $gy, $gw, $gh)
  $g.Dispose()

  $pngPath = Join-Path $outDir "$n.png"
  $jpgPath = Join-Path $outDir "$n.jpg"
  $page.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $page.Save($jpgPath, $jpegCodec, $eps)
  $page.Dispose(); $line.Dispose(); $color.Dispose()
  Write-Host "wrote $n"
}
Write-Host "done"
