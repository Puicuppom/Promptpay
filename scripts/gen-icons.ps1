Add-Type -AssemblyName System.Drawing

function Make-Icon {
    param([int]$Size, [string]$Path)
    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'AntiAlias'
    $g.Clear([System.Drawing.Color]::FromArgb(255, 0, 70, 140))
    $white = [System.Drawing.Brushes]::White
    $pad = [int]($Size * 0.15)
    $inner = $Size - $pad * 2
    $g.FillRectangle($white, $pad, $pad, $inner, $inner)
    $blue = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 0, 70, 140))
    $u = [int]($inner / 7)
    $ox = $pad + $u
    $oy = $pad + $u
    for ($r = 0; $r -lt 3; $r++) {
        for ($c = 0; $c -lt 3; $c++) {
            if ($r -eq 1 -and $c -eq 1) { continue }
            $g.FillRectangle($blue, $ox + $c * $u * 2, $oy + $r * $u * 2, $u, $u)
        }
    }
    $blue.Dispose()
    $g.Dispose()
    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

$root = 'D:\PUICUPPOM\[PUI]\[WebApp] ส่วนตัว\QR-PUI'

Make-Icon 180 (Join-Path $root 'apple-touch-icon.png')
Make-Icon 192 (Join-Path $root 'icon-192.png')
Make-Icon 512 (Join-Path $root 'icon-512.png')
Write-Host "Icons saved to $root"
