const { app, BrowserWindow } = require('electron');
const { execFile } = require('child_process');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 200,
    height: 100,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setFullScreenable(false);

  mainWindow.loadFile('src/renderer/index.html');
  //mainWindow.webContents.openDevTools()

};

app.whenReady().then(() => {
  createWindow();

  var executablePath = 'AudioToMicrophone/AudioToMicrophone.exe';
  var parameters = ['./'];
  var readingProcess = execFile(
    executablePath,
    parameters,
    function (err, data) {
      console.log(err);
      console.log(data.toString());

      app.on('quit', () => {
        readingProcess.kill();
      });
    }
  );

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
