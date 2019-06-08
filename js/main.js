"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var Menu = electron_1.remote.Menu, MenuItem = electron_1.remote.MenuItem;
var fs = require("fs");
var path = require("path");
var appSettings;
// Importing htdocs folder properties + importing otherPrjs
fs.access('appSettings.json', function (err) {
    if (err)
        throw err;
    fs.readFile('appSettings.json', 'utf8', function (err, data) {
        if (err)
            throw err;
        appSettings = JSON.parse(data);
        if (appSettings['htdocs'] != null) {
            fs.access(appSettings['htdocs']['path'] + "/favicon.ico", function (err) {
                if (!err)
                    document.getElementById('htdocs-favicon').src =
                        appSettings['htdocs']['path'] + "/favicon.ico";
                document.getElementById('htdocs-title').innerHTML = appSettings['htdocs']['name'];
            });
        }
        if (appSettings['otherPrjs'] != null) {
            appSettings['otherPrjs'].forEach(function (object) {
                showPrj(object['path']);
            });
        }
    });
});
// Right-click menu part
var menu = new Menu();
menu.append(new MenuItem({
    label: 'Open the containing folder',
    click: function () { electron_1.ipcRenderer.send('open-in-explorer', appSettings['htdocs']['path']); }
}));
menu.append(new MenuItem({
    label: 'Add a project',
    click: function () { electron_1.ipcRenderer.send('dialog-request', 'other-prjs'); }
}));
// Right-click event for decide what's visible on the context menu
// depending on the target element.
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    menu.items[0].visible = /htdocs/.test(e.target.id);
    menu.items[1].visible = /other-prjs/.test(e.target.id);
    menu.items.forEach(function (element) {
        if (element.visible) {
            menu.popup({ window: electron_1.remote.getCurrentWindow() });
            return;
        }
    });
}, false);
// handling the path returned by the dialog reply, and decide if path
// exists before, do nothing, else we add it to appSetting and main page
electron_1.ipcRenderer.on('dialog-reply', function (event) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (args[0] != 'other-prjs' && args[1] != null)
        return;
    if (appSettings['otherPrjs'] == null) {
        appSettings['otherPrjs'] = [
            {
                name: path.basename(args[1][0]),
                path: args[1][0]
            }
        ];
        addPrj(args[1][0]);
    }
    else
        appSettings['otherPrjs'].forEach(function (object, index) {
            if (object['path'] === args[1][0] && object['name'] === path.basename(args[1][0]))
                return;
            if (index == appSettings['otherPrjs'].length - 1) {
                appSettings['otherPrjs'].push({
                    name: path.basename(args[1][0]),
                    path: args[1][0]
                });
                addPrj(args[1][0]);
            }
        });
});
/**
 * update appSettings.json content when adding or altering otherPrjs content
 * @param prjPath needed for showPrj()
 */
function addPrj(prjPath) {
    fs.writeFile('appSettings.json', JSON.stringify(appSettings), 'utf8', function (err) {
        if (err)
            throw err;
    });
    showPrj(prjPath);
}
/**
 * adds the new prject to the otherPrjs list in main.html
 * @param prjPath path of the project to get its icon and basename
 */
function showPrj(prjPath) {
    fs.access(prjPath + '/favicon.ico', function (err) {
        var newPrj = "\n      <div class=\"other-prj\">\n    ";
        if (!err)
            newPrj += "\n        <img class=\"other-prj-favicon\" src=\"" + (prjPath + '/favicon.ico') + "\">\n    ";
        newPrj += "\n        <div class=\"other-prj-title\">" + path.basename(prjPath) + "</div>\n      </div>\n    ";
        document.getElementById('other-prjs').innerHTML += newPrj;
    });
}
