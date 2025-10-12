import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Database from 'better-sqlite3'

// ✅ 1️⃣ Initialize database
const dbPath = join(app.getPath('userData'), 'chats.db')
const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
  );
`)

// ✅ 2️⃣ Define IPC handlers for SQLite operations
ipcMain.handle('get-chats', () => {
  return db.prepare('SELECT * FROM chats ORDER BY created_at DESC').all()
})

ipcMain.handle('create-chat', (_, title: string) => {
  const stmt = db.prepare('INSERT INTO chats (title) VALUES (?)')
  const info = stmt.run(title)
  return { id: info.lastInsertRowid, title }
})

ipcMain.handle('delete-chat', (_, chatId: number) => {
  db.prepare('DELETE FROM chats WHERE id = ?').run(chatId)
  return true
})

ipcMain.handle('get-messages', (_, chatId: number) => {
  return db.prepare('SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC').all(chatId)
})

ipcMain.handle('add-message', (_, { chatId, role, content }) => {
  const stmt = db.prepare('INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)')
  const info = stmt.run(chatId, role, content)
  return { id: info.lastInsertRowid }
})

// ✅ 3️⃣ Keep your Gemini API handler below these
ipcMain.handle('send-to-gemini', async (_, { apiKey, message }) => {
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', errorText)
      return { error: `HTTP ${response.status}: ${errorText}` }
    }

    const data = await response.json()
    return { data }
  } catch (err) {
    console.error('Fetch failed:', err)
    return { error: String(err) }
  }
})

// ✅ 4️⃣ Window setup stays at the bottom
function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
