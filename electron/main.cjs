const { spawn } = require('child_process');
const { app, ipcMain, dialog, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // npm install node-fetch@2

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

  const frontendPath = path.join(process.resourcesPath, 'frontend/dist/index.html');
  mainWindow.loadFile(frontendPath);
}

async function waitForBackend(url, retries = 20, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return true; // backend działa
    } catch (e) {
      // ignore
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
  startBackend();
  try {
    await waitForBackend("http://127.0.0.1:8000");
    createWindow();
  } catch (err) {
    console.error(err);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
