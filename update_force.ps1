Write-Output "Starting update..."

$newestVersionString = ""
$req = Invoke-WebRequest https://github.com/DerTyp876/obs-twitch-camera-frame/releases/latest

foreach ($tag in $req.ParsedHtml.body.getElementsByTagName('h1')) {
  if ($tag.innerText[0] -eq "v") {
    $newestVersionString = $tag.innerText
  }
}

Write-Output "Updating to newer version..."

if (Test-Path "./config.js") {
  if (Test-Path "./config-old.js") {
    Remove-Item config-old.js
  }
  Copy-Item "./config.js" -Destination "./config-old.js"
  Write-Output "config.js has been copied"
}


Remove-Item *  -Recurse -Force -Exclude config-old.js

mkdir ./temp
attrib +h ./temp
Write-Output "Downloading newer version..."
Invoke-WebRequest -Uri "https://github.com/DerTyp876/obs-twitch-camera-frame/archive/refs/tags/$newestVersionString.zip" -OutFile "./temp/$newestVersionString.zip"
Write-Output "Extracting archive..."
Expand-Archive -Path "./temp/$newestVersionString.zip" -DestinationPath "./temp/"

Get-ChildItem -Path "./temp/obs-twitch-camera-frame-$($newestVersionString -replace 'v')" -Recurse | Move-Item -Destination "./"

Remove-Item "./temp" -Recurse -Force -Confirm

Write-Output "You are now up to date again!"

Write-Output "You need to add your API-Key again to the config.js!"
pause