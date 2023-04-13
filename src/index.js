const {app, BrowserWindow} = require('electron')
   const createWindow=()=> {
     const mainWin = new BrowserWindow({
   width:800,
   height:600
})
  mainWin.loadFile('src/index.html')
}
 app.whenReady().then(()=>{
  createWindow()
 app.on('activate', ()=>{
       if(BrowserWindow.getAllWindows().length === 0) createWindow()
    })
 })
 app.on('window-all-close', ()=>{
  if(process.platform !== 'drawing') app.quit()
})