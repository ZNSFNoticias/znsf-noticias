$lines = Get-Content 'c:\Users\HP ZBook\Documents\david\zona norte san fernando noticias\pagina web\sql_inserts.sql'
$start = ($lines | Select-String "-- Noticias").LineNumber - 1
$copyIndex = ($lines | Select-String "COPY public.noticias").LineNumber - 1
$backslashIndex = ($lines | Select-String "^\\.$").LineNumber - 1
$dataLines = $lines[($copyIndex + 1)..($backslashIndex - 1)]
$inserts = @()
foreach ($line in $dataLines) {
    $fields = $line -split "`t"
    $id = $fields[0]
    $titulo = $fields[1].Replace("'", "''")
    $contenido = $fields[2]
    $fecha = $fields[3]
    $categoria = $fields[4].Replace("'", "''")
    $imagen = $fields[5]
    $autor = if ($fields[6] -eq '\N') { 'NULL' } else { $fields[6] }
    $created_at = $fields[7]
    $likes = $fields[8]
    $vistas = $fields[9]
    $categoria_id = $fields[10]
    $autor_id = $fields[11]
    $editor_id = if ($fields[12] -eq '\N') { 'NULL' } else { $fields[12] }
    $creado = $fields[13]
    $editado = if ($fields[14] -eq '\N') { 'NULL' } else { $fields[14] }
    $insert = "($id, '$titulo', $$$contenido$$, '$fecha', '$categoria', '$imagen', $autor, '$created_at', $likes, $vistas, $categoria_id, $autor_id, $editor_id, '$creado', $editado)"
    $inserts += $insert
}
$newContent = $lines[0..($start)] + "INSERT INTO public.noticias (id, titulo, contenido, fecha, categoria, imagen, autor, created_at, likes, vistas, categoria_id, autor_id, editor_id, creado, editado) VALUES" + "`n" + ($inserts -join ",`n") + ";"
$newContent | Out-File 'c:\Users\HP ZBook\Documents\david\zona norte san fernando noticias\pagina web\sql_inserts.sql' -Encoding UTF8