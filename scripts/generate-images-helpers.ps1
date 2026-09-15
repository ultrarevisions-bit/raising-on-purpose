# Generates branded cover art for Raising On Purpose:
#   - post featured images (1200x1800, Pinterest-friendly 2:3)
#   - default OG share image (1200x630)
#   - default featured fallback (1200x1800)
#   - app icon (app/icon.png)
#
# Run: powershell -ExecutionPolicy Bypass -File scripts\generate-images.ps1
#      or: npm run assets:images

Add-Type -AssemblyName System.Drawing

function New-Gradient {
  param($G, $W, $H, $Start, $End, [int]$Angle = 90)
  $rect = New-Object System.Drawing.Rectangle 0, 0, $W, $H
  $c1 = [System.Drawing.Color]::FromArgb($Start[0], $Start[1], $Start[2])
  $c2 = [System.Drawing.Color]::FromArgb($End[0], $End[1], $End[2])
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $c1, $c2, $Angle
  $G.FillRectangle($brush, $rect)
  $brush.Dispose()
}

function Add-Circle {
  param($G, $CX, $CY, $R, $A, $Color)
  $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($A, $Color[0], $Color[1], $Color[2]))
  $G.FillEllipse($brush, ($CX - $R), ($CY - $R), (2 * $R), (2 * $R))
  $brush.Dispose()
}

function Add-Arch {
  param($G, $X0, $X1, $Top, $Bottom, $A, $Color)
  $arcW = $X1 - $X0
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.StartFigure()
  $path.AddLine($X0, $Bottom, $X0, ($Top + ($arcW / 2)))
  $path.AddArc($X0, $Top, $arcW, $arcW, 180, 180)
  $path.AddLine($X1, ($Top + ($arcW / 2)), $X1, $Bottom)
  $path.CloseFigure()
  $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($A, $Color[0], $Color[1], $Color[2]))
  $G.FillPath($brush, $path)
  $brush.Dispose()
  $path.Dispose()
}

function New-Bitmap {
  param($W, $H)
  $bmp = New-Object System.Drawing.Bitmap $W, $H
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  return @($bmp, $g)
}

function Save-Bitmap {
  param($Bmp, $G, $Out)
  $dir = Split-Path -Parent $Out
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $Bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
  $G.Dispose()
  $Bmp.Dispose()
  Write-Host "  -> $Out"
}