const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let window = null

// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  window = new BrowserWindow({
    // Set the initial width to 500px
    width: 1000,
    // Set the initial height to 400px
    height: 800,
    // set the title bar style
    titleBarStyle: 'hidden-inset',
    // set the background color to black
    backgroundColor: "#fff",
    // Don't show the window until it's ready, this prevents any white flickering
    show: false
  })

  // Open the DevTools.
  //window.webContents.openDevTools()

  window.loadURL(url.format({
    pathname: '../dist/index.html',
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', () => {
    window.show()
  })
})
