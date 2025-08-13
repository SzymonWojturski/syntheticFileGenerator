const { dialog, contextBridge, app, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

async function saveFile(arrayBuffer, ext) {
    try {
        const buffer = Buffer.from(arrayBuffer); // konwersja ArrayBuffer -> Buffer

        const { filePath, canceled } = await dialog.showSaveDialog({
            defaultPath: path.join(app.getPath('downloads'), `generated.${ext}`),
            filters: [{ name: ext.toUpperCase(), extensions: [ext] }]
        });

        if (canceled) {
            return { success: false, error: 'Użytkownik anulował zapis.' };
        }

        await fs.promises.writeFile(filePath, buffer);

        return { success: true, filePath };
    } catch (err) {
        dialog.showErrorBox('Błąd zapisu pliku', err.message);
        return { success: false, error: err.message };
    }
}
contextBridge.exposeInMainWorld('files', {
    saveFile: (arrayBuffer, ext) => ipcRenderer.invoke('save-file', { arrayBuffer, ext })
});
