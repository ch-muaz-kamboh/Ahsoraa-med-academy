Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\ASAD\.gemini\antigravity-ide\brain\6e217052-2156-463b-baa9-bcba7e26af6b\.user_uploaded\media_1791797452693.png"
$fullLogoDest = "g:\data\ahsora demo\public\ahsora-logo.png"
$fullLogoDest2 = "g:\data\ahsora demo\public\logo.png"
$emblemDest = "g:\data\ahsora demo\public\ahsora-emblem.png"
$emblemDest2 = "g:\data\ahsora demo\public\logo-icon.png"

# Copy full logo
Copy-Item -Path $srcPath -Destination $fullLogoDest -Force
Copy-Item -Path $srcPath -Destination $fullLogoDest2 -Force
Write-Output "Copied full logo to $fullLogoDest and $fullLogoDest2"

# Now let's inspect the emblem portion
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Bounding box of the emblem
# In the 1024x277 image, the emblem is on the left side:
# Let's find where the emblem ends before the text starts.
# Let's inspect columns from x=280 to 350
$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

for ($x = 0; $x -lt 340; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.A -gt 25) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "Emblem bounds: X: $minX to $maxX, Y: $minY to $maxY"

$width = ($maxX - $minX) + 1
$height = ($maxY - $minY) + 1

$emblemBmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($emblemBmp)
$srcRect = New-Object System.Drawing.Rectangle($minX, $minY, $width, $height)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$emblemBmp.Save($emblemDest, [System.Drawing.Imaging.ImageFormat]::Png)
$emblemBmp.Save($emblemDest2, [System.Drawing.Imaging.ImageFormat]::Png)
$emblemBmp.Dispose()
$bmp.Dispose()

Write-Output "Saved emblem to $emblemDest ($width x $height)"
