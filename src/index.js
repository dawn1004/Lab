const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const axios = require('axios');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow
let authWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 720,
    show: false,
    webPreferences:{
      devTools: false,
      nodeIntegration: true,
    }
  });
  authWindow = new BrowserWindow({
    width: 800,
    height: 620,
    webPreferences:{
      devTools: false,
      nodeIntegration: true,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, './Views/index.html'));
  authWindow.loadFile(path.join(__dirname, './Views/login.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  authWindow.webContents.openDevTools();
  authWindow.setMenuBarVisibility(false);
  mainWindow.setMenuBarVisibility(false);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// hot reloader
// try {
//   require('electron-reloader')(module)
// } catch (_) {}

//IPC EVENTS


ipcMain.on('auth:login', (event, data) => {

  axios.get('http://localhost:3000/Users')
  .then(function (response) {
    const user = response.data[0]

    if(data.username == user.username && data.password == user.password){
      mainWindow.show()
      authWindow.hide()
     }

  })
  .catch(function (error) {
    console.log(error);
  })


})


ipcMain.on('popup:alert', (event,data) => {

  const Alert = require("electron-alert");

  let alert = new Alert();
  
  let swalOptions = {
    text: data.message,
    type: "warning",
    showCancelButton: false
  };
  
  alert.fireWithFrame(swalOptions, null, true, false);
})



//connect DB

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)

try {
  server.listen(3000, () => {
    console.log('JSON Server is running')
  })
  
} catch (error) {
  console.log({error: error})
}



