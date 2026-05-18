const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Users table
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
    )
`);
db.run(`
    CREATE TABLE IF NOT EXISTS login_logs(
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   email TEXT,
   login_time TEXT
    )
   `);
   
// Login logs table
db.run(`
    CREATE TABLE IF NOT EXISTS login_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    email TEXT,
    success INTEGER,
    login_time TEXT
)
`);

module.exports = db;