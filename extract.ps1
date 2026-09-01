Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxFile = Resolve-Path "Ahsora Meds Academy Complete Website Architecture Developer Requirements pdf.docx"
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxFile)
$entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xmlText = $reader.ReadToEnd()
$stream.Close()
$zip.Dispose()

[xml]$xml = $xmlText
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')

$paragraphs = $xml.SelectNodes('//w:p', $ns)
$result = New-Object System.Collections.Generic.List[string]

foreach ($p in $paragraphs) {
    $tNodes = $p.SelectNodes('.//w:t', $ns)
    $line = ""
    foreach ($t in $tNodes) {
        $line += $t.InnerText
    }
    if ($line.Trim().Length -gt 0) {
        $result.Add($line)
    }
}

$result | Out-File -FilePath "extracted_requirements.txt" -Encoding utf8
Write-Output "Successfully extracted $($result.Count) paragraphs."
