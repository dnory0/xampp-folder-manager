"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var fs = require("fs");
/**
 * Sends dialog box request to ipcMain with two arguments:
 * - browseType.
 * - value of the `[type='text']` with the id == browseType.
 * @param browseType takes either 'htdocs' | 'other-prjs'
 */
function browse(browseType) {
    var element = document.getElementById(browseType);
    electron_1.ipcRenderer.send("dialog-request", browseType, element.value !== '' ? element.value : (process.platform === 'win32' ?
        'c:\\xampp\\htdocs' : (process.platform === 'linux' ?
        '/opt/lampp/htdocs' : null)));
}
/**
 * launchs when next btn clicked, it checks if htdocs path is valid or not
 *
 * #### checking:
 * - if(path is valid)
 *    - it continues
 * - else
 *    - it turns background-color of htdocsPath textfield to red.
 */
function htdocsChosen() {
    var txtField = document.getElementById('htdocs');
    fs.access(txtField.value, fs.constants.F_OK, function (err) {
        if (err)
            document.getElementById('htdocs').style.backgroundColor = '#f55';
        else {
            var appSettings = {};
            appSettings['htdocs'] = {};
            appSettings['htdocs']['path'] = txtField.value;
            appSettings['htdocs']['name'] = "htdocs";
            fs.writeFile('appSettings.json', JSON.stringify(appSettings), 'utf8', function (err) {
                if (err)
                    throw err;
                electron_1.ipcRenderer.send('load-main');
            });
        }
    });
}
/**
 * gets reply from ipcMain with the browseType and the path
 * changes the text field where id == browseType with the new path
 */
electron_1.ipcRenderer.on('dialog-reply', function (event) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (args[0] != 'htdocs')
        return;
    var element = document.getElementById(args[0]);
    if (args[1] != null) {
        element.value = args[1];
        element.style.backgroundColor = '#474b5d';
    }
});
