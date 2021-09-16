const { ipcRenderer } = require('electron')
const models = require('./database/models')
const mongoose = require('mongoose')
window.ipcRenderer = ipcRenderer
window.mongoose = mongoose
window.models = models.default