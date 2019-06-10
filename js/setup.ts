import {ipcRenderer} from 'electron';
import * as fs  from 'fs';


/**
 * Sends dialog box request to ipcMain with two arguments:
 * - browseType.
 * - value of the `[type='text']` with the id == browseType.
 * @param browseType takes either 'htdocs' | 'other-prjs'
 */
function browse(browseType: string) {
  const element: any = document.getElementById(browseType);
  ipcRenderer.send(`dialog-request`, browseType, 
    element.value !== ''? element.value : (process.platform === 'win32'? 
    'c:\\xampp\\htdocs' : (process.platform === 'linux'?
    '/opt/lampp/htdocs' : null))
  );
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
  let txtField: any = document.getElementById('htdocs');
  fs.access(txtField.value, fs.constants.F_OK, (err: Error) => {
    if (err)
      document.getElementById('htdocs').style.backgroundColor = '#f55';
      else {
        let appSettings = {};
        appSettings['htdocs'] = {};
        appSettings['htdocs']['path'] = txtField.value;
        appSettings['htdocs']['name'] = "htdocs";
        fs.writeFile('appSettings.json', JSON.stringify(appSettings),
          'utf8', (err: Error) => {
          if (err) throw err;
          ipcRenderer.send('load-main');
        })
      }
  });
}

/**
 * gets reply from ipcMain with the browseType and the path
 * changes the text field where id == browseType with the new path
 */
ipcRenderer.on('dialog-reply', (event: any, ...args: string[]) => {
  if(args[0] != 'htdocs') return;
  const element: any = document.getElementById(args[0]);
  if (args[1] != null) {
    element.value = args[1];
    element.style.backgroundColor = '#474b5d';
  }
});
