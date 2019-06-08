import {ipcRenderer, remote, app} from 'electron';
const {Menu, MenuItem} = remote;
import * as fs from 'fs';
import * as path from 'path';


let appSettings: object;
// Importing htdocs folder properties + importing otherPrjs
fs.access('appSettings.json', (err: NodeJS.ErrnoException) => {
  if (err) throw err;
  fs.readFile('appSettings.json', 'utf8', (err: NodeJS.ErrnoException, data: string) => {
    if (err) throw err;
    appSettings = JSON.parse(data);
    if (appSettings['htdocs'] != null) {
      fs.access(`${appSettings['htdocs']['path']}/favicon.ico`, (err: NodeJS.ErrnoException) => {
        if (!err)
          (<HTMLImageElement> document.getElementById('htdocs-favicon')).src = 
            `${appSettings['htdocs']['path']}/favicon.ico`;
          document.getElementById('htdocs-title').innerHTML = appSettings['htdocs']['name'];
      });
    }

    if (appSettings['otherPrjs'] != null) {
      (<object[]> appSettings['otherPrjs']).forEach((object) => {
        showPrj(object['path']);
      });
    }
  });
});

// Right-click menu part
const menu = new Menu()
menu.append(new MenuItem({
  label: 'Open the containing folder',
  click: () => {ipcRenderer.send('open-in-explorer', appSettings['htdocs']['path'])}
}));

menu.append(new MenuItem({
  label: 'Add a project',
  click: () => {ipcRenderer.send('dialog-request', 'other-prjs')}
}));

// Right-click event for decide what's visible on the context menu
// depending on the target element.
window.addEventListener('contextmenu', (e: MouseEvent) => {
  e.preventDefault();
  menu.items[0].visible = /htdocs/.test((<HTMLElement> e.target).id);
  menu.items[1].visible = /other-prjs/.test((<HTMLElement> e.target).id);
  menu.items.forEach((element: Electron.MenuItem) => {
    if(element.visible) {
      menu.popup({ window: remote.getCurrentWindow() });
      return;
    }
  });
}, false);

// handling the path returned by the dialog reply, and decide if path
// exists before, do nothing, else we add it to appSetting and main page
ipcRenderer.on('dialog-reply', (event: any, ...args: string[]) => {
  if (args[0] != 'other-prjs' && args[1] != null) return;
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
    (<object[]> appSettings['otherPrjs']).forEach((object, index) => {
      if (object['path'] === args[1][0] && object['name'] === path.basename(args[1][0]))
        return;
      if (index == (<object[]> appSettings['otherPrjs']).length - 1) {
        (<object[]> appSettings['otherPrjs']).push(
          {
            name: path.basename(args[1][0]),
            path: args[1][0]
          }
        );
        addPrj(args[1][0]);
      }
    });
});

/**
 * update appSettings.json content when adding or altering otherPrjs content
 * @param prjPath needed for showPrj()
 */
function addPrj(prjPath: string) {
  fs.writeFile('appSettings.json', JSON.stringify(appSettings), 'utf8', (err: NodeJS.ErrnoException) => {
    if (err) throw err;
  });
  showPrj(prjPath);
}

/**
 * adds the new prject to the otherPrjs list in main.html
 * @param prjPath path of the project to get its icon and basename
 */
function showPrj(prjPath: string) {
  fs.access(prjPath + '/favicon.ico', (err: NodeJS.ErrnoException) => {
    let newPrj: string = `
      <div class="other-prj">
    `
    if (!err) newPrj += `
        <img class="other-prj-favicon" src="${prjPath + '/favicon.ico'}">
    `;
    
    newPrj += `
        <div class="other-prj-title">${path.basename(prjPath)}</div>
      </div>
    `;
    document.getElementById('other-prjs').innerHTML += newPrj;
  });
}