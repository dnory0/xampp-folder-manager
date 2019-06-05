const {ipcRenderer} = require ('electron');

/**
 * Sends dialog box request to ipcMain with two arguments:
 * - browseType.
 * - value of the `[type='text']` with the id == browseType.
 * @param browseType takes either 'htdocs' | 'other-prjs'
 */
function browse(browseType: string) {
  const element: any = document.getElementById(browseType);
  ipcRenderer.send(`dialog-request`, browseType, element.value);
}

/**
 * gets reply from ipcMain with the browseType and the path
 * changes the text field where id == browseType with the new path
 */
ipcRenderer.on('dialog-replay', (event: any, ...args: string[]) => {
  const element: any = document.getElementById(args[0]);
  element.value = args[1];
});
