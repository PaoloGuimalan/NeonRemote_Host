/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Native
import { join } from 'path';
import urlparser from 'url';
// import os from 'os';
// import fs from 'fs';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron';
import isDev from 'electron-is-dev';
// import { exec } from 'child_process';

function createWindow() {
  // const primaryDisplay = screen.getPrimaryDisplay();
  // const { width, height } = primaryDisplay.workAreaSize;

  // const displays = screen.getAllDisplays();
  // const externalDisplay = displays.find((display) => {
  //   return display.bounds.x !== 0 || display.bounds.y !== 0;
  // });
  // Create the browser window.
  const window = new BrowserWindow({
    // width,
    // height,
    width: 500,
    height: 700,
    //  change to false to use AppBar
    frame: true,
    titleBarStyle: 'hidden',
    skipTaskbar: false,
    alwaysOnTop: true,
    show: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  const urlformat = urlparser.format({
    pathname: join(__dirname, '../src/out/index.html'),
    hash: '/app',
    protocol: 'file:',
    slashes: true
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}/#/app` : urlformat;

  // and load the index.html of the app.
  if (isDev) {
    window?.loadURL(url);
    // window.webContents.openDevTools();
    setTimeout(() => {
      window.reload();
    }, 10000);
  } else {
    window?.loadURL(url);
    // window.webContents.openDevTools();
  }
  // Open the DevTools.
  // window.webContents.openDevTools();

  // For AppBar
  ipcMain.on('minimize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMinimized() ? window.restore() : window.minimize();
    // or alternatively: win.isVisible() ? win.hide() : win.show()
  });
  ipcMain.on('maximize', () => {
    // eslint-disable-next-line no-unused-expressions
    window.isMaximized() ? window.restore() : window.maximize();
  });

  ipcMain.on('close', () => {
    window.close();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});
