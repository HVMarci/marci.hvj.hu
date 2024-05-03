# Load WinSCP .NET assembly
Add-Type -Path "C:\Program Files (x86)\WinSCP\WinSCPnet.dll"

# Set up session options
$sessionOptions = New-Object WinSCP.SessionOptions
$sessionOptions.Protocol = [WinSCP.Protocol]::Sftp
$sessionOptions.HostName = "marci.hvj.hu"
$sessionOptions.UserName = "marci.hvj.hu"
$sessionOptions.Password = "Sb1tPVLGM"
$sessionOptions.SshHostKeyFingerprint = "ssh-ed25519 255 4q8SHbvTCSeTBxKkMusYIXvHV1vA+04fdu6xFbRhK7g"
# Use this if your server uses SSH key authentication
# $sessionOptions.SshPrivateKeyPath = "C:\path\to\your\private\key.ppk"

$session = New-Object WinSCP.Session

# Before opening the session
$session.SessionLogPath = "C:\Users\horva\Coding\marci.hvj.hu\session.log"

try {
    # Connect
    $session.Open($sessionOptions)

    # Synchronization settings - local to remote
    $synchronizationMode = [WinSCP.SynchronizationMode]::Remote
    $localDirectory = "C:\Users\horva\Coding\marci.hvj.hu"
    $remoteDirectory = "/"

    # File mask to exclude .ps1 files
    $transferOptions = New-Object WinSCP.TransferOptions
    $transferOptions.FileMask = "| *.ps1; .git/; .gitignore; session.log; .vscode/; .htaccess;"

    # Perform the synchronization
    $synchronizationResult = $session.SynchronizeDirectories($synchronizationMode, $localDirectory, $remoteDirectory, $False, $False, [WinSCP.SynchronizationCriteria]::Time, $transferOptions)

    # List the changes
    foreach ($change in $synchronizationResult.Uploads) {
        Write-Host ("Change: " + $change.FileName + ", Operation: " + $change.Operation)
    }

    # Check if any changes were detected
    if ($synchronizationResult.Uploads.Count -eq 0) {
        Write-Host "No changes to synchronize."
    }

    # Throw on any error
    $synchronizationResult.Check()
}
catch {
    Write-Host "Error: $($_.Exception.Message)"
}
finally {
    # Disconnect, clean up
    $session.Dispose()
}

Write-Host "Synchronization complete."
