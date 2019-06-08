import { BrowserWindow, app, ipcMain, dialog, Menu, shell } from "electron";
import * as fse from 'fs-extra';

let mainWin: BrowserWindow;

/**
 * creates a window and adds the default events to it (closed for now)
 * @param properties takes width and height of the window (respectively)
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

function loadMain() {
  mainWin.loadFile('main.html');
}

app.on("ready", () => {
  mainWin = createWindow({width: 640, height: 430});
  mainWin.setMenuBarVisibility(false);
  
  fse.readFile('appSettings.json', 'utf8', (err: Error, data: string) => {
    if (err) throw err;
    const appSettings = data != ''? JSON.parse(data): '';
    if (appSettings == '' || appSettings['htdocs'] == null) {
      mainWin.loadFile('setup.html');
      ipcMain.on('load-main', () => {loadMain();});
    } else loadMain();
  });

  //  ipc Main Part:
  // args[0] refers to browseType
  // args[1] refers to the value that existed previously on the textfiled where id = browserType
  ipcMain.on("dialog-request", (event: any, ...args: string[]) => {
    let path = dialog.showOpenDialog(mainWin, {
      title: 'htdocs Path',
      defaultPath: args[0] == 'other-prjs'? app.getPath('desktop') : args[1],
      buttonLabel: 'choose',
      properties: ["openDirectory"]
    });
    // if user clicked cancel on dialog box returns previous path (args[1])
    event.reply('dialog-reply', args[0], path);
  });
  ipcMain.on('open-in-explorer', (event: any, ...args: string[]) => {
    shell.openItem(args[0]);
  });

});

