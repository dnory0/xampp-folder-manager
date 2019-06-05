"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var mainWin;
function createWindow(_a) {
    var width = _a.width, height = _a.height;
    var win = new electron_1.BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('main.html');
    win.on('close', function () { win = null; });
    return win;
}
electron_1.app.on("ready", function () {
    mainWin = createWindow({ width: 500, height: 320 });
    // args[0] refers to browseType
    // args[1] refers to the value that existed previously on the textfiled where id = browserType
    electron_1.ipcMain.on("dialog-request", function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var defaultPath;
        if (args[0] === 'htdocs')
            defaultPath = args[1] !== '' ? args[1] : (process.platform === 'win32' ?
                'c:\\xampp\\htdocs' : (process.platform === 'linux' ?
                '/opt/lampp/htdocs' : null));
        else
            defaultPath = (args[1] !== '' ? args[1] : (process.platform === 'win32' ?
                'C:\\Users\\%username%\\Desktop' : (process.platform === 'linux' ?
                '~/Desktop' : null)));
        var path = electron_1.dialog.showOpenDialog({
            title: 'htdocs Path',
            defaultPath: defaultPath,
            buttonLabel: 'choose',
            properties: ["openDirectory"]
        });
        // if user clicked cancel on dialog box returns previous path (args[1])
        event.reply('dialog-replay', args[0], path == null ? args[1] : path);
    });
});
