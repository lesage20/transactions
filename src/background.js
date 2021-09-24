'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path')
const ipcMain = require("electron").ipcMain;
let workerWindow = undefined;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])
const fs = require('fs')
async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 900,
        height: 650,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: false, // !process.env.ELECTRON_NODE_INTEGRATION,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    })


    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) {
            win.webContents.openDevTools()
        }
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
    // win.webContents.on('did-finish-load', () => {
    //     win.webContents.printToPDF({ marginsType:2, pageSize:"A4", landscape:false }, (error, data) => {
    //         if (error) throw error
    //         fs.writeFile('output.pdf', data, (error) => {
    
    //         //getTitle of Window
    //         console.log(win.webContents.getTitle())
    
    //         //Silent Print 
    
    //         if (error) throw error
    //         console.log('Write PDF successfully.')
    //         })
    //     })
    // })
    // win.webContents.print({silent:false, printBackground:false})
    ipcMain.on("getPrinterList", (event)=>{
        console.log("I need to send you printers list")
        const list = win.webContents.getPrinters()
        // win.webContents.print({silent:false, printBackground:false})

        win.webContents.send('getPrinterList',win.webContents.getPrinters())
        console.log(list)
    })
    ipcMain.on("print", (event, content)=>{
        console.log("I need to print some content")
        const list = win.webContents.print()
        // win.webContents.print({silent:false, printBackground:false})

        // win.webContents.send('getPrinterList',win.webContents.getPrinters())
        
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS3_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }

    createWindow()


})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}
