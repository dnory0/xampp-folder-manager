var ipcRenderer = require('electron').ipcRenderer;
/**
 * Sends dialog box request to ipcMain with two arguments:
 * - browseType.
 * - value of the `[type='text']` with the id == browseType.
 * @param browseType takes either 'htdocs' | 'other-prjs'
 */
function browse(browseType) {
    var element = document.getElementById(browseType);
    ipcRenderer.send("dialog-request", browseType, element.value);
}
/**
 * gets reply from ipcMain with the browseType and the path
 * changes the text field where id == browseType with the new path
 */
ipcRenderer.on('dialog-replay', function (event) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var element = document.getElementById(args[0]);
    element.value = args[1];
});
