const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');


function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });
    mainWindow.loadURL('http://localhost:5173');

}

app.whenReady().then(() => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    mainWindow.loadURL('http://localhost:5173');
});
ipcMain.handle('save-file', async (event, { arrayBuffer, ext }) => {
    const buffer = Buffer.from(arrayBuffer);
    const { filePath, canceled } = await dialog.showSaveDialog({
        defaultPath: `generated.${ext}`,
        filters: [{ name: ext.toUpperCase(), extensions: [ext] }]
    });

    if (!canceled && filePath) {
        fs.writeFileSync(filePath, buffer);
        return { success: true };
    }
    return { success: false };
});

