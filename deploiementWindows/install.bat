regedit %~dp0%allow.reg
Certutil -addStore TrustedPeople %~dp0%CordovaApp.Windows80_0.0.1.0_AnyCPU_Debug.cer
Slmgr /ipk 2RHXN-7CFVC-7HGCB-G2R97-M4DH7
Slmgr /ato ec67814b-30e6-4a50-bf7b-d55daf729d1e
powershell.exe -ExecutionPolicy Bypass -Command "add-appxpackage %~dp0CordovaApp.Windows80_0.0.1.0_anycpu_debug.appx -DependencyPath %~dp0Microsoft.WinJS.1.0.appx"
PAUSE;