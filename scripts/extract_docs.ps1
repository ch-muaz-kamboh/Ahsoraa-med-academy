Add-Type -AssemblyName System.IO.Compression.FileSystem

function Extract-Docx($filePath, $outPath) {
    if (-not (Test-Path $filePath)) {
        Write-Warning "File not found: $filePath"
        return
    }
    $zip = [System.IO.Compression.ZipFile]::OpenRead($filePath)
    $entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
    if ($entry) {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $xmlText = $reader.ReadToEnd()
        $stream.Close()
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
                $lines.Add($line)
            }
        }
        $lines | Out-File -FilePath $outPath -Encoding utf8
        Write-Output "Extracted $($lines.Count) lines to $outPath"
    }
    $zip.Dispose()
}

Extract-Docx "Keep in mind that only the blogs page can be cont....docx" "Keep_in_mind.txt"
Extract-Docx "https___ahsoraa-med-academy.vercel.app_resources.....docx" "resources_audit.txt"
Extract-Docx "https___ahsoraa-med-academy.vercel.app_courses.....docx" "courses_audit.txt"
Extract-Docx "https___ahsoraa-med-academy.vercel.app_universiti....docx" "universities_audit.txt"
