[Setup]
AppName=Infinity Browser
AppVersion=1.0.0
DefaultDirName={pf}\Infinity Browser
DefaultGroupName=Infinity Browser
OutputDir=dist
OutputBaseFilename=InfinityBrowserSetup
Compression=lzma2
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin
UninstallDisplayIcon={app}\Infinity Browser.exe

[Files]
Source: "dist\Infinity Browser-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Infinity Browser"; Filename: "{app}\Infinity Browser.exe"
Name: "{autodesktop}\Infinity Browser"; Filename: "{app}\Infinity Browser.exe"

[Run]
Filename: "{app}\Infinity Browser.exe"; Description: "Launch Infinity Browser"; Flags: nowait postinstall skipifsilent
