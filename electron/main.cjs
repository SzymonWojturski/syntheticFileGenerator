const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  });

  win.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
}

function startBackend() {
  // Pełna ścieżka do zbudowanej binarki
  const backendExecutable = path.join(__dirname, '../backend/dist/builded');

  backendProcess = spawn(backendExecutable);

  backendProcess.stdout.on('data', (data) => console.log(`BACKEND: ${data}`));
  backendProcess.stderr.on('data', (data) => console.error(`BACKEND ERR: ${data}`));
  backendProcess.on('close', (code) => console.log(`Backend exited with code ${code}`));
  backendProcess.on('error', (err) => console.error('Failed to start backend:', err));
}

app.whenReady().then(() => { startBackend(); createWindow(); });

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
