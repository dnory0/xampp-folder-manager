"use strict";
exports.__esModule = true;
// const {ipcRenderer} = require('electron');
var electron_1 = require("electron");
var Menu = electron_1.remote.Menu, MenuItem = electron_1.remote.MenuItem;
var fs = require("fs");
var appSettings;
fs.access('appSettings.json', function (err) {
    if (err)
        throw err;
    fs.readFile('appSettings.json', 'utf8', function (err, data) {
        if (err)
            throw err;
        appSettings = JSON.parse(data);
        if (appSettings['htdocsPath'] !== null) {
            fs.access(appSettings['htdocsPath'] + "/favicon.ico", function (err) {
                if (!err)
                    document.getElementById('htdocs-favicon').src = appSettings['htdocsPath'] + "/favicon.ico";
            });
        }
        if (appSettings['htdocsOriginalName'] != null)
            document.getElementById('htdocs-title').innerHTML = appSettings['htdocsOriginalName'];
        else
            document.getElementById('htdocs-title').innerHTML = 'htdocs folder';
    });
});
var menu = new Menu();
var htdocs = new MenuItem({
    label: 'Open the containing folder',
    click: function () { openFolder(appSettings['htdocsPath']); },
    accelerator: "R"
});
menu.append(htdocs);
// menu.append(new MenuItem({ label: 'MenuItem1', click() { console.log('item 1 clicked') } }))
// menu.append(new MenuItem({ type: 'separator' }))
// menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    htdocs.visible = /htdocs/.test(e.target.id);
    console.log('yeeeeeees');
    menu.popup({ window: electron_1.remote.getCurrentWindow() });
}, false);
function openFolder(path) {
    electron_1.shell.openItem(path);
}
