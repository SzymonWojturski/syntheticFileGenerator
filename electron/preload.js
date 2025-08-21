const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("files", {
  saveFile: (arrayBuffer, ext) =>
    ipcRenderer.invoke("save-file", { arrayBuffer, ext }),
});
