"use strict";
exports.__esModule = true;
// const {ipcRenderer} = require ('electron');
var electron_1 = require("electron");
var fs = require("fs");
// fs.
/**
 * Sends dialog box request to ipcMain with two arguments:
 * - browseType.
 * - value of the `[type='text']` with the id == browseType.
 * @param browseType takes either 'htdocs' | 'other-prjs'
 */
function browse(browseType) {
    var element = document.getElementById(browseType);
    electron_1.ipcRenderer.send("dialog-request", browseType, element.value);
}
/**
 * gets reply from ipcMain with the browseType and the path
 * changes the text field where id == browseType with the new path
 */
electron_1.ipcRenderer.on('dialog-replay', function (event) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var element = document.getElementById(args[0]);
    element.value = args[1];
    if (args[2])
        element.style.backgroundColor = '#474b5d';
});
/**
 * launchs when next btn clicked, it checks if htdocs path is valid or not
 *
 * #### checking:
 * - if(path is valid)
 *    - it continues
 * - else
 *    - it turns background-color of htdocs textfield to red.
 */
function htdocsChosen() {
    var txtFiled = document.getElementById('htdocs');
    fs.access(txtFiled.value, fs.constants.F_OK, function (err) {
        if (err)
            document.getElementById('htdocs').style.backgroundColor = '#f55';
        else {
            fs.readFile('appSettings.json', 'utf8', function (err, data) {
                if (err)
                    throw err;
                var appSettings = JSON.parse(data);
                appSettings['htdocsPath'] = txtFiled.value;
                fs.writeFile('appSettings.json', JSON.stringify(appSettings), 'utf8', function (err) {
                    if (err)
                        throw err;
                    electron_1.ipcRenderer.send('load-main');
                });
            });
        }
    });
}
