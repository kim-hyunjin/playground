import { app, BrowserWindow, screen } from 'electron';
import path from 'path';

const createWindow = (): void => {
  const { height } = screen.getPrimaryDisplay().workAreaSize;
  const mainWindow = new BrowserWindow({
    minWidth: 800,
    height: height,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 개발모드에서 hmr 지원. MAIN_WINDOW_VITE_DEV_SERVER_URL 값은 forge.config.mts에 @electron-forge/plugin-vite 설정에 의해 주입됨.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
