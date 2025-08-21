const { spawn } = require('child_process');
const { app, BrowserWindow, ipcMain, dialog } = require("electron"); // <-- tu dodane ipcMain i dialog
const path = require("path");
const fs = require("fs");

let backendProcess;
let mainWindow;

ipcMain.handle("save-file", async (event, { arrayBuffer, ext }) => {
  try {
    const buffer = Buffer.from(arrayBuffer);

    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: `file.${ext}`,
    });

    if (canceled) return null;

    fs.writeFileSync(filePath, buffer);
    return filePath;
  } catch (err) {
    console.error("Error saving file:", err);
    throw err;
  }
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  startBackend();

  const frontendPath = path.join(process.resourcesPath, 'frontend/dist/index.html');
  mainWindow.loadFile(frontendPath);
}

function startBackend() {
  let backendExecutable;

  if (app.isPackaged) {
    backendExecutable = path.join(process.resourcesPath, 'backend', 'run', 'run');
  } else {
    backendExecutable = path.join(__dirname, '../dist/run/run');
  }

  console.log(`Starting backend from: ${backendExecutable}`);

  backendProcess = spawn(backendExecutable, [], { stdio: ['ignore', 'pipe', 'pipe'] });

  backendProcess.stdout.on('data', (data) => console.log(`BACKEND: ${data.toString()}`));
  backendProcess.stderr.on('data', (data) => console.error(`BACKEND ERR: ${data.toString()}`));
  backendProcess.on('close', (code) => console.log(`Backend exited with code ${code}`));
  backendProcess.on('error', (err) => console.error('Failed to start backend:', err));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
