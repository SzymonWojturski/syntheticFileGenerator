const { spawn } = require('child_process');
const { app, ipcMain, dialog, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

let backendProcess;

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: { 
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
}


function startBackend() {
  const backendExecutable = path.join(__dirname, '../backend/dist/run/run');

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

ipcMain.handle("save-file", async (event, { arrayBuffer, ext }) => {
  try {
    const buffer = Buffer.from(arrayBuffer);

    const { filePath, canceled } = await dialog.showSaveDialog({
      defaultPath: path.join(app.getPath("downloads"), `generated.${ext}`),
      filters: [{ name: ext.toUpperCase(), extensions: [ext] }],
    });

    if (canceled || !filePath) {
      return { success: false, error: "Użytkownik anulował zapis." };
    }

    await fs.promises.writeFile(filePath, buffer);

    return { success: true, filePath };
  } catch (err) {
    dialog.showErrorBox("Błąd zapisu pliku", err.message);
    return { success: false, error: err.message };
  }
});
