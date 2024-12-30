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

    saveStartegy(name, code){
        try {
            if (fs.existsSync(this.path)) {
                var json = this.readStrategyFile();
                if (json?.data) {
                    var oldData = json?.data;
                    this.writeStrategyFile({data: [...oldData, {id: `_${randNum(1000, 100000)}`, name: name, code}]});
                    return {success: true, error: ""};
                } else {
                    this.writeStrategyFile({data: [{id: `_${randNum(1000, 100000)}`, name: name, code}]});
                    return {success: true, error: ""};
                }
            } else {
                this.writeStrategyFile({data: [{id: `_${randNum(1000, 100000)}`, name: name, code}]});
                return {success: true, error: ""};
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
            var pass = this.strategy.saveStartegy(arg?.name, arg?.code);
            event.reply('sendSaveStreategy', {data: pass});
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