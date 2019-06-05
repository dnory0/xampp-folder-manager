import { BrowserWindow, app, ipcMain, dialog } from "electron";

let mainWin: BrowserWindow;

function createWindow({width, height}: {width: number, height: number}): BrowserWindow {
  let win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  win.loadFile('main.html');
  win.on('close', function() {win = null;});
  return win;
}

app.on("ready", () => {
  mainWin = createWindow({width: 500, height: 320});
  
  // args[0] refers to browseType
  // args[1] refers to the value that existed previously on the textfiled where id = browserType
  ipcMain.on("dialog-request", (event: any, ...args: string[]) => {
    let defaultPath: string;
    if (args[0] === 'htdocs')
      defaultPath = args[1] !== ''? args[1] : (process.platform === 'win32'? 
      'c:\\xampp\\htdocs' : (process.platform === 'linux'?
      '/opt/lampp/htdocs' : null));
    else 
      defaultPath = (args[1] !== ''? args[1] : (process.platform === 'win32'? 
      'C:\\Users\\%username%\\Desktop' : (process.platform === 'linux'?
      '~/Desktop' : null)));
    let path = dialog.showOpenDialog({
      title: 'htdocs Path',
      defaultPath: defaultPath,
      buttonLabel: 'choose',
      properties: ["openDirectory"]
    });
    // if user clicked cancel on dialog box returns previous path (args[1])
    event.reply('dialog-replay', args[0], path == null? args[1] : path);
  });
});

