import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function createWindow() {

  const win = new BrowserWindow({

    width: 1400,
    height: 900,

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }

  });


  const indexPath = path.join(
    __dirname,
    "../dist/index.html"
  );


  win.loadFile(indexPath);

}


app.whenReady().then(() => {
  createWindow();
});


app.on(
  "window-all-closed",
  () => {

    if (process.platform !== "darwin") {
      app.quit();
    }

  }
);