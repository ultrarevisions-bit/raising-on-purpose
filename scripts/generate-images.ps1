# Main generator. Dot-sources helpers and writes all cover assets.

$Here = Split-Path -Parent $MyInvocation.MyCommand.Path
. (Join-Path $Here "generate-images-helpers.ps1")

$Root = Resolve-Path (Join-Path $Here "..")
$PostsDir = Join-Path $Root "public\images\posts"
$DefaultsDir = Join-Path $Root "public\images\defaults"

# -- color helpers ------------------------------------------------------------
$deepClay   = @(125, 60, 41)    # #7D3C29
$clay       = @(181, 90, 56)    # #B55A38
$terracotta = @(201, 111, 74)   # #C96F4A
$terr300    = @(226, 169, 140)  # #E2A98C
$terr200    = @(237, 201, 180)  # #EDC9B4
$terr100    = @(246, 228, 216)  # #F6E4D8
$cream100   = @(250, 246, 239)  # #FAF6EF
$cream400   = @(232, 217, 200)  # #E8D9C8
$sageDark   = @(93, 107, 80)    # #5D6B50
$sage       = @(122, 139, 105)  # #7A8B69
$sageLight  = @(150, 168, 133)  # #96A885

function New-Cover {
  param($File, $StartCol, $EndCol, $Circle, $Arch, $Overlay)
  $bmp, $g = New-Bitmap 1200 1800
  New-Gradient $g 1200 1800 $StartCol $EndCol 90
  foreach ($c in $Overlay) { Add-Circle $g $c[0] $c[1] $c[2] $c[3] $Circle }
  Add-Arch $g 300 900 680 1150 120 $Arch
  Add-Circle $g 600 400 140 60 $cream100
  Save-Bitmap $bmp $g (Join-Path $PostsDir $File)
}

function New-DefaultArt {
  param($File, $H, $Angle)
  $bmp, $g = New-Bitmap 1200 $H
  New-Gradient $g 1200 $H $deepClay $terracotta $Angle
  Add-Circle $g 950 ($H * 0.75) 340 90 $terr200
  Add-Circle $g 250 ($H * 0.25) 200 70 $terr300
  Add-Arch $g 400 ($H + 220) 210 ($H + 260) 130 $cream100
  Save-Bitmap $bmp $g (Join-Path $DefaultsDir $File)
}

# -- featured images ----------------------------------------------------------
Write-Host "Generating post covers..."
New-Cover "connection-based-discipline.png"    $deepClay   $clay       $terr200  $cream100 @()
New-Cover "cried-in-the-pantry.png"            $sageDark   $sage       $cream100 $terr200  @()
New-Cover "toddler-meltdowns.png"              $clay       $terracotta $terr200  $cream100 @()
New-Cover "morning-routine.png"                $cream400   $cream100   $terr300  $terracotta @()
New-Cover "free-printable-chore-charts.png"    $sage       $sageLight  $cream100 $terr300  @()
New-Cover "printable-feelings-chart.png"       $clay       $terracotta $terr200  $cream100 @()

# -- defaults -----------------------------------------------------------------
Write-Host "Generating defaults..."
New-DefaultArt "og-default.png"    630 0
New-DefaultArt "featured.png"      1800 90

# -- app icon -----------------------------------------------------------------
Write-Host "Generating app icon..."
$bmp, $g = New-Bitmap 64 64
$g.Clear([System.Drawing.Color]::FromArgb(201, 111, 74))
Add-Arch $g 12 52 12 56 255 $cream100
Add-Circle $g 32 30 11 255 $cream100
Save-Bitmap $bmp $g (Join-Path $Root "app\icon.png")

Write-Host "Done."