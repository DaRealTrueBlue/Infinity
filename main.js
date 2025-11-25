const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        },
        icon: path.join(__dirname, 'logo.png'),
        title: 'Infinity Browser',
        backgroundColor: '#ffffff',
        show: false
    });

    mainWindow.loadFile('index.html');

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Open DevTools in development mode (optional)
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Set application menu
    const { Menu } = require('electron');
    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'New Tab',
                    accelerator: 'CmdOrCtrl+T',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('createNewTab()');
                    }
                },
                {
                    label: 'Close Tab',
                    accelerator: 'CmdOrCtrl+W',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('closeTab(currentTabId)');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('refresh()');
                    }
                },
                {
                    label: 'Force Reload',
                    accelerator: 'CmdOrCtrl+Shift+R',
                    click: () => {
                        mainWindow.reload();
                    }
                },
                { type: 'separator' },
                { role: 'togglefullscreen' },
                { type: 'separator' },
                {
                    label: 'Zoom In',
                    accelerator: 'CmdOrCtrl+Plus',
                    click: () => {
                        const currentZoom = mainWindow.webContents.getZoomLevel();
                        mainWindow.webContents.setZoomLevel(currentZoom + 1);
                    }
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'CmdOrCtrl+-',
                    click: () => {
                        const currentZoom = mainWindow.webContents.getZoomLevel();
                        mainWindow.webContents.setZoomLevel(currentZoom - 1);
                    }
                },
                {
                    label: 'Reset Zoom',
                    accelerator: 'CmdOrCtrl+0',
                    click: () => {
                        mainWindow.webContents.setZoomLevel(0);
                    }
                }
            ]
        },
        {
            label: 'Navigate',
            submenu: [
                {
                    label: 'Back',
                    accelerator: 'Alt+Left',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('goBack()');
                    }
                },
                {
                    label: 'Forward',
                    accelerator: 'Alt+Right',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('goForward()');
                    }
                },
                {
                    label: 'Home',
                    accelerator: 'Alt+Home',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('goHome()');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Focus Address Bar',
                    accelerator: 'CmdOrCtrl+L',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('document.getElementById("url-bar").focus(); document.getElementById("url-bar").select();');
                    }
                }
            ]
        },
        {
            label: 'Bookmarks',
            submenu: [
                {
                    label: 'Add Bookmark',
                    accelerator: 'CmdOrCtrl+D',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            const currentTab = getCurrentTab();
                            if (currentTab.url) {
                                addBookmark(currentTab.title, currentTab.url);
                                alert('Bookmark added!');
                            }
                        `);
                    }
                },
                {
                    label: 'Show Bookmarks Bar',
                    accelerator: 'CmdOrCtrl+Shift+B',
                    click: () => {
                        mainWindow.webContents.executeJavaScript('toggleBookmarks()');
                    }
                }
            ]
        },
        {
            label: 'Developer',
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'CmdOrCtrl+Shift+I',
                    click: () => {
                        mainWindow.webContents.toggleDevTools();
                    }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About Infinity Browser',
                    click: () => {
                        const { dialog } = require('electron');
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About Infinity Browser',
                            message: 'Infinity Browser',
                            detail: 'Version 1.0.0\n\nA modern, lightweight web browser built with Electron.\n\n∞'
                        });
                    }
                }
            ]
        }
    ]);

    Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
