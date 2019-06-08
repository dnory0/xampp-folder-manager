"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var fse = require("fs-extra");
var mainWin;
/**
 * creates a window and adds the default events to it (closed for now)
 * @param properties takes width and height of the window (respectively)
 */
function createWindow(_a) {
    var width = _a.width, height = _a.height;
    var win = new electron_1.BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.on('close', function () { win = null; });
    return win;
}
function loadMain() {
    mainWin.loadFile('main.html');
}
electron_1.app.on("ready", function () {
    mainWin = createWindow({ width: 640, height: 430 });
    mainWin.setMenuBarVisibility(false);
    fse.readFile('appSettings.json', 'utf8', function (err, data) {
        if (err)
            throw err;
        var appSettings = data != '' ? JSON.parse(data) : '';
        if (appSettings == '' || appSettings['htdocs'] == null) {
            mainWin.loadFile('setup.html');
            electron_1.ipcMain.on('load-main', function () { loadMain(); });
        }
        else
            loadMain();
    });
    //  ipc Main Part:
    // args[0] refers to browseType
    // args[1] refers to the value that existed previously on the textfiled where id = browserType
    electron_1.ipcMain.on("dialog-request", function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var path = electron_1.dialog.showOpenDialog(mainWin, {
            title: 'htdocs Path',
            defaultPath: args[0] == 'other-prjs' ? electron_1.app.getPath('desktop') : args[1],
            buttonLabel: 'choose',
            properties: ["openDirectory"]
        });
        // if user clicked cancel on dialog box returns previous path (args[1])
        event.reply('dialog-reply', args[0], path);
    });
    electron_1.ipcMain.on('open-in-explorer', function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        electron_1.shell.openItem(args[0]);
    });
});
