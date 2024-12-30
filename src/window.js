const { BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');
const {TSAuthentication} = require('./tradestation/authentication');
const { currentESTDatetime, randNum } = require("./renderer/util");

class Strategy{
    constructor(){
        this.path = "strategies.json";
    }

    info(msg) {
        console.log(`${currentESTDatetime()} [INFO] ${msg}`)
      }
    
      error(msg) {
        console.error(`${currentESTDatetime()} [ERROR] ${msg}`)
      }

    writeStrategyFile(data) {
        try {
          fs.writeFileSync(this.path, JSON.stringify(data, null, 2), "utf-8")
          return true
        } catch (error) {
          this.error(`writeStrategyFile() - ${error}`)
          return false
        }
      }

    readStrategyFile() {
        try {
          const data = fs.readFileSync(this.path, "utf-8")
          const parsedData = JSON.parse(data)
          return parsedData
        } catch (error) {
          this.error(`readStrategyFile() - ${error}`)
          return null
        }
      }

    deleteStrategy(arg){
        var incomingId = arg?.id;
        try {
            if (incomingId != "") {
                var json = this.readStrategyFile();
                if (json?.data) {
                    var updatedData = json?.data.filter(strategy => strategy.id != incomingId);
                    this.writeStrategyFile({data: updatedData});
                }
            }
            return {success: true, error: error};
        } catch (error) {
            return {success: false, error: error};
        }
    }

    saveStrategy(arg){
        var incomingId = arg?.id;
        var incomingName = arg?.name;
        var incomingCode = arg?.code;
        console.log(arg);
        try {
            if (fs.existsSync(this.path)) {
                var json = this.readStrategyFile();
                // new strategy
                if (incomingId == "") {
                    // append to the array
                    if (json?.data || json?.data.length > 0) {
                        // any matching names?
                        var matchingNames = json?.data.filter(strategy => strategy.name === incomingName);
                        var appendNum = matchingNames.length > 0 ? `_${randNum(10, 100)}` : ''
                        this.writeStrategyFile({data: [...json?.data, {id: `_${randNum(1000, 100000)}`, name: incomingName + appendNum, code: incomingCode}]});
                    } else {
                        this.writeStrategyFile({data: [{id: `_${randNum(1000, 100000)}`, name: incomingName, code: incomingCode}]});
                    }
                    return {success: true, error: ""};
                } else {
                    // append to the array
                    if (json?.data || json?.data.length > 0) {
                        // any matching names?
                        var dataWithoutId = json?.data.filter(strategy => strategy.id != incomingId);
                        var updatedStrat = {id: incomingId, name: incomingName, code: incomingCode};
                        this.writeStrategyFile({data: [...dataWithoutId, updatedStrat]});
                    } else {
                        this.writeStrategyFile({data: [{id: incomingId, name: incomingName, code: incomingCode}]});
                    }
                    return {success: true, error: ""};
                }
            }
        } catch (error) {
            return {success: false, error: error};
        }
    }

    getStrategies(){
        try {
            if (fs.existsSync(this.path)) {
                var json = this.readStrategyFile();
                if (json?.data) {
                    return json?.data;
                } else {
                    this.writeStrategyFile({data: []});
                     return [];
                }
            } else {
                this.writeStrategyFile({data: []});
                return [];
            }
        }catch(error){
            return [];
        }
    }
}

class Window {
    constructor(width, height){
        this.w = width || 1200;
        this.h = height || 800;
        this.mainWindow;
        this.indexPath = path.join(__dirname, '/renderer/index.html');
        this.iconPath = path.join(__dirname, '/images/icon.png');
        this.preloadPath = path.join(__dirname, 'preload.js');
        this.tsAuth = new TSAuthentication();
        this.strategy = new Strategy();
    }

    initIpc(){
         // tradestation
        ipcMain.on('getRefreshToken', async (event, _) => {
            const tokenObj = await this.tsAuth.triggerRefresh();
            event.reply('sendRefreshToken', {ts: tokenObj});
        });
        ipcMain.on('getNewAccessToken', async (event, _) => {
            const tokenObj = await this.tsAuth.getNewAccessToken();
            event.reply('sendNewAccessToken', {ts: tokenObj});
        });

        //Backtest Strategies
        ipcMain.on('getStrategies', async (event, _) => {
            var arr = this.strategy.getStrategies();
            event.reply('sendStrategies', {data: arr});
        });
        ipcMain.on('getSaveStrategy', async (event, arg) => {
            var pass = this.strategy.saveStrategy(arg);
            event.reply('sendSaveStreategy', {data: pass});
        });
        ipcMain.on('getDeleteStrategy', async (event, arg) => {
            var pass = this.strategy.deleteStrategy(arg);
            event.reply('sendDeleteStreategy', {data: pass});
        });

        // WINDOW
        ipcMain.on('minimize-window', () => {
            if (this.mainWindow) {
                this.mainWindow.minimize();
            }
        });
    
        ipcMain.on('maximize-window', () => {
            if (this.mainWindow) {
                if (this.mainWindow.isMaximized()) {
                    this.mainWindow.restore();
                } else {
                    this.mainWindow.maximize();
                }
            }
        });
        
        ipcMain.on('close-window', () => {
            if (this.mainWindow) {
                this.mainWindow.close();
            }
        });
    }
    
    create() {
      this.initIpc();
      this.mainWindow = new BrowserWindow({
        icon: this.iconPath,
        width: this.w,
        height: this.h,
        fullscreen: process.platform.includes('win') ? false : true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            sandbox: false,
            preload: this.preloadPath,
            csp: false,
        },
        frame: false,
        contentSecurityPolicy: "script-src 'self' 'unsafe-inline'; object-src 'self'"

      });
      this.mainWindow.loadFile(this.indexPath);
      // mainWindow.webContents.openDevTools()
    }

  }


  module.exports = Window;