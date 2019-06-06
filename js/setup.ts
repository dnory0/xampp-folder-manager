const {ipcRenderer} = require ('electron');
const fs = require('fs');

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
  if (args[2]) element.style.backgroundColor = '#474b5d';
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
  let txtFiled: any = document.getElementById('htdocs');
  fs.access(txtFiled.value, fs.constants.F_OK, (err: Error) => {
    if (err)
      document.getElementById('htdocs').style.backgroundColor = '#f55';
      else {
        fs.readFile('appSettings.json', 'utf8', (err: Error, data: string) => {
          if (err) throw err;
          let appSettings = JSON.parse(data);
          appSettings['htdocsPath'] = txtFiled.value;
          fs.writeFile('appSettings.json', JSON.stringify(appSettings),
            'utf8', (err: Error) => {
            if (err) throw err;
            document.getElementById('setup').innerHTML = 'Hi'
          })
        })
      }
  });
}