import { BrowserWindow, app, ipcMain, dialog } from "electron";
const fse = require('fs-extra');

let mainWin: BrowserWindow;

/**
 * creates a window and adds the default events to it (closed for now)
 * @param param0 takes width and height of the window (respectively)
 */
function createWindow({width, height}: {width: number, height: number}): BrowserWindow {
  let win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.on('close', function() {win = null;});
  return win;
}

// function 

app.on("ready", () => {
  mainWin = createWindow({width: 640, height: 430});
  
  fse.readFile('appSettings.json', 'utf8', (err: Error, data: string) => {
    if (err) throw err;
    const appSettings: object = JSON.parse(data);
    if (appSettings['htdocsPath'] == null) {
      mainWin.loadFile('main.html');    
    } else {
      // that's the real next phase
      // ipcMain.on('load-main')
    }
  });
  // args[0] refers to browseType
  // args[1] refers to the value that existed previously on the textfiled where id = browserType
  ipcMain.on("dialog-request", (event: any, ...args: string[]) => {
    let defaultPath: string;
    if (args[0] === 'htdocs')
      defaultPath = args[1] !== ''? args[1] : (process.platform === 'win32'? 
      'c:\\xampp\\htdocs' : (process.platform === 'linux'?
      '/opt/lampp/htdocs' : null));
    let path = dialog.showOpenDialog(mainWin, {
      title: 'htdocs Path',
      defaultPath: defaultPath,
      buttonLabel: 'choose',
      properties: ["openDirectory"]
    });
    // if user clicked cancel on dialog box returns previous path (args[1])
    event.reply('dialog-replay', 
      args[0], path == null? args[1] : path, path == null? false : true);
  });
});

