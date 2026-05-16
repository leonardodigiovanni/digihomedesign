import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const settingsPath = path.join(__dirname, '..', 'data', 'settings.json')
const data = fs.readFileSync(settingsPath, 'utf-8')

const db = await mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'mef',
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS app_settings (
    id   INT NOT NULL DEFAULT 1,
    data JSON NOT NULL,
    PRIMARY KEY (id)
  )
`)

await db.execute(
  'INSERT INTO app_settings (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
  [data]
)

console.log('✓ Settings migrati nel DB correttamente.')
await db.end()
