// const {ipcRenderer} = require('electron');
import {shell, ipcRenderer, remote} from 'electron';
const {Menu, MenuItem} = remote;
import * as fs from 'fs';


let appSettings: any;

fs.access('appSettings.json', (err: NodeJS.ErrnoException) => {
  if (err) throw err;
  fs.readFile('appSettings.json', 'utf8', (err: NodeJS.ErrnoException, data: string) => {
    if (err) throw err;
    appSettings = JSON.parse(data);
    if (appSettings['htdocsPath'] !== null) {
      fs.access(`${appSettings['htdocsPath']}/favicon.ico`, (err: NodeJS.ErrnoException) => {
        if (!err) (<HTMLImageElement> document.getElementById('htdocs-favicon')).src = `${appSettings['htdocsPath']}/favicon.ico`;
      });
    }
    if (appSettings['htdocsOriginalName'] != null)
      document.getElementById('htdocs-title').innerHTML = appSettings['htdocsOriginalName'];
    else document.getElementById('htdocs-title').innerHTML = 'htdocs folder';
  });
});


const menu = new Menu()
let htdocs: Electron.MenuItem = new MenuItem({
  label: 'Open the containing folder',
  click: () => {openFolder(appSettings['htdocsPath'])},
  accelerator: "R",
});
menu.append(htdocs);
// menu.append(new MenuItem({ label: 'MenuItem1', click() { console.log('item 1 clicked') } }))
// menu.append(new MenuItem({ type: 'separator' }))
// menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))

window.addEventListener('contextmenu', (e: MouseEvent) => {
  e.preventDefault();
  htdocs.visible = /htdocs/.test((<HTMLElement> e.target).id)
  console.log('yeeeeeees');
  menu.popup({ window: remote.getCurrentWindow() })
}, false)

function openFolder(path: string) {
  shell.openItem(path);
}

