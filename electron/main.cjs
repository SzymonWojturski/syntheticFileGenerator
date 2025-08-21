const { spawn } = require('child_process');
const { app, ipcMain, dialog, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const http = require("http"); // zamiast fetch

let backendProcess;
let mainWindow;

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
  startBackend()
  const frontendPath = path.join(process.resourcesPath, 'frontend/dist/index.html');
  mainWindow.loadFile(frontendPath);
}

async function waitForBackend(url, retries = 20, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          // uznajemy, że backend działa jeśli zwróci 200 lub 404
          if (res.statusCode === 200 || res.statusCode === 404) {
            res.resume(); // opróżnij strumień
            resolve(true);
          } else {
            reject(new Error(`Status ${res.statusCode}`));
          }
        });
        req.on("error", reject);
        req.setTimeout(2000, () => {
          req.destroy(new Error("timeout"));
        });
      });
      return true; // jeśli się udało
    } catch (e) {
      // ignoruj i spróbuj ponownie
    }
    await new Promise(r => setTimeout(r, delay));
  }
  throw new Error("Backend nie wystartował w czasie oczekiwania");
}

function startBackend() {
  const backendExecutable = app.isPackaged
    ? path.join(process.resourcesPath, 'backend/dist/run/run')
    : path.join(__dirname, '../backend/dist/run/run');

  backendProcess = spawn(backendExecutable, [], { stdio: ['ignore', 'pipe', 'pipe'] });

  backendProcess.stdout.on('data', (data) => console.log(`BACKEND: ${data.toString()}`));
  backendProcess.stderr.on('data', (data) => console.error(`BACKEND ERR: ${data.toString()}`));
  backendProcess.on('close', (code) => console.log(`Backend exited with code ${code}`));
  backendProcess.on('error', (err) => console.error('Failed to start backend:', err));
}

app.whenReady().then(async () => {
    createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
