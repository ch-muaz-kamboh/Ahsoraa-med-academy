Add-Type -AssemblyName System.IO.Compression.FileSystem

$docxFiles = Get-ChildItem -Path "." -Filter "*.docx"

foreach ($file in $docxFiles) {
    Write-Host "Processing: $($file.Name)"
    $zip = [System.IO.Compression.ZipFile]::OpenRead($file.FullName)
    $entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
    
    if ($entry) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $xmlText = $reader.ReadToEnd()
        $stream.Close()
        $zip.Dispose()
        
        [xml]$xml = $xmlText
        $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
        $ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
        
        $paragraphs = $xml.SelectNodes('//w:p', $ns)
        $lines = New-Object System.Collections.Generic.List[string]
        
        foreach ($p in $paragraphs) {
            $tNodes = $p.SelectNodes('.//w:t', $ns)
            $line = ""
            foreach ($t in $tNodes) {
                $line += $t.InnerText
            }
            if ($line.Trim().Length -gt 0) {
                $lines.Add($line.Trim())
            }
        }
        
        $outName = "$($file.BaseName).txt"
        $lines | Out-File -FilePath $outName -Encoding utf8
        Write-Host "Extracted $($lines.Count) lines to $outName"
    } else {
        $zip.Dispose()
    }
}
